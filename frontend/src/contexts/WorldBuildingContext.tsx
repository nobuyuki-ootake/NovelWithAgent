import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { useElementAccumulator } from "../hooks/useElementAccumulator";
import { useWorldBuildingAI } from "../hooks/useWorldBuildingAI";
import { useWorldBuilding } from "../hooks/useWorldBuilding";
import { useHome } from "../hooks/useHome";
import {
  WorldmapElement,
  RuleElement,
  PlaceElement,
  CultureElement,
  GeographyEnvironmentElement,
  HistoryLegendElement,
  MagicTechnologyElement,
  FreeFieldElement,
  StateDefinitionElement,
  NovelProject,
  SettingElement,
} from "../types";

// Contextで提供する値の型定義
interface WorldBuildingContextType {
  updatedTabs: { [key: number]: boolean };
  addPendingWorldmap: (worldmap: WorldmapElement) => void;
  addPendingPlace: (place: PlaceElement) => void;
  addPendingRule: (rule: RuleElement) => void;
  addPendingCulture: (culture: CultureElement) => void;
  addPendingGeography: (environment: GeographyEnvironmentElement) => void;
  addPendingHistory: (legend: HistoryLegendElement) => void;
  addPendingTechnology: (technology: MagicTechnologyElement) => void;
  addPendingFreeField: (freeField: FreeFieldElement) => void;
  addPendingStateDefinition?: (definition: StateDefinitionElement) => void;
  addPendingSetting: (setting: SettingElement) => void;
  saveAllPendingElements: () => Promise<void>;
  resetWorldBuildingElements: () => void;
  getCurrentProjectState: () => NovelProject | null;
  aiModalOpen: boolean;
  setAIModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  aiGenerationProgress: number;
  currentGeneratingElementName: string;
  totalElements: number;
  tabValue: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  notificationOpen: boolean;
  notificationMessage: string;
  setNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
  showNotification: (message: string) => void;
  worldmap?: WorldmapElement[];
  setting?: SettingElement[];
  rules?: RuleElement[];
  places?: PlaceElement[];
  cultures?: CultureElement[];
  freeFields?: WorldBuildingFreeField[];
  geographyEnvironment?: GeographyEnvironmentElement[];
  historyLegend?: HistoryLegendElement[];
  magicTechnology?: MagicTechnologyElement[];
  freeField?: FreeFieldElement[];
  stateDefinition?: StateDefinitionElement[];
  custom?: CustomElement[];
  handleMapImageUpload?: (url: string) => void;
  handleSettingChange?: (value: string) => void;
  handleHistoryChange?: (value: string) => void;
  handleSaveWorldBuilding?: () => void;
  hasUnsavedChanges?: boolean;
  snackbarOpen: boolean;
  snackbarMessage: string;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  handleCloseSnackbar: () => void;
  projectForSaving: NovelProject | null;
  updateAndSaveCurrentProject: (projectToSave: NovelProject | null) => void;
  initiateWorldBuildingAIGeneration?: (
    elementsToGenerate: Array<{
      elementType: string;
      count: number;
      customPrompt?: string;
    }>,
    apiKey: string,
    model: string
  ) => Promise<void>;
  cancelAIGeneration?: () => void;
  isGenerating: boolean;
}

// Contextの作成
const WorldBuildingContext = createContext<
  WorldBuildingContextType | undefined
>(undefined);

// Providerコンポーネント
export const WorldBuildingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const elementAccumulator = useElementAccumulator();
  const worldBuildingAI = useWorldBuildingAI();
  const worldBuildingHook = useWorldBuilding();
  const { currentProject: projectForSaving, updateAndSaveCurrentProject } =
    useHome();

  // 通知関連の状態
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const showNotification = useCallback((message: string) => {
    setNotificationMessage(message);
    setNotificationOpen(true);
  }, []);

  // スナックバー関連
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // elementAccumulator と worldBuildingAI から全てのプロパティを展開
  const {
    addPendingStateDefinition, // これは useElementAccumulator にダミー実装があるはず
    ...restOfElementAccumulator
  } = elementAccumulator;

  const {
    initiateWorldBuildingAIGeneration, // これは useWorldBuildingAI にダミー実装があるはず
    cancelAIGeneration, // これも useWorldBuildingAI にダミー実装があるはず
    ...restOfWorldBuildingAI
  } = worldBuildingAI;

  const contextValue: WorldBuildingContextType = {
    ...restOfElementAccumulator, // スプレッドで展開
    ...restOfWorldBuildingAI, // スプレッドで展開
    addPendingStateDefinition, // 明示的に渡す
    initiateWorldBuildingAIGeneration,
    cancelAIGeneration,
    // saveAllPendingElements は restOfElementAccumulator に含まれる
    // getCurrentProjectState も restOfElementAccumulator に含まれる
    tabValue: worldBuildingHook.tabValue,
    handleTabChange: worldBuildingHook.handleTabChange,
    handleMapImageUpload: worldBuildingHook.handleMapImageUpload,
    handleSaveWorldBuilding: () => {
      const projectToSave = restOfElementAccumulator.getCurrentProjectState();
      updateAndSaveCurrentProject(projectToSave);
      showNotification("プロジェクトが保存されました。");
    },
    hasUnsavedChanges: worldBuildingHook.hasUnsavedChanges,
    projectForSaving,
    updateAndSaveCurrentProject,
    notificationOpen,
    notificationMessage,
    showNotification,
    setNotificationOpen,
    setNotificationMessage,
    currentGeneratingElementName: worldBuildingAI.currentElement,
    snackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    handleCloseSnackbar,
  };

  return (
    <WorldBuildingContext.Provider value={contextValue}>
      {children}
    </WorldBuildingContext.Provider>
  );
};

// Contextを使用するためのカスタムフック
export const useWorldBuildingContext = () => {
  const context = useContext(WorldBuildingContext);
  if (context === undefined) {
    throw new Error(
      "useWorldBuildingContext must be used within a WorldBuildingProvider"
    );
  }
  return context;
};
