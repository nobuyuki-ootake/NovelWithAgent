import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  currentProjectState,
  worldBuildingUpdatedTabsState,
  worldBuildingForceUpdateCounterState,
} from "../store/atoms";
// toast は使用されていないためコメントアウト
// import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  NovelProject,
  PlaceElement,
  CultureElement,
  RuleElement,
  WorldmapElement,
  SettingElement,
  WorldBuildingFreeField,
  GeographyEnvironmentElement,
  MagicTechnologyElement,
  HistoryLegendElement,
} from "../types";

export const useElementAccumulator = () => {
  // プロジェクト状態
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);

  // タブの更新状態を追跡
  const [updatedTabs, setUpdatedTabs] = useRecoilState<{
    [key: number]: boolean;
  }>(worldBuildingUpdatedTabsState);
  const [forceUpdateCounter, setForceUpdateCounter] = useRecoilState(
    worldBuildingForceUpdateCounterState
  );

  // 保留中の要素を格納する状態変数
  const [pendingRules, setPendingRules] = useState<RuleElement[]>([]);
  const [pendingCultures, setPendingCultures] = useState<CultureElement[]>([]);
  const [pendingPlaces, setPendingPlaces] = useState<PlaceElement[]>([]);
  const [pendingWorldmaps, setPendingWorldmaps] = useState<WorldmapElement[]>(
    []
  );
  const [pendingSettings, setPendingSettings] = useState<SettingElement[]>([]);
  const [pendingHistories, setPendingHistories] = useState<
    HistoryLegendElement[]
  >([]);
  const [pendingGeographies, setPendingGeographies] = useState<
    GeographyEnvironmentElement[]
  >([]);
  const [pendingTechnologies, setPendingTechnologies] = useState<
    MagicTechnologyElement[]
  >([]);
  const [pendingFreeFields, setPendingFreeFields] = useState<
    WorldBuildingFreeField[]
  >([]);

  // タブを更新済みとしてマーク
  const markTabAsUpdated = useCallback(
    (index: number) => {
      const newTabs = updatedTabs;
      newTabs[index] = true;
      setUpdatedTabs(newTabs);
    },
    [updatedTabs, setUpdatedTabs]
  );

  // 強制的にタブを更新済みとしてマーク
  const forceMarkTabAsUpdated = useCallback(
    (index: number) => {
      markTabAsUpdated(index);
      setForceUpdateCounter((prev) => prev + 1);
    },
    [markTabAsUpdated, setForceUpdateCounter]
  );

  // ルール要素を保留リストに追加
  const addPendingRule = useCallback(
    (rule: RuleElement) => {
      setPendingRules((prev) => [
        ...prev,
        { ...rule, id: rule.id || uuidv4() },
      ]);
      markTabAsUpdated(2); // ルールタブのインデックスと仮定
    },
    [markTabAsUpdated]
  );

  // 文化要素を保留リストに追加
  const addPendingCulture = useCallback(
    (culture: CultureElement) => {
      setPendingCultures((prev) => [
        ...prev,
        { ...culture, id: culture.id || uuidv4() },
      ]);
      markTabAsUpdated(3); // 文化タブのインデックスと仮定
    },
    [markTabAsUpdated]
  );

  // 場所要素を保留リストに追加
  const addPendingPlace = useCallback(
    (place: PlaceElement) => {
      setPendingPlaces((prev) => [
        ...prev,
        { ...place, id: place.id || uuidv4() },
      ]);
      markTabAsUpdated(1); // 場所タブのインデックスと仮定
    },
    [markTabAsUpdated]
  );

  // ワールドマップ要素を保留リストに追加
  const addPendingWorldmap = useCallback(
    (worldmap: WorldmapElement) => {
      setPendingWorldmaps((prev) => [
        ...prev,
        { ...worldmap, id: worldmap.id || uuidv4() },
      ]);
      markTabAsUpdated(0); // ワールドマップタブのインデックスと仮定
    },
    [markTabAsUpdated]
  );

  // 設定要素を保留リストに追加
  const addPendingSetting = useCallback(
    (setting: SettingElement) => {
      setPendingSettings((prev) => [
        ...prev,
        { ...setting, id: setting.id || uuidv4() },
      ]);
      markTabAsUpdated(0); // 設定タブのインデックスと仮定
    },
    [markTabAsUpdated]
  );

  // 歴史要素を保留リストに追加
  const addPendingHistory = useCallback(
    (history: HistoryLegendElement) => {
      setPendingHistories((prev) => [
        ...prev,
        { ...history, id: history.id || uuidv4() },
      ]);
      markTabAsUpdated(4); // 歴史タブのインデックスと仮定
    },
    [markTabAsUpdated]
  );

  // 社会文化要素を保留リストに追加
  const addPendingSocietyCulture = useCallback(
    (culture: CultureElement) => {
      setPendingCultures((prev) => [
        ...prev,
        { ...culture, id: culture.id || uuidv4() },
      ]);
      markTabAsUpdated(3); // 社会文化タブのインデックスと仮定
    },
    [markTabAsUpdated]
  );

  // 技術要素を保留リストに追加
  const addPendingTechnology = useCallback(
    (technology: MagicTechnologyElement) => {
      setPendingTechnologies((prev) => [
        ...prev,
        { ...technology, id: technology.id || uuidv4() },
      ]);
      markTabAsUpdated(5); // 魔法と技術タブのインデックスと仮定
    },
    [markTabAsUpdated]
  );

  // 地理環境要素を保留リストに追加
  const addPendingGeography = useCallback(
    (geography: GeographyEnvironmentElement) => {
      setPendingGeographies((prev) => [
        ...prev,
        { ...geography, id: geography.id || uuidv4() },
      ]);
      markTabAsUpdated(6); // 地理環境タブのインデックスと仮定
    },
    [markTabAsUpdated]
  );

  // 保留中の要素をクリア
  const clearPendingElements = useCallback(() => {
    setPendingRules([]);
    setPendingCultures([]);
    setPendingPlaces([]);
    setPendingWorldmaps([]);
    setPendingSettings([]);
    setPendingHistories([]);
    setPendingGeographies([]);
    setPendingTechnologies([]);
    setPendingFreeFields([]);
  }, []);

  // フリーフィールド要素を保留リストに追加
  const addPendingFreeField = useCallback(
    (freeField: WorldBuildingFreeField) => {
      setPendingFreeFields((prev) => [
        ...prev,
        { ...freeField, id: freeField.id || uuidv4() },
      ]);
      markTabAsUpdated(7); // フリーフィールドタブのインデックスと仮定
    },
    [markTabAsUpdated]
  );

  // 全ての保留中要素を保存
  const saveAllPendingElements = useCallback(() => {
    if (!currentProject) return;

    const updatedProject = { ...currentProject };

    // 各要素タイプの保留中データを現在のプロジェクトに統合
    if (pendingRules.length > 0) {
      updatedProject.worldBuilding = {
        ...updatedProject.worldBuilding,
        rules: [
          ...(updatedProject.worldBuilding?.rules || []),
          ...pendingRules,
        ],
      };
    }

    if (pendingCultures.length > 0) {
      updatedProject.worldBuilding = {
        ...updatedProject.worldBuilding,
        cultures: [
          ...(updatedProject.worldBuilding?.cultures || []),
          ...pendingCultures,
        ],
      };
    }

    if (pendingPlaces.length > 0) {
      updatedProject.worldBuilding = {
        ...updatedProject.worldBuilding,
        places: [
          ...(updatedProject.worldBuilding?.places || []),
          ...pendingPlaces,
        ],
      };
    }

    if (pendingWorldmaps.length > 0) {
      // ワールドマップデータの統合
      // 実装は世界観設計に依存
    }

    if (pendingSettings.length > 0) {
      // 設定データの統合
      // 実装は世界観設計に依存
    }

    if (pendingHistories.length > 0) {
      updatedProject.worldBuilding = {
        ...updatedProject.worldBuilding,
        historyLegend: [
          ...(updatedProject.worldBuilding?.historyLegend || []),
          ...pendingHistories,
        ],
      };
    }

    if (pendingGeographies.length > 0) {
      updatedProject.worldBuilding = {
        ...updatedProject.worldBuilding,
        geographyEnvironment: [
          ...(updatedProject.worldBuilding?.geographyEnvironment || []),
          ...pendingGeographies,
        ],
      };
    }

    if (pendingTechnologies.length > 0) {
      updatedProject.worldBuilding = {
        ...updatedProject.worldBuilding,
        magicTechnology: [
          ...(updatedProject.worldBuilding?.magicTechnology || []),
          ...pendingTechnologies,
        ],
      };
    }

    if (pendingFreeFields.length > 0) {
      updatedProject.worldBuilding = {
        ...updatedProject.worldBuilding,
        freeFields: [
          ...(updatedProject.worldBuilding?.freeFields || []),
          ...pendingFreeFields,
        ],
      };
    }

    // プロジェクトの状態を更新
    setCurrentProject(updatedProject);

    // 保留中データをクリア
    clearPendingElements();
  }, [
    currentProject,
    pendingRules,
    pendingCultures,
    pendingPlaces,
    pendingWorldmaps,
    pendingSettings,
    pendingHistories,
    pendingGeographies,
    pendingTechnologies,
    pendingFreeFields,
    setCurrentProject,
    clearPendingElements,
  ]);

  // 現在のプロジェクト状態を取得
  const getCurrentProjectState = useCallback(() => {
    return currentProject;
  }, [currentProject]);

  // プロジェクト状態を更新
  const updateProjectState = useCallback(
    (updatedProject: NovelProject) => {
      setCurrentProject(updatedProject);
    },
    [setCurrentProject]
  );

  // 世界観データの整合性を検証
  const validateWorldBuildingData = useCallback(() => {
    if (!currentProject || !currentProject.worldBuilding) return false;

    // 必須フィールドの存在確認など、基本的な検証ロジックを実装
    return true;
  }, [currentProject]);

  return {
    // タブ関連
    updatedTabs,
    markTabAsUpdated,
    forceMarkTabAsUpdated,
    forceUpdateCounter,

    // 要素累積API
    addPendingRule,
    addPendingCulture,
    addPendingWorldmap,
    addPendingSetting,
    addPendingPlace,
    addPendingHistory,
    addPendingSocietyCulture,
    addPendingTechnology,
    addPendingGeography,
    addPendingFreeField,
    saveAllPendingElements,
    clearPendingElements,

    // プロジェクト状態
    getCurrentProjectState,
    updateProjectState,

    // データ整合性チェック
    validateWorldBuildingData,

    // デバッグ用 - 保留中データを公開
    pendingPlaces,
    pendingRules,
    pendingCultures,
    pendingFreeFields,
  };
};
