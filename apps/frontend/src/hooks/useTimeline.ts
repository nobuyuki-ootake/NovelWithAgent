import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentProjectState } from "../store/atoms";
import {
  Character,
  CharacterStatus,
  PlaceElement,
  TimelineEvent,
  NovelProject,
  PlotElement,
  // WorldBuilding, // 未使用のためコメントアウト
  // WorldBuildingElement, // 未使用のためコメントアウト
  // WorldBuildingElementType, // 未使用のためコメントアウト
} from "@novel-ai-assistant/types";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import "moment/locale/ja";
import { SelectChangeEvent } from "@mui/material";

// moment.jsの日本語化
moment.locale("ja");

// タイムラインのグループ型定義（X軸: 場所）
export interface TimelineGroup {
  id: string;
  title: string;
}

// タイムラインのアイテム型定義（イベント）
export interface TimelineItem {
  id: string;
  placeId: string;
  placeName: string;
  title: string;
  date: string;
  dateValue: number;
  description?: string;
  relatedCharacters: string[];
  relatedCharacterNames?: string;
  relatedCharacterData?: Character[];
  eventType?: string;
}

// 設定ダイアログの状態
export interface TimelineSettings {
  startDate: string;
}

export function useTimeline() {
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [places, setPlaces] = useState<PlaceElement[]>([]);
  const [allPlots, setAllPlots] = useState<PlotElement[]>([]);

  // グラフ表示用のデータ
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [timelineGroups, setTimelineGroups] = useState<TimelineGroup[]>([]);

  // タイムラインの設定
  const [timelineSettings, setTimelineSettings] = useState<TimelineSettings>({
    startDate: new Date().toISOString().split("T")[0],
  });

  // 設定ダイアログの状態
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  // 新しいイベント用の状態
  const [newEvent, setNewEvent] = useState<TimelineEvent>({
    id: "",
    title: "",
    description: "",
    date: "",
    relatedCharacters: [],
    relatedPlaces: [],
    order: 0,
    eventType: "",
    postEventCharacterStatuses: {},
    relatedPlotIds: [],
  });

  // ダイアログの状態
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string>("");

  // スナックバーの状態
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // プロジェクトで定義済みの状態リストをuseStateで管理
  const [
    definedCharacterStatusesForDialog,
    setDefinedCharacterStatusesForDialog,
  ] = useState<CharacterStatus[]>([]);

  // 初期データのロード
  useEffect(() => {
    if (currentProject) {
      console.log(
        "[useTimeline] useEffect - START - currentProject.id:",
        currentProject.id
      );
      console.log(
        "[useTimeline] useEffect - START - currentProject.definedCharacterStatuses:",
        currentProject.definedCharacterStatuses
      );

      let projectDataToUse = { ...currentProject }; // Start with Recoil state

      // 最新のデータをローカルストレージから直接読み込み（優先的に使用）
      const projectId = currentProject.id;
      const projectsStr = localStorage.getItem("novelProjects");
      if (projectsStr) {
        try {
          const projects: NovelProject[] = JSON.parse(projectsStr);
          const latestProjectFromLocalStorage = projects.find(
            (p) => p.id === projectId
          );

          if (latestProjectFromLocalStorage) {
            console.log(
              "[useTimeline] Found project in localStorage:",
              latestProjectFromLocalStorage.id
            );
            console.log(
              "[useTimeline] localStorage project.definedCharacterStatuses:",
              latestProjectFromLocalStorage.definedCharacterStatuses
            );
            // 簡単な比較ロジック: ローカルストレージの方が新しいか、Recoil側が空ならローカルストレージを優先
            if (
              latestProjectFromLocalStorage.updatedAt >
                projectDataToUse.updatedAt ||
              (latestProjectFromLocalStorage.definedCharacterStatuses &&
                latestProjectFromLocalStorage.definedCharacterStatuses.length >
                  0 &&
                (!projectDataToUse.definedCharacterStatuses ||
                  projectDataToUse.definedCharacterStatuses.length === 0))
            ) {
              console.log(
                "[useTimeline] Using project data from localStorage as it seems newer or more complete for statuses."
              );
              projectDataToUse = { ...latestProjectFromLocalStorage };
              // Recoilのatomも更新する
              setCurrentProject(projectDataToUse);
            }
          }
        } catch (error) {
          console.error("[useTimeline] LocalStorage parsing error:", error);
        }
      }

      console.log(
        "[useTimeline] useEffect - projectDataToUse.definedCharacterStatuses (after LS check):",
        projectDataToUse.definedCharacterStatuses
      );

      setTimelineEvents(projectDataToUse.timeline || []);
      setCharacters(projectDataToUse.characters || []);
      setPlaces(projectDataToUse.worldBuilding?.places || []);
      setDefinedCharacterStatusesForDialog(
        projectDataToUse.definedCharacterStatuses || []
      ); // useStateで更新
      setAllPlots(projectDataToUse.plot || []); // プロット情報をセット

      // 設定を読み込み
      if (projectDataToUse.worldBuilding?.timelineSettings?.startDate) {
        setTimelineSettings({
          startDate: projectDataToUse.worldBuilding.timelineSettings.startDate,
        });
      }
      console.log(
        "[useTimeline] useEffect - END - currentProject.definedCharacterStatuses (Recoil state after potential update):",
        currentProject?.definedCharacterStatuses // Log Recoil state again
      );
    } else {
      console.log("[useTimeline] useEffect - currentProject is null");
    }
  }, [currentProject]); // setCurrentProject を依存配列から削除

  // 地名（グループ）の更新
  useEffect(() => {
    if (places.length > 0) {
      // 未分類グループを先頭に追加
      const groups: TimelineGroup[] = [{ id: "unassigned", title: "未分類" }];

      // 地名をグループとして追加
      places.forEach((place) => {
        groups.push({
          id: place.id,
          title: place.name,
        });
      });

      setTimelineGroups(groups);
    }
  }, [places]);

  const sortedTimelineEvents = useMemo(() => {
    if (
      !currentProject ||
      !currentProject.plot ||
      currentProject.plot.length === 0
    ) {
      // プロット情報がない場合は、日付でソートし、次に order でソート
      return [...timelineEvents].sort((a, b) => {
        const dateA = moment(a.date).valueOf();
        const dateB = moment(b.date).valueOf();
        if (dateA !== dateB) {
          return dateA - dateB;
        }
        return (a.order || 0) - (b.order || 0);
      });
    }

    const plotOrderMap = new Map<string, number>(
      currentProject.plot.map((p) => [p.id, p.order])
    );

    return [...timelineEvents].sort((a, b) => {
      // 関連プロットIDの最初の有効なものを取得、なければ未定義
      const getFirstValidPlotId = (
        event: TimelineEvent
      ): string | undefined => {
        if (!event.relatedPlotIds || event.relatedPlotIds.length === 0)
          return undefined;
        return event.relatedPlotIds.find((pid) => plotOrderMap.has(pid));
      };

      const plotIdA = getFirstValidPlotId(a);
      const plotIdB = getFirstValidPlotId(b);

      const plotOrderA = plotIdA ? plotOrderMap.get(plotIdA)! : Infinity;
      const plotOrderB = plotIdB ? plotOrderMap.get(plotIdB)! : Infinity;

      if (plotOrderA !== plotOrderB) {
        return plotOrderA - plotOrderB;
      }

      const dateA = moment(a.date).valueOf();
      const dateB = moment(b.date).valueOf();
      if (dateA !== dateB) {
        return dateA - dateB;
      }
      return (a.order || 0) - (b.order || 0); // 同じプロット、同じ日付の場合は元の order
    });
  }, [timelineEvents, currentProject]);

  // イベントをグラフデータに変換
  useEffect(() => {
    if (sortedTimelineEvents.length > 0 && timelineGroups.length > 0) {
      const items: TimelineItem[] = sortedTimelineEvents.map((event) => {
        // 関連する地名がある場合はその最初の場所に配置、なければ「未分類」に
        const placeId =
          event.relatedPlaces.length > 0
            ? event.relatedPlaces[0]
            : "unassigned";

        // 地名を取得
        const place = timelineGroups.find((group) => group.id === placeId);
        const placeName = place ? place.title : "未分類";

        // 関連キャラクターのデータを取得
        const relatedCharacterData = characters.filter((char) =>
          event.relatedCharacters.includes(char.id)
        );

        // 関連キャラクター名を取得
        const characterNames = relatedCharacterData
          .map((char) => char.name)
          .join(", ");

        // 日付をmoment形式に変換
        const dateValue = moment(event.date).valueOf();

        return {
          id: event.id,
          placeId,
          placeName,
          title: event.title,
          date: event.date,
          dateValue,
          description: event.description,
          relatedCharacters: event.relatedCharacters,
          relatedCharacterNames: characterNames,
          relatedCharacterData,
          eventType: event.eventType,
        };
      });

      setTimelineItems(items);
    } else {
      setTimelineItems([]);
    }
  }, [sortedTimelineEvents, timelineGroups, characters]);

  const addTimelineEventsBatch = useCallback(
    (newEvents: TimelineEvent[]) => {
      if (!currentProject) return;

      // 新しいイベントを既存のイベントリストと結合
      // IDの重複を避けるため、もしIDが既存のものと衝突する場合は新しいIDを振ることも検討できますが、
      // crypto.randomUUID() を使っているので、基本的には衝突しない想定。
      const updatedTimelineEvents = [...timelineEvents, ...newEvents].sort(
        (a, b) => (a.order || 0) - (b.order || 0) // orderでソート
      );

      setTimelineEvents(updatedTimelineEvents);

      // currentProject を更新
      setCurrentProject({
        ...currentProject,
        timeline: updatedTimelineEvents,
        updatedAt: new Date(), // 更新日時を更新
      });

      setHasUnsavedChanges(true);
      setSnackbarMessage(
        `${newEvents.length}件のイベントがタイムラインに追加されました。`
      );
      setSnackbarOpen(true);
    },
    [currentProject, timelineEvents, setCurrentProject]
  );

  // ダイアログを開く
  const handleOpenDialog = useCallback(
    (event?: TimelineEvent) => {
      // ダイアログを開く前に、もう一度地名データの確認
      // 万が一データが読み込まれていない場合に再読み込み
      if (
        places.length === 0 &&
        currentProject &&
        currentProject.worldBuilding &&
        currentProject.worldBuilding.places &&
        currentProject.worldBuilding.places.length > 0
      ) {
        console.log("Refreshing places data before opening dialog");
        setPlaces(currentProject.worldBuilding.places);
      }

      // 現在のplaces配列をログ出力
      console.log("Places when opening dialog:", places);

      if (event) {
        setNewEvent({
          ...event,
          order: event.order ?? 0,
          postEventCharacterStatuses: event.postEventCharacterStatuses || {},
          relatedPlotIds: event.relatedPlotIds || [],
        });
        setIsEditing(true);
        setCurrentEventId(event.id);
      } else {
        setNewEvent({
          id: "",
          title: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          relatedCharacters: [],
          relatedPlaces: [],
          order: timelineEvents.length, // 新規は末尾
          eventType: "",
          postEventCharacterStatuses: {},
          relatedPlotIds: [],
        });
        setIsEditing(false);
        setCurrentEventId("");
      }
      setDialogOpen(true);
    },
    [places, currentProject, timelineEvents]
  );

  // 設定ダイアログを開く
  const handleOpenSettingsDialog = useCallback(() => {
    setSettingsDialogOpen(true);
  }, []);

  // 設定ダイアログを閉じる
  const handleCloseSettingsDialog = useCallback(() => {
    setSettingsDialogOpen(false);
  }, []);

  // 設定を保存
  const handleSaveSettings = useCallback(() => {
    if (!currentProject) return;

    // プロジェクトに設定を保存
    setCurrentProject({
      ...currentProject,
      worldBuilding: {
        ...currentProject.worldBuilding,
        timelineSettings,
      },
      updatedAt: new Date(),
    });

    setSettingsDialogOpen(false);
    setSnackbarMessage("タイムライン設定を保存しました");
    setSnackbarOpen(true);
  }, [currentProject, timelineSettings, setCurrentProject]);

  // 設定の変更を処理
  const handleSettingsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTimelineSettings({
        ...timelineSettings,
        [name]: value,
      });
    },
    [timelineSettings]
  );

  // ダイアログを閉じる
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  // イベントの変更を処理
  const handleEventChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>,
      field?: string
    ) => {
      if (field === "eventType") {
        // SelectChangeEventの場合
        const value = (e as SelectChangeEvent<string>).target.value;
        setNewEvent((prev) => ({
          ...prev,
          eventType: value,
        }));
      } else {
        // HTMLInputElement | HTMLTextAreaElement の場合
        const { name, value } = e.target as
          | HTMLInputElement
          | HTMLTextAreaElement;
        setNewEvent((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    [newEvent]
  );

  // 関連キャラクターの変更を処理
  const handleCharactersChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;
      setNewEvent({
        ...newEvent,
        relatedCharacters: typeof value === "string" ? value.split(",") : value,
      });
    },
    [newEvent]
  );

  // 関連場所の変更を処理
  const handlePlacesChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;
      setNewEvent({
        ...newEvent,
        relatedPlaces: typeof value === "string" ? value.split(",") : value,
      });
    },
    [newEvent]
  );

  // イベントの追加/編集
  const handleSaveEvent = useCallback(() => {
    if (!newEvent.title.trim() || !newEvent.date) {
      return;
    }

    let updatedEvent: TimelineEvent;
    if (isEditing) {
      // 既存のイベントを更新
      updatedEvent = {
        ...newEvent,
        id: currentEventId,
        order: newEvent.order ?? 0,
        eventType: newEvent.eventType || "",
        relatedPlotIds: newEvent.relatedPlotIds || [],
      };
      const updatedEvents = timelineEvents.map((event) =>
        event.id === currentEventId ? updatedEvent : event
      );
      setTimelineEvents(updatedEvents);
    } else {
      // 新しいイベントを追加
      updatedEvent = {
        ...newEvent,
        id: uuidv4(),
        order: timelineEvents.length,
        eventType: newEvent.eventType || "",
        relatedPlotIds: newEvent.relatedPlotIds || [],
      };
      setTimelineEvents([...timelineEvents, updatedEvent]);
    }

    setHasUnsavedChanges(true);
    setDialogOpen(false);
  }, [timelineEvents, newEvent, isEditing, currentEventId]);

  // イベントをクリックしたときの処理
  const handleEventClick = useCallback(
    (id: string) => {
      const event = timelineEvents.find((event) => event.id === id);
      if (event) {
        handleOpenDialog(event);
      }
    },
    [timelineEvents, handleOpenDialog]
  );

  // プロジェクトとローカルストレージに保存する
  const handleSave = useCallback(() => {
    if (!currentProject) return;

    // 現在のタイムラインイベントを更新
    const updatedProject = {
      ...currentProject,
      timeline: timelineEvents,
      updatedAt: new Date(),
    };

    console.log("保存前のプロジェクト:", currentProject);
    console.log("保存するタイムラインイベント:", timelineEvents);
    console.log("更新後のプロジェクト:", updatedProject);

    // Recoilのステートを更新
    setCurrentProject(updatedProject);

    // ローカルストレージを更新
    const projectsStr = localStorage.getItem("novelProjects");
    if (projectsStr) {
      const projects = JSON.parse(projectsStr);
      const updatedProjects = projects.map((p: NovelProject) =>
        p.id === updatedProject.id ? updatedProject : p
      );
      localStorage.setItem("novelProjects", JSON.stringify(updatedProjects));
      console.log("ローカルストレージに保存しました:", updatedProjects);
    }

    // 成功メッセージを表示
    setSnackbarMessage("タイムラインを保存しました");
    setSnackbarOpen(true);
    setHasUnsavedChanges(false);
  }, [currentProject, timelineEvents, setCurrentProject]);

  // スナックバーを閉じる
  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // キャラクター名を取得
  const getCharacterName = useCallback(
    (id: string) => {
      const character = characters.find((char) => char.id === id);
      return character ? character.name : "不明なキャラクター";
    },
    [characters]
  );

  // 場所名を取得
  const getPlaceName = useCallback(
    (id: string) => {
      const place = places.find((p) => p.id === id);
      return place ? place.name : "不明な場所";
    },
    [places]
  );

  // グラフのデータを準備
  const prepareChartData = useCallback(() => {
    // X軸のラベル（地名）
    const xLabels = timelineGroups.map((group) => group.title);

    // X軸のインデックスとID
    const xAxisData = timelineGroups.map((group, index) => {
      return { index, id: group.id, title: group.title };
    });

    // イベントデータ（散布図用）
    const scatterData = timelineItems.map((item) => {
      // 該当する地名のインデックスを取得
      const xIndex = xAxisData.findIndex((x) => x.id === item.placeId);

      return {
        id: item.id,
        x: xIndex >= 0 ? xIndex : 0, // 地名のインデックス
        y: item.dateValue, // 日時の値はタイムスタンプのまま
        label: item.title,
        info: item, // ツールチップ表示用
      };
    });

    return {
      xLabels,
      xAxisData,
      scatterData,
    };
  }, [timelineGroups, timelineItems]);

  // グラフデータを準備
  const { scatterData } = useMemo(() => prepareChartData(), [prepareChartData]);

  // 安全にy値の最小値と最大値を計算
  const safeMinY = useMemo(
    () =>
      scatterData.length > 0
        ? Math.min(...scatterData.map((d) => d.y)) - 86400000 * 5 // 最小日付から5日前
        : moment().add(-1, "month").valueOf(), // デフォルトは1ヶ月前
    [scatterData]
  );

  const safeMaxY = useMemo(
    () =>
      scatterData.length > 0
        ? Math.max(...scatterData.map((d) => d.y)) + 86400000 * 5 // 最大日付から5日後
        : moment().add(1, "month").valueOf(), // デフォルトは1ヶ月後
    [scatterData]
  );

  // 表示する日付の配列を作成（10日分）
  const dateArray = useMemo(() => {
    const result = [];
    const dayRange = (safeMaxY - safeMinY) / (10 * 86400000); // 約10日分の間隔

    for (let i = 0; i <= 10; i++) {
      const date = moment(safeMinY)
        .add(i * dayRange, "days")
        .valueOf();
      result.push({
        date,
        label: moment(date).format("YYYY/MM/DD"),
      });
    }
    return result;
  }, [safeMinY, safeMaxY]);

  // イベントの位置計算関数
  const calculateEventPosition = useCallback(
    (placeId: string, dateValue: number): { xPos: number; yPos: number } => {
      // X軸（場所）位置: グループのインデックスを使用
      const groupIndex = timelineGroups.findIndex((g) => g.id === placeId);
      // 場所が見つからない場合は「未分類」（インデックス0）を使用
      const xPos = groupIndex >= 0 ? groupIndex : 0;

      // Y軸（日付）位置: 日付範囲内の相対位置（0～1）を計算
      let yPos = 0;

      if (dateArray.length >= 2) {
        const minDate = dateArray[0].date;
        const maxDate = dateArray[dateArray.length - 1].date;
        const range = maxDate - minDate;

        if (range > 0) {
          // 正規化した位置（0～1の範囲）
          yPos = (dateValue - minDate) / range;

          // 時間軸の目盛り線に正確に合わせる
          // 最も近い日付のインデックスを見つける
          let closestIndex = 0;
          let minDistance = Number.MAX_VALUE;

          for (let i = 0; i < dateArray.length; i++) {
            const distance = Math.abs(dateValue - dateArray[i].date);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = i;
            }
          }

          // 最も近い日付の位置を使用
          yPos = closestIndex / (dateArray.length - 1);

          // 範囲を超えないようにclamp
          yPos = Math.max(0, Math.min(1, yPos));
        }
      }

      // X軸位置に小数点以下の揺らぎを加える（各イベントが少しずれて表示されるように）
      // パラメータとして日付の値を使用して、異なる日付のイベントが異なる位置になるようにする
      const offset = (dateValue % 7) / 14 - 0.25; // -0.25～+0.25の範囲でオフセット
      const adjustedXPos = xPos + offset;

      return { xPos: adjustedXPos, yPos };
    },
    [timelineGroups, dateArray]
  );

  // クリック位置からイベントを作成
  const createEventFromPosition = useCallback(
    (xRatio: number, yRatio: number) => {
      // X軸（場所）の計算
      const placeIndex = Math.floor(xRatio * timelineGroups.length);
      const place = timelineGroups[placeIndex];

      // Y軸（時間）の計算
      const dateRange = safeMaxY - safeMinY;
      const dateValue = safeMinY + dateRange * yRatio;
      const date = moment(dateValue).format("YYYY-MM-DD");

      // イベントをダイアログで作成
      const newEventAtGrid = {
        id: "",
        title: "",
        description: "",
        date: date,
        relatedCharacters: [],
        relatedPlaces: place ? [place.id] : ["unassigned"],
        order: timelineEvents.length,
        eventType: "",
        postEventCharacterStatuses: {},
        relatedPlotIds: [],
      };

      setNewEvent(newEventAtGrid);
      setIsEditing(false);
      setCurrentEventId("");
      setDialogOpen(true);
    },
    [timelineGroups, safeMinY, safeMaxY, timelineEvents]
  );

  // イベントの順序を更新する
  const handleReorderEvents = useCallback(
    (reorderedItems: TimelineItem[]) => {
      // TimelineItem[] から TimelineEvent[] への変換
      // id順でマッチングし、orderプロパティをindexで更新
      const updatedEvents = reorderedItems
        .map((item, idx) => {
          const original = timelineEvents.find((e) => e.id === item.id);
          return original ? { ...original, order: idx } : null;
        })
        .filter((e): e is TimelineEvent => e !== null);
      setTimelineEvents(updatedEvents);
      setHasUnsavedChanges(true);
    },
    [timelineEvents]
  );

  // イベント後のキャラクター状態を更新するハンドラ
  const handlePostEventStatusChange = useCallback(
    (characterId: string, newStatuses: CharacterStatus[]) => {
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        postEventCharacterStatuses: {
          ...(prevEvent.postEventCharacterStatuses || {}),
          [characterId]: newStatuses,
        },
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  // 関連プロットの変更を処理
  const handleRelatedPlotsChange = useCallback(
    (selectedPlotIds: string[]) => {
      setNewEvent((prev) => ({
        ...prev,
        relatedPlotIds: selectedPlotIds,
      }));
    },
    [newEvent]
  );

  return {
    // 状態
    currentProject,
    timelineEvents,
    characters,
    places,
    timelineItems,
    timelineGroups,
    timelineSettings,
    settingsDialogOpen,
    newEvent,
    dialogOpen,
    isEditing,
    currentEventId,
    snackbarOpen,
    snackbarMessage,
    hasUnsavedChanges,
    definedCharacterStatuses: definedCharacterStatusesForDialog,
    allPlots,
    safeMinY,
    safeMaxY,
    dateArray,

    // ハンドラー
    handleOpenDialog,
    handleOpenSettingsDialog,
    handleCloseSettingsDialog,
    handleSaveSettings,
    handleSettingsChange,
    handleCloseDialog,
    handleEventChange,
    handleCharactersChange,
    handlePlacesChange,
    handleSaveEvent,
    handleEventClick,
    handleSave,
    handleCloseSnackbar,
    getCharacterName,
    getPlaceName,
    calculateEventPosition,
    createEventFromPosition,
    handleReorderEvents,
    handlePostEventStatusChange,
    addTimelineEventsBatch,
    handleRelatedPlotsChange,
  };
}

// キャラクターの役割に応じたアイコンとカラーを定義
export const getCharacterIcon = (character: Character) => {
  switch (character.role) {
    case "protagonist":
      return {
        color: "#FFD700", // ゴールド
        emoji: "👑",
      };
    case "antagonist":
      return {
        color: "#DC143C", // クリムゾン
        emoji: "😈",
      };
    case "supporting":
      return {
        color: "#4169E1", // ロイヤルブルー
        emoji: "🙂",
      };
    default:
      return {
        color: "#808080", // グレー
        emoji: "👤",
      };
  }
};
