import { useState, useEffect } from "react";
import { useAIAssist } from "./useAIAssist";
import { parseWorldBuildingElement } from "../utils/aiResponseParser";
import { toast } from "sonner";
import { useElementAccumulator } from "./useElementAccumulator";
import { v4 as uuidv4 } from "uuid";
import { WorldBuildingElement } from "../types/worldBuilding";
import {
  PlaceElement,
  CultureElement,
  RuleElement,
  HistoryElement,
  LegendElement,
  TechnologyElement,
  MagicElement,
  ReligionElement,
  CustomElement,
  GeographyElement,
  ClimateElement,
  LanguageElement,
  ElementElement,
  WorldmapElement,
  StateDefinitionElement,
  SettingElement,
} from "../types";
import { WorldBuildingFreeField } from "../types";

// デバッグヘルパー - オブジェクトの変更を追跡
const logObjectChange = (
  label: string,
  obj: unknown,
  type: string = "変更検知"
) => {
  console.log(
    `[DEBUG-TRACKER] ${label} ${type}:`,
    typeof obj === "object" ? JSON.parse(JSON.stringify(obj)) : obj
  );
};

/**
 * 世界観構築のAI支援機能を管理するカスタムフック
 */
export const useWorldBuildingAI = () => {
  // 累積保存機能を使用
  const {
    getCurrentProjectState,
    addPendingPlace,
    addPendingRule,
    addPendingCulture,
    addPendingWorldmap,
    addPendingFreeField,
    saveAllPendingElements,
    forceMarkTabAsUpdated,
    forceUpdateCounter,
    validateWorldBuildingData,
    pendingPlaces,
    pendingRules,
    pendingCultures,
    pendingFreeFields,
  } = useElementAccumulator();

  // AI支援モーダル用の状態
  const [aiModalOpen, setAIModalOpen] = useState(false);

  // 進捗表示用の状態
  const [aiGenerationProgress, setAiGenerationProgress] = useState(0);
  const [currentElement, setCurrentElement] = useState<{
    name: string;
    role: string;
  } | null>(null);
  const [totalElements, setTotalElements] = useState(0);

  // 通知の状態管理
  const [isGenerating, setIsGenerating] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // 強制更新トリガー
  const [triggerRerender, setTriggerRerender] = useState(0);

  // 処理完了後の状態を監視して確実に更新を検知
  useEffect(() => {
    if (triggerRerender > 0) {
      console.log("[DEBUG] AIフック強制更新トリガー発動:", triggerRerender);

      // データの一貫性をチェック
      const isFixed = validateWorldBuildingData();

      // 保留中のデータと保存されたデータに不整合がある場合のみ、検証実行
      if (isFixed) {
        console.log("[DEBUG] データの不整合が検出されたため修正しました");
      }

      // 強制更新カウンターの状態を確認
      console.log("[DEBUG] 現在の強制更新カウンター:", forceUpdateCounter);
    }
  }, [triggerRerender, validateWorldBuildingData, forceUpdateCounter]);

  // 保留中のデータを監視
  useEffect(() => {
    // 保留中の場所データを監視
    if (pendingPlaces.length > 0) {
      logObjectChange("保留中の場所データ", {
        count: pendingPlaces.length,
        names: pendingPlaces.map((p) => p.name),
      });
    }
  }, [pendingPlaces]);

  // forceUpdateCounterの変更を監視
  useEffect(() => {
    logObjectChange("強制更新カウンター", forceUpdateCounter);
  }, [forceUpdateCounter]);

  // PlaceElement の処理を行う関数
  const processPlaceElement = (elementData: PlaceElement) => {
    console.log("[DEBUG-TRACKER] 場所追加開始", "処理開始: ", elementData);

    // 場所を保留領域に追加
    addPendingPlace(elementData);

    // 地名追加後の即時保存を実行
    const updatedProject = saveAllPendingElements();

    console.log(
      "[DEBUG] 場所保存後の結果:",
      updatedProject?.worldBuilding?.places
        ? JSON.stringify(updatedProject.worldBuilding.places)
        : "なし"
    );

    // 地名データの検証（遅延を長めに設定）
    setTimeout(() => {
      const project = getCurrentProjectState();
      const savedPlaces = project.worldBuilding?.places || [];
      console.log(
        "[DEBUG] 要素追加後の場所データ： ",
        JSON.stringify(savedPlaces)
      );

      // データがない場合、または特定の場所が保存されていない場合は再試行
      const isPlaceSaved = savedPlaces.some(
        (place: { name: string }) => place.name === elementData.name
      );

      if (!isPlaceSaved) {
        console.log(
          "[DEBUG] 場所データが保存されていないため再試行します:",
          elementData.name,
          "保存されている場所:",
          savedPlaces.map((p: { name: string }) => p.name)
        );

        // 再度保留領域に追加して保存を試みる
        addPendingPlace(elementData);
        saveAllPendingElements();

        // 強制的にタブを更新して確実に反映させる
        forceMarkTabAsUpdated(3);

        // さらに遅延させて最終確認
        setTimeout(() => {
          const finalProject = getCurrentProjectState();
          const finalSavedPlaces = finalProject.worldBuilding?.places || [];
          const isFinallySaved = finalSavedPlaces.some(
            (place: { name: string }) => place.name === elementData.name
          );

          console.log(
            "[DEBUG] 最終確認 - 場所データ保存状態:",
            isFinallySaved ? "成功" : "失敗",
            "場所名:",
            elementData.name
          );

          if (!isFinallySaved) {
            toast.error(
              `「${elementData.name}」の保存に失敗しました。再試行してください。`,
              {
                description: `原因: データ構造の不一致または特殊文字を含む可能性があります。詳細はコンソールログを確認してください。`,
                duration: 5000,
              }
            );
            console.error(elementData);
          }
        }, 300);
      }
    }, 300);

    console.log("[DEBUG-TRACKER] 場所追加完了", "処理完了: ", elementData);
  };

  // CultureElement の処理を行う関数
  const processCultureElement = (elementData: CultureElement) => {
    console.log("[DEBUG-TRACKER] 文化追加開始", "処理開始: ", elementData);

    // 文化を一時保存領域に追加
    addPendingCulture(elementData);

    // 即時保存を実行
    const cultureUpdateResult = saveAllPendingElements();

    console.log(
      "[DEBUG] 文化保存後の結果:",
      cultureUpdateResult?.worldBuilding?.cultures?.length || 0
    );

    // 保存確認とフォールバック
    setTimeout(() => {
      const project = getCurrentProjectState();
      const isCultureSaved = project.worldBuilding?.cultures?.some(
        (c: { name: string }) => c.name === elementData.name
      );

      if (!isCultureSaved) {
        console.log("[DEBUG] 文化データが正しく保存されていないため再試行");

        // 失敗の詳細情報をログに出力
        console.error("[ERROR] 文化データの保存失敗の詳細情報:", {
          cultureObject: JSON.stringify(elementData),
          errorLocation: "handleProcessWorldBuildingElement > culture",
          possibleCause:
            "データ構造の不一致または特殊文字を含む可能性があります",
          objectKeys: Object.keys(elementData),
          objectValues: Object.entries(elementData).map(
            ([key, value]) =>
              `${key}: ${
                typeof value === "string" && /[*"'\\<>]/.test(value)
                  ? "特殊文字を含む可能性あり"
                  : JSON.stringify(value)
              }`
          ),
        });

        addPendingCulture(elementData);
        saveAllPendingElements();
        forceMarkTabAsUpdated(4);
      }
    }, 200);

    console.log("[DEBUG-TRACKER] 文化追加完了", "処理完了: ", elementData);
  };

  const processSettingElement = (elementData: SettingElement) => {
    console.log("[DEBUG-TRACKER] 設定要素追加開始", "処理開始: ", elementData);
    // 設定要素を一時保存領域に追加
    addPendingSetting(elementData);
    saveAllPendingElements();
    console.log("[DEBUG-TRACKER] 設定要素追加完了", "処理完了: ", elementData);
  };

  // WorldmapElement の処理を行う関数
  const processWorldmapElement = (elementData: WorldmapElement) => {
    console.log("[DEBUG-TRACKER] 世界地図追加開始", "処理開始: ", elementData);
    // 世界地図を一時保存領域に追加
    addPendingWorldmap(elementData);
    saveAllPendingElements();
    console.log("[DEBUG-TRACKER] 世界地図追加完了", "処理完了: ", elementData);
  };

  // RuleElement の処理を行う関数
  const processRuleElement = (elementData: RuleElement) => {
    console.log("[DEBUG-TRACKER] ルール追加開始", "処理開始: ", elementData);

    // ルールを一時保存領域に追加
    addPendingRule(elementData);

    // 即時保存を実行
    const ruleUpdateResult = saveAllPendingElements();

    console.log(
      "[DEBUG] ルール保存後の結果:",
      ruleUpdateResult?.worldBuilding?.rules?.length || 0
    );

    // 保存確認とフォールバック
    setTimeout(() => {
      const project = getCurrentProjectState();
      const isRuleSaved = project.worldBuilding?.rules?.some(
        (r: { name: string }) => r.name === elementData.name
      );

      if (!isRuleSaved) {
        console.log("[DEBUG] ルールデータが正しく保存されていないため再試行");

        // 失敗の詳細情報をログに出力
        console.error("[ERROR] ルールデータの保存失敗の詳細情報:", {
          ruleObject: JSON.stringify(elementData),
          errorLocation: "handleProcessWorldBuildingElement > rule",
          possibleCause:
            "データ構造の不一致または特殊文字を含む可能性があります",
          objectKeys: Object.keys(elementData),
          objectValues: Object.entries(elementData).map(
            ([key, value]) =>
              `${key}: ${
                typeof value === "string" && /[*"'\\<>]/.test(value)
                  ? "特殊文字を含む可能性あり"
                  : JSON.stringify(value)
              }`
          ),
        });

        addPendingRule(elementData);
        saveAllPendingElements();
        forceMarkTabAsUpdated(2);
      }
    }, 200);

    console.log("[DEBUG-TRACKER] ルール追加完了", "処理完了: ", elementData);
  };

  // HistoryElement の処理を行う関数
  const processHistoryElement = (elementData: HistoryElement) => {
    console.log("[DEBUG-TRACKER] 歴史要素追加開始", "処理開始: ", elementData);
    // 歴史要素を一時保存領域に追加
    addPendingFreeField({
      id: elementData.id || uuidv4(),
      title: `${elementData.originalType}: ${elementData.name}`,
      content: elementData.description || "",
    });
    saveAllPendingElements();
    console.log("[DEBUG-TRACKER] 歴史要素追加完了", "処理完了: ", elementData);
  };

  // MagicElement の処理を行う関数
  const processMagicElement = (elementData: MagicElement) => {
    console.log("[DEBUG-TRACKER] 魔法要素追加開始", "処理開始: ", elementData);
    // 魔法要素を一時保存領域に追加
    addPendingFreeField({
      id: elementData.id || uuidv4(),
      title: `${elementData.originalType}: ${elementData.name}`,
      content: elementData.description || "",
    });
    saveAllPendingElements();
    console.log("[DEBUG-TRACKER] 魔法要素追加完了", "処理完了: ", elementData);
  };

  // ReligionElement の処理を行う関数
  const processReligionElement = (elementData: ReligionElement) => {
    console.log("[DEBUG-TRACKER] 宗教要素追加開始", "処理開始: ", elementData);
    // 宗教要素を一時保存領域に追加
    addPendingFreeField({
      id: elementData.id || uuidv4(),
      title: `${elementData.originalType}: ${elementData.name}`,
      content: elementData.description || "",
    });
    saveAllPendingElements();
    console.log("[DEBUG-TRACKER] 宗教要素追加完了", "処理完了: ", elementData);
  };

  // CustomElement の処理を行う関数
  const processCustomElement = (elementData: CustomElement) => {
    console.log(
      "[DEBUG-TRACKER] カスタム要素追加開始",
      "処理開始: ",
      elementData
    );
    // カスタム要素を一時保存領域に追加
    addPendingFreeField({
      id: elementData.id || uuidv4(),
      title: `${elementData.originalType}: ${elementData.name}`,
      content: elementData.description || "",
    });
    saveAllPendingElements();
    console.log(
      "[DEBUG-TRACKER] カスタム要素追加完了",
      "処理完了: ",
      elementData
    );
  };

  // StateDefinitionElement の処理を行う関数
  const processStateDefinitionElement = (
    elementData: StateDefinitionElement
  ) => {
    console.log(
      "[DEBUG-TRACKER] 州定義要素追加開始",
      "処理開始: ",
      elementData
    );
    // 州定義要素を一時保存領域に追加
    addPendingFreeField({
      id: elementData.id || uuidv4(),
      title: `${elementData.originalType}: ${elementData.name}`,
      content: elementData.description || "",
    });
    saveAllPendingElements();
    console.log(
      "[DEBUG-TRACKER] 州定義要素追加完了",
      "処理完了: ",
      elementData
    );
  };

  // GeographyElement の処理を行う関数
  const processGeographyElement = (elementData: GeographyElement) => {
    console.log("[DEBUG-TRACKER] 地理要素追加開始", "処理開始: ", elementData);
    // 地理要素を一時保存領域に追加
    addPendingFreeField({
      id: elementData.id || uuidv4(),
      title: `${elementData.originalType}: ${elementData.name}`,
      content: elementData.description || "",
    });
    saveAllPendingElements();
    console.log("[DEBUG-TRACKER] 地理要素追加完了", "処理完了: ", elementData);
  };

  // 世界観要素の生成と処理
  const handleProcessWorldBuildingElement = (
    elementData: WorldBuildingElement
  ) => {
    try {
      // デバッグ出力：世界観要素の詳細情報
      console.log("[DEBUG] 処理開始する世界観要素:", {
        type: elementData.type,
        name: elementData.name,
        originalType: elementData.originalType,
        fields: Object.keys(elementData),
      });

      // 要素タイプに応じて、一時保存領域に追加
      switch (elementData.type) {
        case "worldmap":
          processWorldmapElement(elementData as WorldmapElement);
          break;
        case "setting":
          processSettingElement(elementData as SettingElement);
          break;
        case "rule":
          processRuleElement(elementData as RuleElement);
          break;
        case "place":
          processPlaceElement(elementData as PlaceElement);
          break;
        case "society_culture":
          processCultureElement(elementData as CultureElement);
          break;
        case "geography_environment":
          processGeographyElement(elementData as GeographyElement);
          break;
        case "history_legend":
          processHistoryElement(elementData as HistoryElement);
          break;
        case "magic_technology":
          processMagicElement(elementData as MagicElement);
          break;
        case "free_text":
          processCustomElement(elementData as CustomElement);
          break;
        case "state_definition":
          processStateDefinitionElement(elementData as StateDefinitionElement);
          break;
        default:
          // その他の要素は自由記述欄として追加
          console.log(
            "[DEBUG-TRACKER] その他要素追加開始",
            "処理開始: ",
            elementData
          );

          const newField: WorldBuildingFreeField = {
            id: elementData.id || uuidv4(),
            title: `${elementData.originalType}: ${elementData.name}`,
            content: elementData.description || "",
          };

          // 自由記述欄データのデバッグ出力
          console.log(
            "[DEBUG] 新規自由記述欄データ作成:",
            JSON.stringify(newField)
          );

          // 自由記述欄を一時保存領域に追加
          addPendingFreeField(newField);

          // 即時保存を実行
          const freeFieldUpdateResult = saveAllPendingElements();

          console.log(
            "[DEBUG] 自由記述欄保存後の結果:",
            freeFieldUpdateResult?.worldBuilding?.freeFields?.length || 0
          );

          // 保存確認とフォールバック
          setTimeout(() => {
            const project = getCurrentProjectState();
            const isFreeFieldSaved = project.worldBuilding?.freeFields?.some(
              (f: { title: string }) => f.title === newField.title
            );

            if (!isFreeFieldSaved) {
              console.log(
                "[DEBUG] 自由記述欄データが正しく保存されていないため再試行"
              );

              // 失敗の詳細情報をログに出力
              console.error("[ERROR] 自由記述欄データの保存失敗の詳細情報:", {
                freeFieldObject: JSON.stringify(newField),
                errorLocation: "handleProcessWorldBuildingElement > freeField",
                possibleCause:
                  "データ構造の不一致または特殊文字を含む可能性があります",
                objectKeys: Object.keys(newField),
                objectValues: Object.entries(newField).map(
                  ([key, value]) =>
                    `${key}: ${
                      typeof value === "string" && /[*"'\\<>]/.test(value)
                        ? "特殊文字を含む可能性あり"
                        : JSON.stringify(value)
                    }`
                ),
              });

              addPendingFreeField(newField);
              saveAllPendingElements();
              forceMarkTabAsUpdated(8);
            }
          }, 200);

          console.log(
            "[DEBUG-TRACKER] その他要素追加完了",
            "処理完了: ",
            elementData
          );
          break;
      }

      // 処理中の要素を通知表示
      setNotificationMessage(`「${elementData.name}」を処理しました！`);
      setNotificationOpen(true);
    } catch (error) {
      console.error("世界観要素の追加中にエラーが発生しました:", error);

      // エラーの詳細分析
      const errorInfo = {
        errorObject: error,
        errorMessage: (error as Error).message || "不明なエラー",
        errorStack: (error as Error).stack,
        elementData: elementData ? JSON.stringify(elementData) : "不明",
        elementType: elementData?.type || "不明",
        elementName: elementData?.name || "不明",
        processingStage: "handleProcessWorldBuildingElement",
        possibleCauses: [
          "データ構造の不一致",
          "特殊文字の混入",
          "必須フィールドの欠落",
          "ID重複",
        ],
      };

      console.error("[ERROR] 世界観要素処理の詳細エラー情報:", errorInfo);

      // 失敗時のフォールバック - エラー情報を含むトースト通知
      if (elementData && elementData.name) {
        toast.error(`「${elementData.name}」の処理中にエラーが発生しました。`, {
          description: `詳細: ${(error as Error).message || "不明なエラー"} (${
            elementData.type || "不明な種類"
          })`,
          duration: 5000,
        });
      } else {
        toast.error(
          "世界観要素の処理中にエラーが発生しました。再試行してください。",
          {
            description: "詳細情報はコンソールログを確認してください。",
            duration: 5000,
          }
        );
      }
    }
  };

  // AIアシスト機能を使用
  const { generateWorldBuildingBatch } = useAIAssist({
    onWorldBuildingElementGenerated: (result) => {
      console.log(
        "[DEBUG] 世界観要素の生成結果:",
        result,
        "result.response",
        result.response
      );
      if (result && result.elementData) {
        try {
          console.log("世界観要素の生成結果2:", result);

          // 要素の種類に応じたパースと保存処理
          // const elementData = parseWorldBuildingElement(result.elementData);
          const elementData = result.elementData;

          if (elementData) {
            try {
              // データ型のデバッグ表示
              console.log("[DEBUG] 生成された要素タイプ:", elementData.type);

              // 要素タイプに応じて、一時保存領域に追加
              handleProcessWorldBuildingElement(elementData);

              // 重要: 各要素を即時保存して反映する
              console.log(
                "[DEBUG] Calling saveAllPendingElements for element type:",
                elementData.type
              );
              saveAllPendingElements();

              // 保存後のタブ更新を確実に行う
              setTimeout(() => {
                // 要素タイプに応じたタブを強制的に更新
                if (elementData.type === "place") {
                  console.log("[DEBUG] 場所が追加されたので地名タブを強制更新");
                  forceMarkTabAsUpdated(3);
                } else if (elementData.type === "culture") {
                  console.log(
                    "[DEBUG] 文化が追加されたので社会と文化タブを強制更新"
                  );
                  forceMarkTabAsUpdated(4);
                } else if (elementData.type === "rule") {
                  console.log(
                    "[DEBUG] ルールが追加されたのでルールタブを強制更新"
                  );
                  forceMarkTabAsUpdated(2);
                }

                // 強制的に再レンダリングをトリガー
                setTriggerRerender((prev) => prev + 1);
              }, 50);
            } catch (error) {
              console.error("世界観要素の追加中にエラーが発生しました:", error);
            }
          }
        } catch (err) {
          console.error("世界観要素のパース・保存に失敗:", err);
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

        // 保留中のデータが本当にあるか確認
        console.log("[DEBUG] AIアシスト処理完了 - 保存処理開始. 保留データ:", {
          pendingPlaces:
            pendingPlaces.length > 0 ? pendingPlaces.map((p) => p.name) : [],
          pendingRules: pendingRules.length,
          pendingCultures: pendingCultures.length,
          pendingFreeFields: pendingFreeFields.length,
        });

        // データの整合性チェック - 保留中データがあるのに、保存されていない場合の対策
        if (
          pendingPlaces.length > 0 ||
          pendingRules.length > 0 ||
          pendingCultures.length > 0 ||
          pendingFreeFields.length > 0
        ) {
          // 保存前の状態を記録
          const beforeSaveState = getCurrentProjectState();
          logObjectChange(
            "保存前の世界観データ",
            {
              places: beforeSaveState.worldBuilding?.places?.length || 0,
              placeNames:
                beforeSaveState.worldBuilding?.places?.map(
                  (p: { name: string }) => p.name
                ) || [],
            },
            "保存前"
          );

          // すべての保留中要素を保存
          const updatedProject = saveAllPendingElements();

          // 保存結果を確認して表示
          if (
            updatedProject &&
            updatedProject.worldBuilding &&
            updatedProject.worldBuilding.places
          ) {
            console.log(
              "[DEBUG] 保存後の場所一覧（最新）:",
              updatedProject.worldBuilding.places.map(
                (p: { name: string }) => p.name
              )
            );

            // 保留中の場所データが正しく保存されたか確認
            if (pendingPlaces.length > 0) {
              const savedPlaces = updatedProject.worldBuilding?.places || [];
              const savedNames = savedPlaces.map(
                (p: { name: string }) => p.name
              );
              const pendingNames = pendingPlaces.map(
                (p: { name: string }) => p.name
              );

              console.log("[DEBUG] 保存確認 - 保留中場所:", pendingNames);
              console.log("[DEBUG] 保存確認 - 保存後場所:", savedNames);

              // 保存されていない場合は再保存を試みる
              const allPendingSaved = pendingNames.every((name) =>
                savedNames.includes(name)
              );
              if (!allPendingSaved) {
                console.log(
                  "[DEBUG] 一部の場所が保存されていないため、再保存を実行"
                );

                // 少し遅延させてから再保存 + 時間も長めに
                setTimeout(() => {
                  const retryProject = saveAllPendingElements();
                  console.log(
                    "[DEBUG] 再保存後の場所一覧:",
                    retryProject.worldBuilding?.places?.map(
                      (p: { name: string }) => p.name
                    ) || []
                  );

                  // 強制的にタブ更新処理を実行
                  setTimeout(() => {
                    if (retryProject.worldBuilding?.places?.length > 0) {
                      console.log("[DEBUG] 地名タブを強制更新（再試行）");
                      forceMarkTabAsUpdated(3);
                    }
                    // 強制再レンダリングをトリガー
                    setTriggerRerender((prev) => prev + 1);
                  }, 100);
                }, 200);
              }
            }

            console.log("[DEBUG] AIアシスト処理完了 - 保存処理終了");
            console.log("[DEBUG] 保存結果:", {
              places: updatedProject.worldBuilding?.places?.length || 0,
              placeNames:
                updatedProject.worldBuilding?.places?.map(
                  (p: { name: string }) => p.name
                ) || [],
              rules: updatedProject.worldBuilding?.rules?.length || 0,
              cultures: updatedProject.worldBuilding?.cultures?.length || 0,
              freeFields: updatedProject.worldBuilding?.freeFields?.length || 0,
            });

            // 保存した要素タイプに応じて、該当するタブを強制的に更新済みマーク
            setTimeout(() => {
              console.log("[DEBUG] タブ強制更新処理開始");

              // 地名タブ
              if (updatedProject.worldBuilding?.places?.length > 0) {
                console.log("[DEBUG] 地名タブを強制更新");
                forceMarkTabAsUpdated(3);
                // 確実に更新を検知させるため、少しずらして再度更新
                setTimeout(() => {
                  forceMarkTabAsUpdated(3);
                }, 100);
              }

              // ルールタブ
              if (updatedProject.worldBuilding?.rules?.length > 0) {
                console.log("[DEBUG] ルールタブを強制更新");
                forceMarkTabAsUpdated(2);
              }

              // 社会と文化タブ
              if (updatedProject.worldBuilding?.cultures?.length > 0) {
                console.log("[DEBUG] 社会と文化タブを強制更新");
                forceMarkTabAsUpdated(4);
              }

              // 自由記述欄タブ
              if ((updatedProject.worldBuilding?.freeFields?.length || 0) > 0) {
                console.log("[DEBUG] 自由記述欄タブを強制更新");
                forceMarkTabAsUpdated(8);
              }

              // 強制再レンダリングトリガーを更新
              setTimeout(() => {
                console.log("[DEBUG] 強制再レンダリングトリガー実行");
                setTriggerRerender((prev) => prev + 1);

                // さらに確実にするため、トーストメッセージで通知
                toast.success("世界観要素を追加しました！", {
                  duration: 3000,
                });
              }, 100);
            }, 100);
          } else {
            console.warn(
              "[DEBUG] 保留中のデータがありません。保存をスキップします。"
            );
            // データがない場合でもUIの更新を試みる
            setTriggerRerender((prev) => prev + 1);
          }
        }
      }
    },

    onCharacterGenerationProgress: (progress, current, total) => {
      // 進捗情報の更新
      setAiGenerationProgress(progress);
      if (current) setCurrentElement(current);
      if (total) setTotalElements(total);

      // 進捗状況をコンソールに表示
      console.log(
        `生成進捗: ${Math.round(progress * 100)}% ${current?.name} ${total}人中`
      );
    },
  }); // AIに世界観要素を考えてもらう関数はここで削除されました

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
