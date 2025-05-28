import { useState, useCallback } from "react";
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
  PlotElement,
  Character,
} from "@novel-ai-assistant/types";
import { WorldBuildingApiResponse } from "../types/apiResponse";

/**
 * 世界観構築のAI支援機能を管理するカスタムフック
 */
export const useWorldBuildingAI = () => {
  // 生成進捗の表示
  const [aiGenerationProgress, setAiGenerationProgress] = useState(0);
  const [currentElement, setCurrentElement] = useState("");
  const [totalElements, setTotalElements] = useState(0);

  // 通知関連
  const [notificationOpen, setNotificationOpen] = useState(false);

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
  } = useElementAccumulator();

  // 再レンダリング制御
  const [triggerRerender] = useState(0);

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

  // AIアシスト機能を使用（削除済み）
  // const { generateWorldBuildingBatch } = useAIAssist({
  //   onWorldBuildingElementGenerated: (result) => {
  //     // 削除済み
  //   },
  //   onWorldBuildingBatchSuccess: (result) => {
  //     // 削除済み
  //   },
  //   onError: (error) => {
  //     // 削除済み
  //   },
  // });

  // generateWorldBuildingBatchの実装
  const generateWorldBuildingBatch = useCallback(
    async (
      message: string,
      plotElements: unknown[],
      existingElements: unknown[]
    ) => {
      console.log("世界観バッチ生成開始:", {
        message,
        plotElements,
        existingElements,
      });

      try {
        setAiGenerationProgress(0);
        setCurrentElement("世界観要素リストを生成中...");
        setTotalElements(0);

        // AI APIを動的インポート
        const { aiAgentApi } = await import("../api/aiAgent");

        // プロジェクト情報を含めたコンテキストメッセージを構築
        const plotElementsTyped = plotElements as PlotElement[];
        const charactersElementsTyped = existingElements as Character[];

        // プロジェクトの文脈を含めたメッセージを作成
        const contextualMessage = `${message}

重要な要求事項：
- 場所（place）要素を最低3件生成してください
- プロット要素との整合性を保ってください
- キャラクター設定との矛盾がないようにしてください
- 物語の雰囲気に合った世界観要素を生成してください

プロット情報:
${plotElementsTyped
  .map((plot) => `- ${plot.title}: ${plot.description}`)
  .join("\n")}

キャラクター情報:
${charactersElementsTyped
  .map((char) => `- ${char.name}: ${char.description}`)
  .join("\n")}`;

        // 1. 世界観要素リストを生成
        setAiGenerationProgress(10);
        setCurrentElement("世界観要素リストを生成中...");

        const listResponse = await aiAgentApi.generateWorldBuildingList(
          contextualMessage,
          plotElementsTyped,
          charactersElementsTyped,
          "gemini-1.5-pro",
          "json",
          "world-building-list-generic"
        );

        if (listResponse.status !== "success" || !listResponse.data) {
          throw new Error("世界観要素リストの生成に失敗しました");
        }

        // 生成された要素リストを解析
        let elementsList: Array<{ name: string; type: string }> = [];

        try {
          if (typeof listResponse.data === "string") {
            elementsList = JSON.parse(listResponse.data);
          } else if (Array.isArray(listResponse.data)) {
            elementsList = listResponse.data;
          } else {
            console.warn("予期しないデータ形式:", listResponse.data);
            elementsList = [];
          }
        } catch (parseError) {
          console.error("要素リスト解析エラー:", parseError);
          throw new Error("生成された要素リストの解析に失敗しました");
        }

        if (elementsList.length === 0) {
          throw new Error("生成された要素リストが空でした");
        }

        // 場所要素の数をチェック
        const placeElements = elementsList.filter(
          (element) => element.type === "place" || element.type === "places"
        );

        console.log(
          `生成された要素: ${elementsList.length}件 (場所: ${placeElements.length}件)`
        );

        if (placeElements.length < 3) {
          console.warn(
            `場所要素が${placeElements.length}件しかありません。最低3件必要です。`
          );
        }

        setTotalElements(elementsList.length);
        setAiGenerationProgress(20);

        // 2. 各要素の詳細を生成
        const detailResults: (WorldBuildingApiResponse | null)[] = [];

        for (let index = 0; index < elementsList.length; index++) {
          const element = elementsList[index];
          const progressPercent = 20 + ((index + 1) / elementsList.length) * 70;
          setAiGenerationProgress(progressPercent);
          setCurrentElement(`${element.name} (${element.type}) を生成中...`);

          console.log(
            `要素 ${index + 1}/${elementsList.length} 生成中: ${
              element.name
            } (${element.type})`
          );

          try {
            // プロジェクトの文脈を含めた詳細生成メッセージ
            const detailMessage = `「${element.name}」という${element.type}の詳細情報を生成してください。

プロジェクトの文脈:
${contextualMessage}

この要素は物語の世界観の一部として、プロットやキャラクターと整合性を保つ必要があります。`;

            const detailResponse = await aiAgentApi.generateWorldBuildingDetail(
              element.name,
              element.type,
              detailMessage,
              plotElementsTyped,
              charactersElementsTyped,
              "json"
            );

            if (detailResponse.status === "success" && detailResponse.data) {
              // 生成された要素を処理
              handleProcessWorldBuildingElement(detailResponse.data);
              console.log(`要素 ${element.name} 生成完了`);
              detailResults.push(detailResponse);
            } else {
              console.error(`要素 ${element.name} 生成失敗:`, detailResponse);
              detailResults.push(null);
            }
          } catch (error) {
            console.error(`要素 ${element.name} 生成エラー:`, error);
            detailResults.push(null);
          }

          // API制限を回避するため少し待機
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const successfulResults = detailResults.filter(
          (result) => result !== null
        );

        setAiGenerationProgress(100);
        setCurrentElement("生成完了");

        console.log(
          `${successfulResults.length}個の世界観要素の詳細生成が完了しました`
        );

        // 通知を表示
        setNotificationOpen(true);

        return Promise.resolve();
      } catch (error) {
        console.error("世界観バッチ生成エラー:", error);
        setCurrentElement("生成エラー");
        throw error;
      }
    },
    [handleProcessWorldBuildingElement, setNotificationOpen]
  );

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
      return Promise.resolve();
    },
    []
  );

  // cancelAIGeneration のダミー実装
  const cancelAIGeneration = useCallback(() => {
    console.warn("cancelAIGeneration is not implemented in useWorldBuildingAI");
  }, []);

  // 進捗状況を更新するコールバック
  const handleProgressUpdate = useCallback(
    (progress: number, current: string, total: number) => {
      setAiGenerationProgress(progress);
      setCurrentElement(current);
      setTotalElements(total);
    },
    []
  );

  return {
    aiGenerationProgress,
    generateWorldBuildingBatch,
    notificationOpen,
    setNotificationOpen,
    currentElement,
    totalElements,
    triggerRerender,
    handleProgressUpdate,
    initiateWorldBuildingAIGeneration,
    cancelAIGeneration,
    handleProcessWorldBuildingElement,
  };
};
