import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useElementAccumulator } from "../hooks/useElementAccumulator";
import { useWorldBuildingAI } from "../hooks/useWorldBuildingAI";
import { useWorldBuilding } from "../hooks/useWorldBuilding";
import {
  WorldmapElement,
  SettingElement,
  RuleElement,
  PlaceElement,
  CultureElement,
  GeographyEnvironmentElement,
  HistoryLegendElement,
  MagicTechnologyElement,
  FreeTextElement,
  StateDefinitionElement,
  CustomElement,
  WorldBuildingFreeField,
  NovelProject,
  BatchProcessResult,
} from "../types";
import { v4 as uuidv4 } from "uuid";

// Contextで提供する値の型定義
interface WorldBuildingContextType {
  // useElementAccumulatorからの状態と関数
  updatedTabs: { [key: number]: boolean };
  pendingWorldmap: WorldmapElement[];
  pendingSetting: SettingElement[];
  pendingRules: RuleElement[];
  pendingPlaces: PlaceElement[];
  pendingCultures: CultureElement[];
  pendingGeographyEnvironment: GeographyEnvironmentElement[];
  pendingHistoryLegend: HistoryLegendElement[];
  pendingMagicTechnology: MagicTechnologyElement[];
  pendingFreeText: FreeTextElement[];
  pendingStateDefinition: StateDefinitionElement[];
  pendingCustom: CustomElement[];
  markTabAsUpdated: (tabIndex: number) => void;
  getCurrentProjectState: () => NovelProject | null;
  updateProjectState: (
    updater: (project: NovelProject | null) => NovelProject | null
  ) => NovelProject | null;
  addPendingWorldmap: (worldmap: WorldmapElement) => void;
  addPendingPlace: (place: PlaceElement) => void;
  addPendingRule: (rule: RuleElement) => void;
  addPendingCulture: (culture: CultureElement) => void;
  addPendingGeographyEnvironment: (
    environment: GeographyEnvironmentElement
  ) => void;
  addPendingHistoryLegend: (legend: HistoryLegendElement) => void;
  addPendingMagicTechnology: (technology: MagicTechnologyElement) => void;
  addPendingFreeText: (text: FreeTextElement) => void;
  addPendingStateDefinition: (definition: StateDefinitionElement) => void;
  addPendingCustom: (custom: CustomElement) => void;
  saveAllPendingElements: () => NovelProject | null;
  clearPendingElements: () => void;

  // useWorldBuildingAIからの状態と関数
  aiModalOpen: boolean;
  setAIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  aiGenerationProgress: number;
  currentElement: { name: string; role: string } | null;
  totalElements: number;

  // useWorldBuildingからの状態
  tabValue: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;

  // 通知関連の状態
  notificationOpen: boolean;
  notificationMessage: string;
  setNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
  showNotification: (message: string) => void;

  // WorldBuildingPage.tsxから移動させた状態
  processResult: BatchProcessResult | null;

  // ワールドビルディングの状態（必要に応じてuseWorldBuilding hookから提供）
  worldmap?: WorldmapElement[];
  setting?: SettingElement[];
  rules?: RuleElement[];
  places?: PlaceElement[];
  cultures?: CultureElement[];
  freeFields?: WorldBuildingFreeField[];
  geographyEnvironment?: GeographyEnvironmentElement[];
  historyLegend?: HistoryLegendElement[];
  magicTechnology?: MagicTechnologyElement[];
  freeText?: FreeTextElement[];
  stateDefinition?: StateDefinitionElement[];
  custom?: CustomElement[];

  // 状態管理ハンドラー
  handleMapImageUpload?: (url: string) => void;
  handleSettingChange?: (value: string) => void;
  handleHistoryChange?: (value: string) => void;
  handleSaveWorldBuilding?: () => void;

  // 追加プロパティ - WorldBuildingPage.tsxとの互換性のため
  hasUnsavedChanges?: boolean;
  snackbarOpen?: boolean;
  snackbarMessage?: string;
  handleCloseSnackbar?: () => void;
}

// Contextの作成
const WorldBuildingContext = createContext<
  WorldBuildingContextType | undefined
>(undefined);

// Providerコンポーネント
export const WorldBuildingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 各種フックを使用
  const elementAccumulator = useElementAccumulator();
  const worldBuildingAI = useWorldBuildingAI();
  const worldBuilding = useWorldBuilding();

  // elementAccumulatorの状態変化を監視
  useEffect(() => {
    console.log(
      "[DEBUG] WorldBuildingContext - updatedTabs変更検知:",
      elementAccumulator.updatedTabs
    );
  }, [elementAccumulator.updatedTabs]);

  // 通知関連の状態
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const showNotification = (message: string) => {
    setNotificationMessage(message);
    setNotificationOpen(true);
  };

  // WorldBuildingPage.tsxから移動させた状態
  const [updatedTabs, setUpdatedTabs] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [pendingWorldmap, setPendingWorldmap] = useState<WorldmapElement[]>([]);
  const [pendingSetting, setPendingSetting] = useState<SettingElement[]>([]);
  const [pendingPlaces, setPendingPlaces] = useState<PlaceElement[]>([]);
  const [pendingRules, setPendingRules] = useState<RuleElement[]>([]);
  const [pendingCultures, setPendingCultures] = useState<CultureElement[]>([]);
  const [pendingGeographyEnvironment, setPendingGeographyEnvironment] =
    useState<GeographyEnvironmentElement[]>([]);
  const [pendingHistoryLegend, setPendingHistoryLegend] = useState<
    HistoryLegendElement[]
  >([]);
  const [pendingMagicTechnology, setPendingMagicTechnology] = useState<
    MagicTechnologyElement[]
  >([]);
  const [pendingFreeText, setPendingFreeText] = useState<FreeTextElement[]>([]);
  const [pendingStateDefinition, setPendingStateDefinition] = useState<
    StateDefinitionElement[]
  >([]);
  const [pendingCustom, setPendingCustom] = useState<CustomElement[]>([]);
  const [processResult, setProcessResult] = useState<BatchProcessResult | null>(
    null
  );

  // スナックバー関連
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // タブが更新されたことを記録
  const markTabAsUpdated = useCallback((tabIndex: number) => {
    setUpdatedTabs((prev) => ({
      ...prev,
      [tabIndex]: true,
    }));
  }, []);

  // 保留中の要素を追加する関数
  const addPendingWorldmap = useCallback((worldmap: WorldmapElement) => {
    setPendingWorldmap((prev) => [...prev, worldmap]);
  }, []);

  const addPendingPlace = useCallback((place: PlaceElement) => {
    setPendingPlaces((prev) => [...prev, place]);
  }, []);

  const addPendingRule = useCallback((rule: RuleElement) => {
    setPendingRules((prev) => [...prev, rule]);
  }, []);

  const addPendingCulture = useCallback((culture: CultureElement) => {
    setPendingCultures((prev) => [...prev, culture]);
  }, []);

  const addPendingGeographyEnvironment = useCallback(
    (environment: GeographyEnvironmentElement) => {
      setPendingGeographyEnvironment((prev) => [...prev, environment]);
    },
    []
  );

  const addPendingHistoryLegend = useCallback(
    (legend: HistoryLegendElement) => {
      setPendingHistoryLegend((prev) => [...prev, legend]);
    },
    []
  );

  const addPendingMagicTechnology = useCallback(
    (technology: MagicTechnologyElement) => {
      setPendingMagicTechnology((prev) => [...prev, technology]);
    },
    []
  );

  const addPendingFreeText = useCallback((text: FreeTextElement) => {
    setPendingFreeText((prev) => [...prev, text]);
  }, []);

  const addPendingStateDefinition = useCallback(
    (definition: StateDefinitionElement) => {
      setPendingStateDefinition((prev) => [...prev, definition]);
    },
    []
  );

  const addPendingCustom = useCallback((custom: CustomElement) => {
    setPendingCustom((prev) => [...prev, custom]);
  }, []);

  // プロジェクトの状態を取得・更新するための関数
  const getCurrentProjectState = useCallback((): NovelProject | null => {
    if (worldBuilding && typeof worldBuilding.currentProject !== "undefined") {
      return worldBuilding.currentProject;
    }
    return null;
  }, [worldBuilding]);

  const updateProjectState = useCallback(
    (
      updater: (project: NovelProject | null) => NovelProject | null
    ): NovelProject | null => {
      // この関数は実際のプロジェクト構造に合わせて実装する必要があります
      // 現在はモック実装
      const currentProject = getCurrentProjectState();
      const updatedProject = updater(currentProject);
      return updatedProject;
    },
    [getCurrentProjectState]
  );

  // すべての保留中の要素を保存する関数
  const saveAllPendingElements = useCallback((): NovelProject | null => {
    // 現在のプロジェクト情報を取得
    const projectToUpdate = getCurrentProjectState();
    if (!projectToUpdate) return null;

    // 世界観データが存在しない場合は初期化
    if (!projectToUpdate.worldBuilding) {
      projectToUpdate.worldBuilding = {
        id: uuidv4(),
        mapImageUrl: "",
        setting: "",
        history: "",
        rules: [],
        places: [],
        cultures: [],
        freeFields: [],
        geographyEnvironment: [],
        historyLegend: [],
        magicTechnology: [],
        freeText: [],
        stateDefinition: [],
        custom: [],
      };
    }

    console.log("[DEBUG] Inserting world-building elements into project");
    console.log(
      "[DEBUG] Current project state before insertion:",
      JSON.stringify(projectToUpdate)
    );

    // Log for each type of element
    if (pendingPlaces.length > 0) {
      console.log(
        "[DEBUG] Attempting to insert places:",
        JSON.stringify(pendingPlaces)
      );
    }
    if (pendingRules.length > 0) {
      console.log(
        "[DEBUG] Attempting to insert rules:",
        JSON.stringify(pendingRules)
      );
    }
    if (pendingCultures.length > 0) {
      console.log(
        "[DEBUG] Attempting to insert cultures:",
        JSON.stringify(pendingCultures)
      );
    }

    // 場所の保存
    if (pendingPlaces.length > 0) {
      console.log(`保留中の場所: ${pendingPlaces.length}件`);

      // 既存の場所配列を確保
      const existingPlaces = Array.isArray(projectToUpdate.worldBuilding.places)
        ? projectToUpdate.worldBuilding.places
        : [];

      // 注意: 個別要素も処理時に既に追加されているため、二重追加防止の確認を行う
      const placeIds = new Set(existingPlaces.map((p: Place) => p.id));
      const newPlaces = pendingPlaces.filter((p) => !placeIds.has(p.id));

      if (newPlaces.length > 0) {
        console.log(`新規追加する場所: ${newPlaces.length}件`);
        projectToUpdate.worldBuilding.places = [
          ...existingPlaces,
          ...newPlaces,
        ];
      } else {
        console.log("追加すべき新規の場所はありません");
      }

      console.log(
        "場所の累積保存完了:",
        projectToUpdate.worldBuilding.places.length
      );

      // 地名タブを更新済みとしてマーク
      markTabAsUpdated(3);
    }

    // ルールの保存
    if (pendingRules.length > 0) {
      console.log(`保留中のルール: ${pendingRules.length}件`);

      // 既存のルール配列を確保
      const existingRules = Array.isArray(projectToUpdate.worldBuilding.rules)
        ? projectToUpdate.worldBuilding.rules
        : [];

      // 重複確認
      const ruleIds = new Set(existingRules.map((r: Rule) => r.id));
      const newRules = pendingRules.filter((r) => !ruleIds.has(r.id));

      if (newRules.length > 0) {
        projectToUpdate.worldBuilding.rules = [...existingRules, ...newRules];
      }

      // ルールタブを更新済みとしてマーク
      markTabAsUpdated(2);
    }

    // 文化の保存
    if (pendingCultures.length > 0) {
      console.log(`保留中の文化: ${pendingCultures.length}件`);

      // 既存の文化配列を確保
      const existingCultures = Array.isArray(
        projectToUpdate.worldBuilding.cultures
      )
        ? projectToUpdate.worldBuilding.cultures
        : [];

      // 重複確認
      const cultureIds = new Set(existingCultures.map((c: Culture) => c.id));
      const newCultures = pendingCultures.filter((c) => !cultureIds.has(c.id));

      if (newCultures.length > 0) {
        projectToUpdate.worldBuilding.cultures = [
          ...existingCultures,
          ...newCultures,
        ];
      }

      // 社会と文化タブを更新済みとしてマーク
      markTabAsUpdated(4);
    }

    // プロジェクトを更新
    updateProjectState(() => projectToUpdate);

    // 保留中のデータをクリア
    setPendingPlaces([]);
    setPendingRules([]);
    setPendingCultures([]);
    setPendingGeographyEnvironment([]);
    setPendingHistoryLegend([]);
    setPendingMagicTechnology([]);
    setPendingFreeText([]);
    setPendingStateDefinition([]);
    setPendingCustom([]);

    // 保存完了通知
    setSnackbarMessage("世界観設定を保存しました");
    setSnackbarOpen(true);

    console.log(
      "[DEBUG] Project state after insertion attempt:",
      JSON.stringify(projectToUpdate)
    );

    return projectToUpdate;
  }, [
    pendingPlaces,
    pendingRules,
    pendingCultures,
    getCurrentProjectState,
    updateProjectState,
    markTabAsUpdated,
  ]);

  // 保留中の要素をクリア
  const clearPendingElements = useCallback(() => {
    setPendingPlaces([]);
    setPendingRules([]);
    setPendingCultures([]);
    setPendingGeographyEnvironment([]);
    setPendingHistoryLegend([]);
    setPendingMagicTechnology([]);
    setPendingFreeText([]);
    setPendingStateDefinition([]);
    setPendingCustom([]);
  }, []);

  // 提供する値
  const value: WorldBuildingContextType = {
    // useElementAccumulatorからの状態と関数
    updatedTabs,
    pendingWorldmap,
    pendingSetting,
    pendingRules,
    pendingPlaces,
    pendingCultures,
    pendingGeographyEnvironment,
    pendingHistoryLegend,
    pendingMagicTechnology,
    pendingFreeText,
    pendingStateDefinition,
    pendingCustom,
    markTabAsUpdated,
    getCurrentProjectState,
    updateProjectState,
    addPendingWorldmap,
    addPendingPlace,
    addPendingRule,
    addPendingCulture,
    addPendingGeographyEnvironment,
    addPendingHistoryLegend,
    addPendingMagicTechnology,
    addPendingFreeText,
    addPendingStateDefinition,
    addPendingCustom,
    saveAllPendingElements,
    clearPendingElements,

    // useWorldBuildingAIからの状態と関数
    aiModalOpen: worldBuildingAI.aiModalOpen,
    setAIModalOpen: worldBuildingAI.setAIModalOpen,
    aiGenerationProgress: worldBuildingAI.aiGenerationProgress,
    currentElement: worldBuildingAI.currentElement,
    totalElements: worldBuildingAI.totalElements,

    // useWorldBuildingからの状態
    tabValue: worldBuilding.tabValue,
    handleTabChange: worldBuilding.handleTabChange,

    // 通知関連の状態
    notificationOpen,
    notificationMessage,
    setNotificationOpen,
    setNotificationMessage,
    showNotification,

    // WorldBuildingPage.tsxから移動させた状態
    processResult,

    // スナックバー関連
    snackbarOpen,
    snackbarMessage,
    handleCloseSnackbar,
  };

  return (
    <WorldBuildingContext.Provider value={value}>
      {children}
    </WorldBuildingContext.Provider>
  );
};

// カスタムフック
export const useWorldBuildingContext = () => {
  const context = useContext(WorldBuildingContext);
  if (context === undefined) {
    throw new Error(
      "useWorldBuildingContext must be used within a WorldBuildingProvider"
    );
  }
  return context;
};
