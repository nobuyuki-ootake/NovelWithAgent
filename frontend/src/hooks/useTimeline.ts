import { useState, useEffect, useMemo, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentProjectState } from "../store/atoms";
import { Character, Place } from "../types";
import { TimelineEvent, NovelProject } from "../types/index";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
// @ts-expect-error -- moment-localeのインポートに型定義がないため
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
  const [places, setPlaces] = useState<Place[]>([]);

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
  });

  // ダイアログの状態
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string>("");

  // スナックバーの状態
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 初期データのロード
  useEffect(() => {
    if (currentProject) {
      console.log("currentProject in Timeline:", currentProject);
      setTimelineEvents(currentProject.timeline || []);
      setCharacters(currentProject.characters || []);

      // 設定を読み込み
      if (currentProject.worldBuilding?.timelineSettings?.startDate) {
        setTimelineSettings({
          startDate: currentProject.worldBuilding.timelineSettings.startDate,
        });
      }

      // 最新のデータをローカルストレージから直接読み込み（優先的に使用）
      const projectId = currentProject.id;
      const projectsStr = localStorage.getItem("novelProjects");
      if (projectsStr) {
        try {
          const projects: NovelProject[] = JSON.parse(projectsStr);
          const latestProject = projects.find((p) => p.id === projectId);
          if (
            latestProject &&
            latestProject.worldBuilding &&
            Array.isArray(latestProject.worldBuilding.places)
          ) {
            console.log(
              "最新のplaces from localStorage:",
              latestProject.worldBuilding.places
            );
            if (latestProject.worldBuilding.places.length > 0) {
              setPlaces(latestProject.worldBuilding.places);
              return; // ローカルストレージから取得できたら終了
            }
          }
        } catch (error) {
          console.error("LocalStorage parsing error:", error);
        }
      }

      // ローカルストレージから取得できなかった場合はcurrentProjectから取得
      if (currentProject.worldBuilding) {
        console.log(
          "places from worldBuilding:",
          currentProject.worldBuilding.places
        );

        // placesが配列であることを確認
        if (Array.isArray(currentProject.worldBuilding.places)) {
          console.log("Places set to:", currentProject.worldBuilding.places);
          setPlaces(currentProject.worldBuilding.places);
        } else {
          console.warn(
            "worldBuilding.places is not an array:",
            currentProject.worldBuilding.places
          );
          setPlaces([]);
        }
      } else {
        console.warn("worldBuilding is null or undefined");
        setPlaces([]);
      }
    }
  }, [currentProject]);

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

  // イベントをグラフデータに変換
  useEffect(() => {
    if (timelineEvents.length > 0 && timelineGroups.length > 0) {
      const items: TimelineItem[] = timelineEvents.map((event) => {
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
        };
      });

      setTimelineItems(items);
    } else {
      setTimelineItems([]);
    }
  }, [timelineEvents, timelineGroups, characters]);

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
        setNewEvent({ ...event });
        setIsEditing(true);
        setCurrentEventId(event.id);
      } else {
        setNewEvent({
          id: "",
          title: "",
          description: "",
          date: new Date().toISOString().split("T")[0], // 今日の日付をデフォルトに
          relatedCharacters: [],
          relatedPlaces: [],
        });
        setIsEditing(false);
        setCurrentEventId("");
      }
      setDialogOpen(true);
    },
    [places, currentProject]
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewEvent({
        ...newEvent,
        [name]: value,
      });
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

    if (isEditing) {
      // 既存のイベントを更新
      const updatedEvents = timelineEvents.map((event) =>
        event.id === currentEventId ? { ...newEvent } : event
      );
      setTimelineEvents(updatedEvents);
    } else {
      // 新しいイベントを追加
      const eventWithId = {
        ...newEvent,
        id: uuidv4(),
      };
      setTimelineEvents([...timelineEvents, eventWithId]);
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

  // 変更を保存
  const handleSave = useCallback(() => {
    if (!currentProject) return;

    setCurrentProject({
      ...currentProject,
      timeline: timelineEvents,
      updatedAt: new Date(),
    });

    setHasUnsavedChanges(false);
    setSnackbarMessage("タイムラインを保存しました");
    setSnackbarOpen(true);
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

  // イベントの位置を計算する関数
  const calculateEventPosition = useCallback(
    (placeId: string, dateValue: number) => {
      // X座標（場所）の計算
      const placeIndex = timelineGroups.findIndex((g) => g.id === placeId);
      const xPos = placeIndex !== -1 ? placeIndex : 0;

      // Y座標（日付）の計算
      const dateRange = safeMaxY - safeMinY;
      const yPos = (dateValue - safeMinY) / dateRange;

      return { xPos, yPos: 1 - yPos }; // Y軸は上から下に向かって時間が進むので反転
    },
    [timelineGroups, safeMinY, safeMaxY]
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
      };

      setNewEvent(newEventAtGrid);
      setIsEditing(false);
      setCurrentEventId("");
      setDialogOpen(true);
    },
    [timelineGroups, safeMinY, safeMaxY]
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
