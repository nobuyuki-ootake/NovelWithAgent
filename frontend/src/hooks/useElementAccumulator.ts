import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilCallback } from "recoil";
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
  GeographyEnvironmentElement,
  MagicTechnologyElement,
  HistoryLegendElement,
  WorldBuildingElementType,
  getCategoryTabIndex,
  StateDefinitionElement,
} from "../types";

export const useElementAccumulator = () => {
  useEffect(() => {
    console.log("[DEBUG] useElementAccumulator MOUNTED");
    return () => {
      console.log("[DEBUG] useElementAccumulator UNMOUNTED");
    };
  }, []);

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

  const markTabAsUpdated = useCallback(
    (index: number) => {
      console.log("[DEBUG] markTabAsUpdated CALLED WITH INDEX:", index);
      setUpdatedTabs((prev) => ({
        ...prev,
        [index]: true,
      }));
    },
    [setUpdatedTabs]
  );

  const forceMarkTabAsUpdated = useCallback(
    (index: number) => {
      markTabAsUpdated(index);
      setForceUpdateCounter((prev) => prev + 1);
    },
    [markTabAsUpdated, setForceUpdateCounter]
  );

  const addPendingRule = useCallback(
    (rule: RuleElement) => {
      if (!currentProject) return;
      const newRule = { ...rule, id: rule.id || uuidv4() };
      setCurrentProject((prevProject) => {
        if (!prevProject) return prevProject;
        const updatedWorldBuilding = {
          ...prevProject.worldBuilding,
          rules: [...(prevProject.worldBuilding?.rules || []), newRule],
        };
        return { ...prevProject, worldBuilding: updatedWorldBuilding };
      });
      markTabAsUpdated(getCategoryTabIndex(WorldBuildingElementType.RULE));
    },
    [currentProject, setCurrentProject, markTabAsUpdated]
  );

  const addPendingCulture = useCallback(
    (culture: CultureElement) => {
      if (!currentProject) return;
      const newCulture = { ...culture, id: culture.id || uuidv4() };
      setCurrentProject((prevProject) => {
        if (!prevProject) return prevProject;
        const updatedWorldBuilding = {
          ...prevProject.worldBuilding,
          cultures: [
            ...(prevProject.worldBuilding?.cultures || []),
            newCulture,
          ],
        };
        return { ...prevProject, worldBuilding: updatedWorldBuilding };
      });
      markTabAsUpdated(getCategoryTabIndex(WorldBuildingElementType.CULTURE));
    },
    [currentProject, setCurrentProject, markTabAsUpdated]
  );

  const addPendingPlace = useCallback(
    (place: PlaceElement) => {
      console.log(
        "[DEBUG] addPendingPlace called with:",
        JSON.stringify(place)
      );
      if (!currentProject) {
        console.error("[DEBUG] addPendingPlace: currentProject is null!");
        return;
      }
      const newPlace = { ...place, id: place.id || uuidv4() };
      console.log("[DEBUG] newPlace to add:", JSON.stringify(newPlace));

      setCurrentProject((prevProject) => {
        if (!prevProject) return prevProject; // Should not happen if initial check passed
        console.log(
          "[DEBUG] prevProject.worldBuilding.places before adding:",
          JSON.stringify(prevProject.worldBuilding?.places)
        );
        const updatedPlaces = [
          ...(prevProject.worldBuilding?.places || []),
          newPlace,
        ];
        console.log(
          "[DEBUG] updatedPlaces after adding:",
          JSON.stringify(updatedPlaces)
        );
        const updatedWorldBuilding = {
          ...prevProject.worldBuilding,
          places: updatedPlaces,
        };
        return { ...prevProject, worldBuilding: updatedWorldBuilding };
      });
      markTabAsUpdated(getCategoryTabIndex(WorldBuildingElementType.PLACE));
      console.log(
        `[DEBUG] markTabAsUpdated(${getCategoryTabIndex(
          WorldBuildingElementType.PLACE
        )}) called after setCurrentProject`
      );
    },
    [currentProject, setCurrentProject, markTabAsUpdated]
  );

  const addPendingWorldmap = useCallback(
    (worldmap: WorldmapElement) => {
      if (!currentProject) return;
      const newWorldmap = { ...worldmap, id: worldmap.id || uuidv4() };
      setCurrentProject((prevProject) => {
        if (!prevProject) return prevProject;
        const updatedWorldBuilding = {
          ...prevProject.worldBuilding,
          worldmaps: [
            ...(prevProject.worldBuilding?.worldmaps || []),
            newWorldmap,
          ],
        };
        return { ...prevProject, worldBuilding: updatedWorldBuilding };
      });
      markTabAsUpdated(getCategoryTabIndex(WorldBuildingElementType.WORLDMAP));
    },
    [currentProject, setCurrentProject, markTabAsUpdated]
  );

  const addPendingSetting = useCallback(
    (setting: SettingElement) => {
      if (!currentProject) return;
      const newSetting = { ...setting, id: setting.id || uuidv4() };
      setCurrentProject((prevProject) => {
        if (!prevProject) return prevProject;
        const updatedWorldBuilding = {
          ...prevProject.worldBuilding,
          settings: [
            ...(prevProject.worldBuilding?.settings || []),
            newSetting,
          ],
        };
        return { ...prevProject, worldBuilding: updatedWorldBuilding };
      });
      markTabAsUpdated(getCategoryTabIndex(WorldBuildingElementType.SETTING));
    },
    [currentProject, setCurrentProject, markTabAsUpdated]
  );

  const addPendingHistory = useCallback(
    (history: HistoryLegendElement) => {
      if (!currentProject) return;
      const newHistory = { ...history, id: history.id || uuidv4() };
      setCurrentProject((prevProject) => {
        if (!prevProject) return prevProject;
        const updatedWorldBuilding = {
          ...prevProject.worldBuilding,
          historyLegend: [
            ...(prevProject.worldBuilding?.historyLegend || []),
            newHistory,
          ],
        };
        return { ...prevProject, worldBuilding: updatedWorldBuilding };
      });
      markTabAsUpdated(
        getCategoryTabIndex(WorldBuildingElementType.HISTORY_LEGEND)
      );
    },
    [currentProject, setCurrentProject, markTabAsUpdated]
  );

  const addPendingSocietyCulture = useCallback(
    (culture: CultureElement) => {
      if (!currentProject) return;
      const newCulture = { ...culture, id: culture.id || uuidv4() };
      setCurrentProject((prevProject) => {
        if (!prevProject) return prevProject;
        const updatedWorldBuilding = {
          ...prevProject.worldBuilding,
          cultures: [
            ...(prevProject.worldBuilding?.cultures || []),
            newCulture,
          ],
        };
        return { ...prevProject, worldBuilding: updatedWorldBuilding };
      });
      markTabAsUpdated(getCategoryTabIndex(WorldBuildingElementType.CULTURE));
    },
    [currentProject, setCurrentProject, markTabAsUpdated]
  );

  const addPendingTechnology = useCallback(
    (technology: MagicTechnologyElement) => {
      if (!currentProject) return;
      const newTechnology = { ...technology, id: technology.id || uuidv4() };
      setCurrentProject((prevProject) => {
        if (!prevProject) return prevProject;
        const updatedWorldBuilding = {
          ...prevProject.worldBuilding,
          magicTechnology: [
            ...(prevProject.worldBuilding?.magicTechnology || []),
            newTechnology,
          ],
        };
        return { ...prevProject, worldBuilding: updatedWorldBuilding };
      });
      markTabAsUpdated(
        getCategoryTabIndex(WorldBuildingElementType.MAGIC_TECHNOLOGY)
      );
    },
    [currentProject, setCurrentProject, markTabAsUpdated]
  );

  const addPendingGeography = useCallback(
    (geography: GeographyEnvironmentElement) => {
      if (!currentProject) return;
      const newGeography = { ...geography, id: geography.id || uuidv4() };
      setCurrentProject((prevProject) => {
        if (!prevProject) return prevProject;
        const updatedWorldBuilding = {
          ...prevProject.worldBuilding,
          geographyEnvironment: [
            ...(prevProject.worldBuilding?.geographyEnvironment || []),
            newGeography,
          ],
        };
        return { ...prevProject, worldBuilding: updatedWorldBuilding };
      });
      markTabAsUpdated(
        getCategoryTabIndex(WorldBuildingElementType.GEOGRAPHY_ENVIRONMENT)
      );
    },
    [currentProject, setCurrentProject, markTabAsUpdated]
  );

  const addPendingFreeField = useCallback(
    (freeField: WorldBuildingFreeField) => {
      if (!currentProject) return;
      const newFreeField = { ...freeField, id: freeField.id || uuidv4() };
      setCurrentProject((prevProject) => {
        if (!prevProject) return prevProject;
        const updatedWorldBuilding = {
          ...prevProject.worldBuilding,
          freeFields: [
            ...(prevProject.worldBuilding?.freeFields || []),
            newFreeField,
          ],
        };
        return { ...prevProject, worldBuilding: updatedWorldBuilding };
      });
      markTabAsUpdated(
        getCategoryTabIndex(WorldBuildingElementType.FREE_FIELD)
      );
    },
    [currentProject, setCurrentProject, markTabAsUpdated]
  );

  // addPendingStateDefinition のダミー実装
  const addPendingStateDefinition = useCallback(
    (definition: StateDefinitionElement) => {
      console.warn(
        "addPendingStateDefinition is not implemented in useElementAccumulator",
        definition
      );
      // markTabAsUpdated(getCategoryTabIndex(WorldBuildingElementType.STATE_DEFINITION)); // 必要に応じて
    },
    [markTabAsUpdated] // 依存配列は最小限に
  );

  const clearPendingElements = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        console.log("[DEBUG] clearPendingElements CALLED");
        const currentProj = await snapshot.getPromise(currentProjectState);
        if (currentProj && currentProj.worldBuilding) {
          const newWorldBuilding = { ...currentProj.worldBuilding };
          // すべての要素タイプの配列を空にする
          // 以下は例です。実際のプロジェクトの型定義に合わせてください。
          newWorldBuilding.places = [];
          newWorldBuilding.rules = [];
          newWorldBuilding.cultures = [];
          newWorldBuilding.worldmaps = [];
          newWorldBuilding.settings = [];
          // 他のすべての要素タイプについても同様に空にする
          // (例) newWorldBuilding.historyLegend = []; など

          set(currentProjectState, {
            ...currentProj,
            worldBuilding: newWorldBuilding,
          });
          console.log(
            "[DEBUG] All pending elements cleared from currentProject state"
          );
        }
      },
    []
  );

  const resetWorldBuildingElements = useRecoilCallback(
    ({ set }) =>
      async () => {
        console.log("[DEBUG] resetWorldBuildingElements CALLED");
        set(currentProjectState, (prevProject) => {
          if (!prevProject) return prevProject;
          return {
            ...prevProject,
            worldBuilding: {
              id: prevProject.worldBuilding?.id || uuidv4(),
              worldMapImageUrl: "",
              description: "",
              history: "",
              setting: "",
              rules: [],
              places: [],
              cultures: [],
              worldmaps: [],
              settings: [],
              historyLegend: [],
              magicTechnology: [],
              geographyEnvironment: [],
              freeFields: [],
              stateDefinition: [],
            },
          };
        });
        setUpdatedTabs({});
        setForceUpdateCounter((prev) => prev + 1);
        console.log(
          "[DEBUG] World building elements reset and updated tabs cleared"
        );
      },
    [setUpdatedTabs, setForceUpdateCounter]
  );

  const saveAllPendingElements = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const project = await snapshot.getPromise(currentProjectState);
        if (project) {
          // ここでプロジェクトデータを永続化する処理を呼び出す
          // 例: await saveProjectToBackend(project);
          console.log(
            "[DEBUG] AIバッチ処理完了。要素は currentProject に直接保存済み (from snapshot):",
            project.title // project全体をログすると長すぎるのでタイトルだけ
          );
          // プロジェクト内の各要素の数をログに出力
          console.log(
            "[DEBUG] 保存後のプロジェクトの場所の数 (from snapshot):",
            project.worldBuilding?.places?.length || 0
          );
          console.log(
            "[DEBUG] 保存後のプロジェクトのルールの数 (from snapshot):",
            project.worldBuilding?.rules?.length || 0
          );
          console.log(
            "[DEBUG] 保存後のプロジェクトの文化の数 (from snapshot):",
            project.worldBuilding?.cultures?.length || 0
          );
          // 他の要素タイプについても同様にログ出力
          // clearPendingElements(); // 保存が完了したので保留リストをクリア... しない。currentProjectに直接入っているため
        } else {
          console.warn(
            "[DEBUG] saveAllPendingElements: currentProject is null, skipping save."
          );
        }
      },
    [
      /*clearPendingElements*/
    ] // clearPendingElements は依存配列から削除
  );

  const getCurrentProjectState = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        return snapshot.getLoadable(currentProjectState).contents;
      },
    []
  );

  // 世界観データのバリデーション関数
  const validateWorldBuildingData = useCallback(() => {
    if (!currentProject || !currentProject.worldBuilding) {
      console.warn("プロジェクトまたは世界観データが存在しません。");
      return false;
    }
    // ここに各要素のバリデーションロジックを追加
    // 例: currentProject.worldBuilding.places の各要素が適切な名前と説明を持っているか等
    return true; // 仮実装
  }, [currentProject]);

  const updateProjectState = useCallback(
    (updatedProject: NovelProject) => {
      setCurrentProject(updatedProject);
    },
    [setCurrentProject]
  );

  return {
    updatedTabs,
    markTabAsUpdated,
    forceMarkTabAsUpdated,
    forceUpdateCounter,
    addPendingRule,
    addPendingCulture,
    addPendingPlace,
    addPendingWorldmap,
    addPendingSetting,
    addPendingHistory,
    addPendingSocietyCulture,
    addPendingTechnology,
    addPendingGeography,
    addPendingFreeField,
    addPendingStateDefinition,
    saveAllPendingElements,
    clearPendingElements,
    resetWorldBuildingElements,
    getCurrentProjectState,
    updateProjectState,
    validateWorldBuildingData,
  };
};
