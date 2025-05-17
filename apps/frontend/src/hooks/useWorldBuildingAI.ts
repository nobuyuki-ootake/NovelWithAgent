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
  GeographyEnvironmentElement,
  MagicTechnologyElement,
  HistoryLegendElement,
  WorldBuildingElementType,
  WorldBuildingElement,
  FreeFieldElement,
} from "@novel-ai-assistant/types";

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
  } = useElementAccumulator();

  // initiateWorldBuildingAIGeneration のダミー実装
  const initiateWorldBuildingAIGeneration = useCallback(
    async (
      elementsToGenerate: Array<{
        elementType: string;
        count: number;
        customPrompt?: string;
      }>,
      apiKey: string,
      model: string
    ) => {
      console.warn(
        "initiateWorldBuildingAIGeneration is not implemented in useWorldBuildingAI",
        { elementsToGenerate, apiKey, model }
      );
      // 実際のAI生成ロジックがないため、Promiseを解決するだけ
      return Promise.resolve();
    },
    []
  );

  // cancelAIGeneration のダミー実装
  const cancelAIGeneration = useCallback(() => {
    console.warn("cancelAIGeneration is not implemented in useWorldBuildingAI");
    // 実際のキャンセルロジックがない
  }, []);

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
          addPendingPlace(placeElement);
          console.log("[DEBUG] 処理完了した要素:", placeElement);
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
            customs: elementData.customs || [],
            government: elementData.government || "",
            religion: elementData.religion || "",
            language: elementData.language || "",
            art: elementData.art || "",
            technology: elementData.technology || "",
            notes: elementData.notes || "",
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

        case WorldBuildingElementType.FREE_FIELD: {
          const elementData = inputEelementData as FreeFieldElement;
          const freeField: FreeFieldElement = {
            id: uuidv4(),
            name: elementData.name || "",
            description: elementData.description || "",
            features: elementData.features || "",
            importance: elementData.importance || "",
            relations: elementData.relations || "",
            type: elementData.type || "free_field",
            originalType: elementData.originalType || "free_field",
          };
          addPendingFreeField(freeField);
          break;
        }

        default: {
          console.warn("[WARN] 未対応の要素タイプ:", inputEelementData.type);
          const elementData = inputEelementData as FreeFieldElement;
          // 不明な要素タイプは自由フィールドに追加
          const unknownElement: FreeFieldElement = {
            id: uuidv4(),
            name: elementData.name || "",
            description: elementData.description || "",
            features: elementData.features || "",
            importance: elementData.importance || "",
            relations: elementData.relations || "",
            type: elementData.type || "free_field",
            originalType: elementData.originalType || "free_field",
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
        "[DEBUG] AIアシスト onWorldBuildingElementGenerated - result:",
        result
      );
      if (result && (result.elementName || result.name)) {
        try {
          console.log(
            "AIアシスト onWorldBuildingElementGenerated - result (valid name):",
            result
          );

          let elementDataToProcess: WorldBuildingElement | undefined =
            undefined;
          if (result.elementData && typeof result.elementData === "object") {
            elementDataToProcess = result.elementData as WorldBuildingElement;
            if ((result.elementData as any).rawData) {
              elementDataToProcess = (result.elementData as any)
                .rawData as WorldBuildingElement;
            }
          } else if (
            typeof result.response === "string" &&
            result.response.trim() !== ""
          ) {
            console.warn(
              "[WARN] AI response string parsing not implemented in this example. Element may not be processed."
            );
          }

          if (elementDataToProcess) {
            console.log(
              "[DEBUG] AIアシスト onWorldBuildingElementGenerated - Processing elementData:",
              elementDataToProcess
            );
            handleProcessWorldBuildingElement(elementDataToProcess);
          } else {
            console.warn(
              "[WARN] AIアシスト onWorldBuildingElementGenerated - No valid elementData to process from result:",
              result
            );
          }
        } catch (err) {
          console.error(
            "[Error] AIアシスト onWorldBuildingElementGenerated - 要素処理中のエラー:",
            err
          );
        }
      } else {
        console.warn(
          "[WARN] AIアシスト onWorldBuildingElementGenerated - Invalid result or missing element name:",
          result
        );
      }
    },

    // AIアシスト機能が完了した時のコールバック
    onWorldBuildingBatchSuccess: (result) => {
      console.log(
        "[DEBUG] AIアシスト onWorldBuildingBatchSuccess - result:",
        result
      );
      if (result && result.elements && result.elements.length > 0) {
        setIsGenerating(false);

        console.log(
          "[DEBUG] AIアシスト onWorldBuildingBatchSuccess - Calling saveAllPendingElements"
        );
        saveAllPendingElements();

        setNotificationMessage(
          `全ての世界観要素(${result.elements.length}件)を処理完了しました！`
        );
        setNotificationOpen(true);

        setTimeout(() => {
          const updatedIndexes = new Set<number>();
          result.elements?.forEach((element) => {
            if (element.elementType) {
              const pseudoIndex = element.elementType.charCodeAt(0) % 10;
              updatedIndexes.add(pseudoIndex);
            }
          });
          updatedIndexes.forEach((index) => forceMarkTabAsUpdated(index));
          if (updatedIndexes.size === 0) {
            forceMarkTabAsUpdated(0);
            forceMarkTabAsUpdated(1);
            forceMarkTabAsUpdated(2);
            forceMarkTabAsUpdated(3);
          }

          setTriggerRerender((prev) => prev + 1);
          toast.success("AIによる世界観要素の追加が完了しました！");
        }, 100);
      } else {
        setIsGenerating(false);
        toast.info("AIによって追加される新しい世界観要素はありませんでした。");
        console.log(
          "[DEBUG] AIアシスト onWorldBuildingBatchSuccess - No elements to process or save."
        );
      }
    },

    // エラー発生時のコールバック
    onError: (error) => {
      setIsGenerating(false);
      setNotificationMessage(`エラーが発生しました: ${error.message}`);
      setNotificationOpen(true);
      toast.error(`世界観生成中にエラーが発生しました: ${error.message}`);
      console.error("[Error] AIアシスト onError:", error);
    },
  });

  // 進捗状況を更新するコールバック (useAIAssist に渡す想定)
  const handleProgressUpdate = useCallback(
    (progress: number, current: string, total: number) => {
      setAiGenerationProgress(progress);
      setCurrentElement(current);
      setTotalElements(total);
    },
    []
  );

  return {
    aiModalOpen,
    setAIModalOpen,
    aiGenerationProgress,
    isGenerating,
    generateWorldBuildingBatch,
    notificationOpen,
    notificationMessage,
    setNotificationOpen,
    currentElement,
    totalElements,
    triggerRerender,
    handleProgressUpdate,
    initiateWorldBuildingAIGeneration,
    cancelAIGeneration,
  };
};
