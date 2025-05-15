import { useState, useCallback } from "react";
import { useAIAssist } from "./useAIAssist";
import { toast } from "sonner";
import { useElementAccumulator } from "./useElementAccumulator";
import { v4 as uuidv4 } from "uuid";
import {
  PlaceElement,
  CultureElement,
  RuleElement,
  WorldmapElement,
  SettingElement,
  WorldBuildingFreeField,
  GeographyEnvironmentElement,
  MagicTechnologyElement,
  HistoryLegendElement,
  WorldBuildingElementType,
  WorldBuildingElement,
  FreeTextElement,
} from "../types";

/**
 * 世界観構築のAI支援機能を管理するカスタムフック
 */
export const useWorldBuildingAI = () => {
  // AI生成モーダル表示の制御
  const [aiModalOpen, setAIModalOpen] = useState(false);

  // 生成進捗の表示
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerationProgress, setAiGenerationProgress] = useState(0);
  const [currentElement, setCurrentElement] = useState("");
  const [totalElements, setTotalElements] = useState(0);

  // 通知関連
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // 再レンダリング制御
  const [triggerRerender, setTriggerRerender] = useState(0);

  // 要素累積機能を使用
  const {
    addPendingRule,
    addPendingCulture,
    addPendingPlace,
    addPendingWorldmap,
    addPendingSetting,
    addPendingHistory,
    addPendingGeography,
    addPendingTechnology,
    addPendingFreeField,
    saveAllPendingElements,
    forceMarkTabAsUpdated,
    forceUpdateCounter,
  } = useElementAccumulator();

  // 世界観要素の処理
  const handleProcessWorldBuildingElement = useCallback(
    (inputEelementData: WorldBuildingElement) => {
      if (!inputEelementData) return;

      console.log("[DEBUG] 処理する要素タイプ:", inputEelementData.type);

      // 要素タイプに応じて処理
      switch (inputEelementData.type) {
        case WorldBuildingElementType.WORLDMAP: {
          const elementData = inputEelementData as WorldmapElement;
          const worldmapElement: WorldmapElement = {
            id: uuidv4(),
            name: elementData.name || "",
            description: elementData.description || "",
            importance: elementData.importance || "",
            originalType: elementData.originalType || "worldmap",
            type: "worldmap",
            features: elementData.features || "",
            relations: elementData.relations || "",
            img: elementData.img || "",
          };
          addPendingWorldmap(worldmapElement);
          break;
        }

        case WorldBuildingElementType.SETTING: {
          const elementData = inputEelementData as SettingElement;
          const settingElement: SettingElement = {
            id: uuidv4(),
            name: elementData.name || "",
            description: elementData.description || "",
            importance: elementData.importance || "",
            originalType: elementData.originalType || "setting",
            type: "setting",
            features: elementData.features || "",
            relations: elementData.relations || "",
            img: elementData.img || "",
          };
          addPendingSetting(settingElement);
          break;
        }

        case WorldBuildingElementType.PLACE: {
          const elementData = inputEelementData as PlaceElement;
          console.log("[DEBUG] 処理中の要素:", elementData);
          const placeElement: PlaceElement = {
            ...inputEelementData,
            id: uuidv4(),
            name: elementData.name || "",
            description: elementData.description || "",
            importance: elementData.importance || "",
            originalType: elementData.originalType || "place",
            type: "place",
            features: elementData.features || "",
            relations: elementData.relations || "",
            location: elementData.location || "",
            population: elementData.population || "",
            culturalFeatures: elementData.culturalFeatures || "",
          };
          console.log("[DEBUG] 処理完了した要素:", placeElement);
          addPendingPlace(placeElement);
          break;
        }

        case WorldBuildingElementType.HISTORY_LEGEND: {
          const elementData = inputEelementData as HistoryLegendElement;
          const historyLegendElement: HistoryLegendElement = {
            id: uuidv4(),
            name: elementData.name || "",
            description: elementData.description || "",
            importance: elementData.importance || "",
            originalType: elementData.originalType || "history_legend",
            type: "history_legend",
            features: elementData.features || "",
            relations: elementData.relations || "",
            period: elementData.period || "",
            significantEvents: elementData.significantEvents || "",
            consequences: elementData.consequences || "",
          };
          addPendingHistory(historyLegendElement);
          break;
        }

        case WorldBuildingElementType.MAGIC_TECHNOLOGY: {
          const elementData = inputEelementData as MagicTechnologyElement;
          const magicTechnologyElement: MagicTechnologyElement = {
            id: uuidv4(),
            name: elementData.name || "",
            description: elementData.description || "",
            importance: elementData.importance || "",
            originalType: elementData.originalType || "magic_technology",
            type: "magic_technology",
            features: elementData.features || "",
            relations: elementData.relations || "",
            functionality: elementData.functionality || "",
            development: elementData.development || "",
            impact: elementData.impact || "",
          };
          addPendingTechnology(magicTechnologyElement);
          break;
        }

        case WorldBuildingElementType.GEOGRAPHY_ENVIRONMENT: {
          const elementData = inputEelementData as GeographyEnvironmentElement;
          const geographyEnvironmentElement: GeographyEnvironmentElement = {
            id: uuidv4(),
            name: elementData.name || "",
            description: elementData.description || "",
            importance: elementData.importance || "",
            originalType: elementData.originalType || "geography_environment",
            type: "geography_environment",
            features: elementData.features || "",
            relations: elementData.relations || "",
          };
          addPendingGeography(geographyEnvironmentElement);
          break;
        }

        case WorldBuildingElementType.CULTURE: {
          const elementData = inputEelementData as CultureElement;
          const cultureElement: CultureElement = {
            id: uuidv4(),
            name: elementData.name || "",
            description: elementData.description || "",
            importance: elementData.importance || "",
            originalType: elementData.originalType || "culture",
            type: "culture",
            features: elementData.features || "",
            relations: elementData.relations || "",
            customText: elementData.customText || "",
            beliefs: elementData.beliefs || "",
            history: elementData.history || "",
            socialStructure: elementData.socialStructure || "",
            values: elementData.values || [],
            customsArray: elementData.customsArray || [],
          };
          addPendingCulture(cultureElement);
          break;
        }

        case WorldBuildingElementType.RULE: {
          const elementData = inputEelementData as RuleElement;
          const ruleElement: RuleElement = {
            id: uuidv4(),
            name: elementData.name || "",
            description: elementData.description || "",
            importance: elementData.importance || "",
            originalType: elementData.originalType || "rule",
            type: "rule",
            features: elementData.features || "",
            relations: elementData.relations || "",
            impact: elementData.impact || "",
            exceptions: elementData.exceptions || "",
            origin: elementData.origin || "",
          };
          addPendingRule(ruleElement);
          break;
        }

        case WorldBuildingElementType.FREE_TEXT: {
          const elementData = inputEelementData as FreeTextElement;
          const freeField: WorldBuildingFreeField = {
            id: uuidv4(),
            title: elementData.name || "",
            content: elementData.description || "",
            type: elementData.type || "free_text",
          };
          addPendingFreeField(freeField);
          break;
        }

        default: {
          console.warn("[WARN] 未対応の要素タイプ:", inputEelementData.type);
          const elementData = inputEelementData as FreeTextElement;
          // 不明な要素タイプは自由フィールドに追加
          const unknownElement: WorldBuildingFreeField = {
            id: uuidv4(),
            title: elementData.name || "",
            content: JSON.stringify(elementData, null, 2),
            type: elementData.type || "free_text",
          };
          addPendingFreeField(unknownElement);
          break;
        }
      }
    },
    [
      addPendingPlace,
      addPendingCulture,
      addPendingRule,
      addPendingFreeField,
      addPendingGeography,
      addPendingHistory,
      addPendingTechnology,
      addPendingSetting,
      addPendingWorldmap,
    ]
  );

  // AIアシスト機能を使用
  const { generateWorldBuildingBatch } = useAIAssist({
    onWorldBuildingElementGenerated: (result) => {
      console.log(
        "[DEBUG] 世界観要素の生成結果:",
        result,
        "result.response",
        result.response
      );
      if (result && result.name) {
        try {
          console.log("世界観要素の生成結果:", result);

          const elementData = result.elementData
            ?.rawData as WorldBuildingElement;

          if (result.elementData?.rawData) {
            try {
              // データ型のデバッグ表示
              console.log(
                "[DEBUG] 生成された要素タイプ:",
                elementData.type,
                "elementData:",
                elementData
              );

              // 要素タイプに応じて、一時保存領域に追加
              handleProcessWorldBuildingElement(elementData);

              // 重要: 各要素を即時保存して反映する
              console.log(
                "[DEBUG] Calling saveAllPendingElements for element type:",
                elementData.type
              );
              saveAllPendingElements();
            } catch (err) {
              console.error("[Error] 要素処理中のエラー:", err);
            }
          }
        } catch (err) {
          console.error("[Error] 要素パース中のエラー:", err);
        }
      }
    },

    // AIアシスト機能が完了した時のコールバック
    onWorldBuildingBatchSuccess: (result) => {
      if (result && result.elements && result.elements.length > 0) {
        // 処理完了フラグを設定
        setIsGenerating(false);

        // 全要素の処理が完了したことを通知
        setNotificationMessage(
          `全ての世界観要素(${result.elements.length}件)を処理完了しました！`
        );
        setNotificationOpen(true);

        // タブ更新を強制
        setTimeout(() => {
          // 場所タブ
          forceMarkTabAsUpdated(3);
          // ルールタブ
          forceMarkTabAsUpdated(2);
          // 文化タブ
          forceMarkTabAsUpdated(4);
          // 自由記述タブ
          forceMarkTabAsUpdated(8);
          // 地理と環境タブ
          forceMarkTabAsUpdated(5);
          // 歴史と伝説タブ
          forceMarkTabAsUpdated(6);
          // 魔法と技術タブ
          forceMarkTabAsUpdated(7);
          // 設定タブ
          forceMarkTabAsUpdated(1);
          // 世界マップタブ
          forceMarkTabAsUpdated(0);

          // 再レンダリング
          setTriggerRerender((prev) => prev + 1);

          // 確認トースト
          toast.success("世界観要素を追加しました！");
        }, 100);
      }
    },

    // エラー発生時のコールバック
    onError: (error) => {
      setIsGenerating(false);
      setNotificationMessage(`エラーが発生しました: ${error.message}`);
      setNotificationOpen(true);
      toast.error(`世界観生成中にエラーが発生しました: ${error.message}`);
    },
  });

  // 進捗状況を更新する関数を追加
  useCallback((progress: number, current: string, total: number) => {
    setAiGenerationProgress(progress);
    setCurrentElement(current);
    setTotalElements(total);
  }, []);

  return {
    aiModalOpen,
    setAIModalOpen,
    handleProcessWorldBuildingElement,
    aiGenerationProgress,
    isGenerating,
    generateWorldBuildingBatch,
    notificationOpen,
    notificationMessage,
    setNotificationOpen,
    currentElement,
    totalElements,
    triggerRerender,
    forceUpdateCounter,
    forceMarkTabAsUpdated,
  };
};
