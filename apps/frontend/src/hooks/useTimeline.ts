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
// import { v4 as uuidv4 } from "uuid"; // 未使用のため削除
import moment from "moment";
import "moment/locale/ja";
import { SelectChangeEvent } from "@mui/material"; // SelectChangeEvent をインポート

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
  date: string; // ISOString
  dateValue: number;
  description?: string;
  relatedCharacters: string[];
  relatedCharacterNames?: string;
  relatedCharacterData?: Character[];
  eventType?: string;
}

// 設定ダイアログの状態
export interface TimelineSettings {
  startDate: string; // yyyy-MM-dd
}

// ファイル先頭の仮定義ハンドラのうち、今回実装しないものは残す
// const handleOpenDialog = () => {}; // 実装するため削除
// const handleOpenSettingsDialog = () => {}; // 実装するため削除
// const handleCloseSettingsDialog = () => {}; // 実装するため削除
const handleSaveSettings = () => {};
// const handleSettingsChange = (_: any) => {}; // SelectChangeEvent<string> に合わせる
// const handleCloseDialog = () => {}; // 実装するため削除
// const handleEventChange = (..) => {}; // 下で修正
// const handleCharactersChange = (..) => {}; // 下で修正
// const handlePlacesChange = (..) => {}; // 下で修正
const handleSaveEvent = () => {}; // handleSave にリネームされる可能性あり
// const handleEventClick = (_: TimelineItem) => {}; // 実装済み
const handleCloseSnackbar = () => {};
const getCharacterName = (_: string): string => "";
const getPlaceName = (_: string): string => "";
const calculateEventPosition = (_: number, __: number) => {};
const createEventFromPosition = (_: number, __: number) => {};
const handleReorderEvents = (_: TimelineEvent[]) => {};
// const handlePostEventStatusChange = (..) => {}; // 下で修正
// const handleRelatedPlotsChange = (..) => {}; // 下で修正

// TimelineEventDialogProps に合わせたハンドラの仮定義
const handleSettingsChange = (
  _e:
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | SelectChangeEvent<string>,
  _field?: string
) => {};

const handleEventChange = (
  _e:
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | SelectChangeEvent<string>,
  _field?: string
) => {
  // TODO: setNewEvent を使ってnewEventを更新するロジック
};

const handleCharactersChange = (_event: SelectChangeEvent<string[]>) => {
  // TODO: setNewEvent を使ってnewEvent.relatedCharactersを更新するロジック
};

const handlePlacesChange = (_event: SelectChangeEvent<string[]>) => {
  // TODO: setNewEvent を使ってnewEvent.relatedPlacesを更新するロジック
};

const handlePostEventStatusChange = (
  _characterId: string,
  _newStatuses: CharacterStatus[]
) => {
  // TODO: setNewEvent を使ってnewEvent.postEventCharacterStatusesを更新するロジック
};

const handleRelatedPlotsChange = (_selectedPlotIds: string[]) => {
  // TODO: setNewEvent を使ってnewEvent.relatedPlotIdsを更新するロジック
};

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

  // Y軸の日付範囲と目盛り
  const [dateArray, setDateArray] = useState<string[]>([]);
  const [safeMinY, setSafeMinY] = useState<number>(0);
  const [safeMaxY, setSafeMaxY] = useState<number>(0);

  // タイムラインの設定
  const [timelineSettings, setTimelineSettings] = useState<TimelineSettings>({
    startDate: moment().format("YYYY-MM-DD"), // 初期値を yyyy-MM-dd に
  });

  // 設定ダイアログの状態
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  // 新しいイベント用の状態
  const [newEvent, setNewEvent] = useState<TimelineEvent>({
    id: "",
    title: "",
    description: "",
    date: moment().toISOString(), // 初期値はISOString
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

  // ★ 新しい関数: イベントの場所と日時を更新
  const handleUpdateEventLocationAndDate = useCallback(
    (eventId: string, newPlaceId: string, newDate: string) => {
      setTimelineEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId
            ? { ...event, placeId: newPlaceId, date: newDate }
            : event
        )
      );
      setHasUnsavedChanges(true);
      console.log(
        `[useTimeline] Event ${eventId} updated via D&D: placeId=${newPlaceId}, date=${newDate}`
      );
    },
    [setTimelineEvents, setHasUnsavedChanges]
  );

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
  }, [currentProject, setCurrentProject]);

  // Y軸の日付範囲と目盛りを計算
  useEffect(() => {
    if (timelineSettings.startDate) {
      const start = moment(timelineSettings.startDate, "YYYY-MM-DD");
      const dates: string[] = [];
      // startDateから前後7日間（合計15日間）
      for (let i = -7; i <= 7; i++) {
        dates.push(start.clone().add(i, "days").format("YYYY-MM-DD"));
      }
      setDateArray(dates);
      if (dates.length > 0) {
        const minY = moment(dates[0], "YYYY-MM-DD").valueOf();
        // 最終日は終日を含むように、またチャートの表示領域を考慮して、最終日の翌日の0時をMaxとする
        const maxY = moment(dates[dates.length - 1], "YYYY-MM-DD")
          .add(1, "day")
          .startOf("day")
          .valueOf();
        setSafeMinY(minY);
        setSafeMaxY(maxY);
        console.log("[useTimeline] Y-axis calculation:", {
          startDate: timelineSettings.startDate,
          dates,
          minY,
          maxY,
        });
      }
    }
  }, [timelineSettings.startDate]);

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

  // timelineItemsの生成ロジックを修正
  useEffect(() => {
    // timelineEventsが未定義または空でも、charactersやplacesが処理されるように条件を調整
    // sortedTimelineEventsを使うので、timelineEvents自体の長さチェックは不要になるケースもある
    if (characters && places) {
      const items = sortedTimelineEvents.map((event) => {
        // index は未使用
        // sortedTimelineEvents を使用
        const place = places.find((p) => p.id === event.placeId);
        const relatedCharacterNames = event.relatedCharacters
          .map((charId) => {
            const char = characters.find((c) => c.id === charId);
            return char ? char.name : "不明";
          })
          .join(", ");

        const relatedCharacterData = (event.relatedCharacters || [])
          .map((charId) => characters.find((c) => c.id === charId))
          .filter((c) => !!c) as Character[];

        return {
          id: event.id,
          placeId: event.placeId || "unassigned",
          placeName: place ? place.name : "未分類",
          title: event.title,
          date: event.date,
          dateValue: moment(event.date).valueOf(),
          description: event.description,
          relatedCharacters: event.relatedCharacters,
          relatedCharacterNames: relatedCharacterNames,
          relatedCharacterData: relatedCharacterData,
          eventType: event.eventType,
        };
      });
      setTimelineItems(items);
    }
  }, [sortedTimelineEvents, characters, places]);

  // ダイアログ用の登場人物ステータス定義の取得
  const definedCharacterStatuses = useMemo(() => {
    // console.log(
    //   "[useTimeline] definedCharacterStatuses useMemo - currentProject.definedCharacterStatuses:",
    //   currentProject?.definedCharacterStatuses
    // );
    // console.log(
    //   "[useTimeline] definedCharacterStatuses useMemo - definedCharacterStatusesForDialog (useState):",
    //   definedCharacterStatusesForDialog
    // );
    return (
      currentProject?.definedCharacterStatuses ||
      definedCharacterStatusesForDialog ||
      []
    );
  }, [
    currentProject?.definedCharacterStatuses,
    definedCharacterStatusesForDialog,
  ]);

  // イベントを一括で追加する関数
  const addTimelineEventsBatch = useCallback(
    (newEvents: TimelineEvent[]) => {
      setTimelineEvents((prevEvents) => {
        const updatedEvents = [...prevEvents];
        let maxOrderInBatch = prevEvents.reduce(
          (max, item) => Math.max(max, item.order || 0),
          0
        );
        newEvents.forEach((newEvent) => {
          if (!updatedEvents.find((e) => e.id === newEvent.id)) {
            maxOrderInBatch++;
            updatedEvents.push({
              ...newEvent,
              order: newEvent.order || maxOrderInBatch,
            });
          }
        });
        return updatedEvents;
      });
      setHasUnsavedChanges(true);
    },
    [setTimelineEvents, setHasUnsavedChanges]
  );

  // 変更をプロジェクトに保存する関数
  const handleSave = useCallback(async () => {
    if (currentProject) {
      const updatedProject: NovelProject = {
        ...currentProject,
        timeline: sortedTimelineEvents, // 保存時はソート済みのイベントリストを使用
        worldBuilding: {
          ...currentProject.worldBuilding,
          timelineSettings: timelineSettings,
          places: places,
        },
        characters: characters,
        plot: allPlots,
        definedCharacterStatuses: definedCharacterStatuses,
        updatedAt: new Date(), // toISOString() を削除して Date 型に
      };

      try {
        const projectsStr = localStorage.getItem("novelProjects");
        const projects: NovelProject[] = projectsStr
          ? JSON.parse(projectsStr)
          : [];
        const projectIndex = projects.findIndex(
          (p) => p.id === currentProject.id
        );
        if (projectIndex > -1) {
          projects[projectIndex] = updatedProject;
        } else {
          projects.push(updatedProject);
        }
        localStorage.setItem("novelProjects", JSON.stringify(projects));
        setCurrentProject(updatedProject);

        setHasUnsavedChanges(false);
        setSnackbarMessage("タイムラインが保存されました。");
        setSnackbarOpen(true);
        console.log("[useTimeline] Project saved:", updatedProject);
      } catch (error) {
        console.error(
          "[useTimeline] Error saving project to localStorage:",
          error
        );
        setSnackbarMessage("保存中にエラーが発生しました。");
        setSnackbarOpen(true);
      }
    }
  }, [
    currentProject,
    setCurrentProject,
    sortedTimelineEvents, // timelineEvents から sortedTimelineEvents に変更
    timelineSettings,
    characters,
    places,
    allPlots,
    definedCharacterStatuses,
  ]);

  // モーダル開閉ハンドラの実装
  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true);
    setIsEditing(false);
    setCurrentEventId("");
    setNewEvent({
      id: "", // 新規作成時はuuidv4()などで生成するべきだが、一旦空文字
      title: "",
      description: "",
      date: moment().toISOString(),
      relatedCharacters: [],
      relatedPlaces: [],
      order: timelineEvents.length, // 仮。実際はもっと賢いロジックが必要
      eventType: "",
      postEventCharacterStatuses: {},
      relatedPlotIds: [],
    });
  }, [
    timelineEvents.length,
    setNewEvent,
    setDialogOpen,
    setIsEditing,
    setCurrentEventId,
  ]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, [setDialogOpen]);

  const handleOpenSettingsDialog = useCallback(() => {
    setSettingsDialogOpen(true);
  }, [setSettingsDialogOpen]);

  const handleCloseSettingsDialog = useCallback(() => {
    setSettingsDialogOpen(false);
  }, [setSettingsDialogOpen]);

  const handleEventClick = useCallback(
    (id: string) => {
      const eventToEdit = timelineEvents.find((event) => event.id === id);
      if (eventToEdit) {
        setNewEvent(eventToEdit);
        setIsEditing(true);
        setCurrentEventId(id);
        setDialogOpen(true);
      } else {
        console.warn(
          `[useTimeline] Event with id ${id} not found for editing.`
        );
        handleOpenDialog();
      }
    },
    [
      timelineEvents,
      setNewEvent,
      setIsEditing,
      setCurrentEventId,
      setDialogOpen,
      handleOpenDialog,
    ]
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
    newEvent, // newEvent を返すように修正
    dialogOpen, // dialogOpen を返すように修正
    isEditing, // isEditing を返すように修正
    currentEventId, // currentEventId を返すように修正
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
    handleUpdateEventLocationAndDate,
  };
}
