import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { currentProjectState } from "../store/atoms";
import { WorldBuilding } from "../types/index";
import { v4 as uuidv4 } from "uuid";

export const useWorldBuilding = () => {
  const currentProject = useRecoilValue(currentProjectState);
  const [worldBuilding, setWorldBuilding] = useState<WorldBuilding>({
    id: uuidv4(),
    setting: "",
    rules: [],
    places: [],
    cultures: [],
    history: "",
  });

  // プロジェクトが変更されたら世界観データを更新
  useEffect(() => {
    if (currentProject && currentProject.worldBuilding) {
      setWorldBuilding(currentProject.worldBuilding);
    }
  }, [currentProject]);

  // 世界観データを更新する関数
  const updateWorldBuilding = (newWorldBuilding: WorldBuilding) => {
    setWorldBuilding(newWorldBuilding);
    // ここで実際のデータ保存処理を行う（例：LocalStorageやAPIへの保存）
  };

  return {
    worldBuilding,
    updateWorldBuilding,
  };
};

export default useWorldBuilding;
