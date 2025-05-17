import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  WorldBuilding,
  NovelProject,
  CultureElement,
} from "@novel-ai-assistant/types";
import { currentProjectState } from "../store/atoms";
import { v4 as uuidv4 } from "uuid";

// デフォルトのCultureElementを生成するヘルパー関数
const createDefaultCultureElement = (): CultureElement => ({
  id: uuidv4(),
  name: "Default Culture",
  type: "culture",
  originalType: "culture",
  description: "Default culture description",
  features: "Default features",
  importance: "Medium",
  relations: "None",
  customText: "",
  beliefs: "",
  history: "",
  socialStructure: "",
  values: [],
  customs: [],
  government: undefined,
  religion: undefined,
  language: undefined,
  art: undefined,
  technology: undefined,
  notes: undefined,
  economy: undefined,
  traditions: undefined,
  education: undefined,
});

export const useWorldBuilding = () => {
  const [project, setProject] = useRecoilState(currentProjectState);
  const [worldBuilding, setWorldBuilding] = useState<WorldBuilding>(() => {
    let initialWB = project?.worldBuilding;
    if (initialWB) {
      // cultures 配列が空または存在しない場合、デフォルトを追加
      if (!initialWB.cultures || initialWB.cultures.length === 0) {
        initialWB = {
          ...initialWB,
          cultures: [createDefaultCultureElement()],
        };
      }
      return initialWB;
    }
    // projectまたはproject.worldBuildingが存在しない場合の完全な初期値
    return {
      id: uuidv4(),
      setting: "",
      worldmaps: [],
      settings: [],
      rules: [],
      places: [],
      cultures: [createDefaultCultureElement()], // culturesにデフォルト要素を設定
      geographyEnvironment: [],
      historyLegend: [],
      magicTechnology: [],
      stateDefinition: [],
      freeFields: [],
      // societyCulture は削除されたので、ここでの参照も削除
    };
  });

  useEffect(() => {
    if (project && project.worldBuilding) {
      let currentWB = project.worldBuilding;
      // cultures 配列が空または存在しない場合、デフォルトを追加
      if (!currentWB.cultures || currentWB.cultures.length === 0) {
        currentWB = {
          ...currentWB,
          cultures: [createDefaultCultureElement()],
        };
      }
      // societyCulture が存在した場合の古いロジックは不要なので削除
      setWorldBuilding(currentWB);
    } else {
      // projectが存在しない場合のフォールバック
      setWorldBuilding({
        id: uuidv4(),
        setting: "",
        worldmaps: [],
        settings: [],
        rules: [],
        places: [],
        cultures: [createDefaultCultureElement()],
        geographyEnvironment: [],
        historyLegend: [],
        magicTechnology: [],
        stateDefinition: [],
        freeFields: [],
      });
    }
  }, [project]);

  const updateWorldBuilding = (newWorldBuilding: WorldBuilding) => {
    // societyCultureへの参照がないことを確認
    // newWorldBuildingにsocietyCultureが含まれていないはず
    setWorldBuilding(newWorldBuilding);
    if (project) {
      const updatedProject: NovelProject = {
        ...project,
        worldBuilding: newWorldBuilding,
      };
      setProject(updatedProject);
    }
  };

  return {
    worldBuilding,
    updateWorldBuilding,
  };
};

export default useWorldBuilding;
