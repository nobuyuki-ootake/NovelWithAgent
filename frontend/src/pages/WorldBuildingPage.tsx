import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Snackbar,
  Badge,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useWorldBuilding } from "../hooks/useWorldBuilding";
import WorldMapTab from "../components/worldbuilding/WorldMapTab";
import SettingTab from "../components/worldbuilding/SettingTab";
import TabPanel from "../components/worldbuilding/TabPanel";
import SocietyCultureTab from "../components/worldbuilding/SocietyCultureTab";
import GeographyEnvironmentTab from "../components/worldbuilding/GeographyEnvironmentTab";
import HistoryLegendTab from "../components/worldbuilding/HistoryLegendTab";
import MagicTechnologyTab from "../components/worldbuilding/MagicTechnologyTab";
import RulesTab from "../components/worldbuilding/RulesTab";
import PlacesTab from "../components/worldbuilding/PlacesTab";
import FreeFieldsTab from "../components/worldbuilding/FreeFieldsTab";
import CharacterStatusList from "../components/characters/CharacterStatusList";
import CharacterStatusEditorDialog from "../components/characters/CharacterStatusEditorDialog";
import { CharacterStatus } from "../types/index";
import { ExtendedPlace } from "../components/worldbuilding/PlacesTab";
import { AIAssistModal } from "../components/modals/AIAssistModal";
import { useAIAssist } from "../hooks/useAIAssist";
import { useRecoilValue, useRecoilState } from "recoil";
import { currentProjectState } from "../store/atoms";
import { parseWorldBuildingElement } from "../utils/aiResponseParser";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// 型定義
interface Place {
  id: string;
  name: string;
  description: string;
  significance: string;
}

interface Culture {
  id: string;
  name: string;
  description: string;
  significance: string;
}

interface Rule {
  id: string;
  name: string;
  description: string;
  significance: string;
}

interface FreeField {
  id: string;
  title: string;
  content: string;
}

interface BatchProcessResult {
  batchResponse?: boolean;
  elements?: Array<{
    response: string;
    agentUsed: string;
    steps: Array<unknown>;
    elementName?: string;
    elementType?: string;
  }>;
  totalElements?: number;
}

const WorldBuildingPage: React.FC = () => {
  const currentProject = useRecoilValue(currentProjectState);
  const {
    tabValue,
    mapImageUrl,
    description,
    history,
    rules,
    newRule,
    places,
    freeFields,
    newFreeField,
    isEditingFreeField,
    snackbarOpen,
    snackbarMessage,
    newPlace,
    isEditingPlace,
    socialStructure,
    government,
    economy,
    religion,
    traditions,
    language,
    art,
    education,
    technology,
    geography,
    climate,
    flora,
    fauna,
    resources,
    settlements,
    naturalDisasters,
    seasonalChanges,
    historicalEvents,
    ancientCivilizations,
    myths,
    legends,
    folklore,
    religions,
    historicalFigures,
    conflicts,
    magicSystem,
    magicRules,
    magicUsers,
    artifacts,
    technologyLevel,
    inventions,
    energySources,
    transportation,
    handleTabChange,
    handleMapImageUpload,
    handleSettingChange,
    handleHistoryChange,
    handleAddRule,
    handleDeleteRule,
    setNewRule,
    handleFreeFieldChange,
    handleAddFreeField,
    handleEditFreeField,
    handleDeleteFreeField,
    handlePlaceChange,
    handleAddPlace,
    handleEditPlace,
    handleDeletePlace,
    handleSaveWorldBuilding,
    handleCloseSnackbar,
    handleSocialStructureChange,
    handleGovernmentChange,
    handleEconomyChange,
    handleReligionChange,
    handleTraditionsChange,
    handleLanguageChange,
    handleArtChange,
    handleEducationChange,
    handleTechnologyChange,
    handleGeographyChange,
    handleClimateChange,
    handleFloraChange,
    handleFaunaChange,
    handleResourcesChange,
    handleSettlementsChange,
    handleNaturalDisastersChange,
    handleSeasonalChangesChange,
    handleHistoricalEventsChange,
    handleAncientCivilizationsChange,
    handleMythsChange,
    handleLegendsChange,
    handleFolkloreChange,
    handleReligionsChange,
    handleHistoricalFiguresChange,
    handleConflictsChange,
    handleMagicSystemChange,
    handleMagicRulesChange,
    handleMagicUsersChange,
    handleArtifactsChange,
    handleTechnologyLevelChange,
    handleInventionsChange,
    handleEnergySourcesChange,
    handleTransportationChange,
    definedCharacterStatuses,
    handleSaveDefinedCharacterStatus,
    handleDeleteDefinedCharacterStatus,
    isEditingDefinedCharacterStatus,
    currentDefinedCharacterStatus,
    handleEditDefinedCharacterStatus,
    handleCancelEditDefinedCharacterStatus,
  } = useWorldBuilding();

  // 一時的な変数を追加（本来はuseWorldBuildingから取得すべき）
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

  // AI支援モーダル用の状態
  const [aiModalOpen, setAIModalOpen] = useState(false);
  // 進捗表示用の状態（デバッグ用途のため保持）
  const setAiGenerationProgress = useState(0)[1];
  const setCurrentElement = useState<{
    name: string;
    role: string;
  } | null>(null)[1];
  const setTotalElements = useState(0)[1];

  // タブの更新状態を追跡（どのタブが更新されたかを示すため）
  const [updatedTabs, setUpdatedTabs] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [currentProject_, setCurrentProject_] =
    useRecoilState(currentProjectState);

  // 生成した要素を一時的に保持する配列
  const [pendingPlaces, setPendingPlaces] = useState<Place[]>([]);
  const [pendingRules, setPendingRules] = useState<Rule[]>([]);
  const [pendingCultures, setPendingCultures] = useState<Culture[]>([]);
  const [pendingFreeFields, setPendingFreeFields] = useState<FreeField[]>([]);

  // タブが更新されたことを記録
  const markTabAsUpdated = (tabIndex: number) => {
    setUpdatedTabs((prev) => ({
      ...prev,
      [tabIndex]: true,
    }));
  };

  // プロジェクト状態の監視
  useEffect(() => {
    if (currentProject_ && currentProject_.worldBuilding) {
      console.log(
        "プロジェクト状態変更検知:",
        currentProject_.worldBuilding.places?.length || 0,
        "箇所の場所情報"
      );
    }
  }, [currentProject_]);

  // バッチ処理の結果を監視
  const [processResult, setProcessResult] = useState<BatchProcessResult | null>(
    null
  );

  // 現在のプロジェクト状態を取得する関数（常に最新の状態を取得するため）
  const getCurrentProjectState = () => {
    // ディープコピーして返す
    return JSON.parse(JSON.stringify(currentProject_));
  };

  // プロジェクト更新関数（累積的な更新を行うための関数）
  const updateProjectState = (
    updater: (project: typeof currentProject_) => typeof currentProject_
  ) => {
    // 現在の最新状態を取得
    const latestProject = getCurrentProjectState();

    // 更新関数を適用
    const updatedProject = updater(latestProject);

    // 状態を更新
    setCurrentProject_(updatedProject);
    setHasUnsavedChanges(true);

    return updatedProject;
  };

  // すべての保留中の要素を保存する関数
  const saveAllPendingElements = () => {
    // 現在のプロジェクト情報を取得
    // ディープコピーして変更する
    const projectToUpdate = JSON.parse(JSON.stringify(currentProject_));

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
      };
    }

    console.log("すべての保留中要素を一括保存します...");

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

    // 自由記述欄の保存
    if (pendingFreeFields.length > 0) {
      console.log(`保留中の自由記述欄: ${pendingFreeFields.length}件`);

      // 既存の自由記述欄配列を確保
      const existingFreeFields = Array.isArray(
        projectToUpdate.worldBuilding.freeFields
      )
        ? projectToUpdate.worldBuilding.freeFields
        : [];

      // 重複確認
      const fieldIds = new Set(existingFreeFields.map((f: FreeField) => f.id));
      const newFields = pendingFreeFields.filter(
        (f: FreeField) => !fieldIds.has(f.id)
      );

      if (newFields.length > 0) {
        projectToUpdate.worldBuilding.freeFields = [
          ...existingFreeFields,
          ...newFields,
        ];
      }

      // 自由記述欄タブを更新済みとしてマーク
      markTabAsUpdated(8);
    }

    // プロジェクトを更新
    setCurrentProject_(projectToUpdate);
    setHasUnsavedChanges(true);

    // 保留中のデータをクリア
    setPendingPlaces([]);
    setPendingRules([]);
    setPendingCultures([]);
    setPendingFreeFields([]);

    // 保存完了を通知
    toast.success("すべての世界観要素を保存しました");

    return projectToUpdate;
  };

  // バッチ処理完了時の検証
  useEffect(() => {
    if (processResult) {
      console.log("バッチ処理完了後の最終確認:");

      // まずすべての保留中要素を保存
      saveAllPendingElements();

      // 遅延実行して最新の状態を取得
      setTimeout(() => {
        // 最新のプロジェクト状態を確認
        const finalProject = JSON.parse(JSON.stringify(currentProject_));
        console.log(
          "最終プロジェクト状態:",
          finalProject.worldBuilding.places?.length || 0,
          "件の場所情報"
        );

        if (finalProject.worldBuilding.places) {
          finalProject.worldBuilding.places.forEach(
            (place: Place, index: number) => {
              console.log(`場所 ${index + 1}:`, place.name);
            }
          );
        }

        // Recoil全体の状態確認
        console.log("すべての処理完了後の状態確認:");
        // 現在の場所データが全て含まれているか検証
        if (finalProject.worldBuilding.places) {
          console.log("★ 最終データ確認 - 累積された場所データ:");
          finalProject.worldBuilding.places.forEach((p: Place) => {
            console.log(`- ${p.name}: ${p.description.substring(0, 30)}...`);
          });
        }

        // リセット
        setProcessResult(null);
      }, 500);
    }
  }, [processResult, currentProject_]);

  // AIアシスト機能
  const { generateWorldBuildingBatch } = useAIAssist({
    onWorldBuildingElementGenerated: (result) => {
      if (result && result.response) {
        try {
          console.log("世界観要素の生成結果:", result);

          // 要素の種類に応じたパースと保存処理
          const elementData = parseWorldBuildingElement(result.response);

          if (elementData) {
            try {
              // プロジェクト状態を更新する
              const updatedProject = updateProjectState((currentProject) => {
                // 現在の状態のディープコピーを作成
                const projectCopy = JSON.parse(JSON.stringify(currentProject));

                // 世界観データが存在しない場合は初期化
                if (!projectCopy.worldBuilding) {
                  projectCopy.worldBuilding = {
                    id: uuidv4(),
                    mapImageUrl: "",
                    setting: "",
                    history: "",
                    rules: [],
                    places: [],
                    cultures: [],
                    freeFields: [],
                  };
                }

                // 要素タイプに応じて、データを準備
                const currentWorldBuilding = projectCopy.worldBuilding;

                // デバッグログ：更新前の状態を確認
                console.log(
                  "更新前のプロジェクト:",
                  JSON.stringify(projectCopy.worldBuilding)
                );

                switch (elementData.type) {
                  case "place": {
                    // 場所を追加
                    const newPlace = {
                      id: elementData.id,
                      name: elementData.name,
                      description: elementData.description || "",
                      significance: elementData.importance || "",
                    };

                    // 既存の場所配列をチェック
                    const existingPlaces = Array.isArray(
                      currentWorldBuilding.places
                    )
                      ? currentWorldBuilding.places
                      : [];

                    // 新しい場所を追加（完全に新しい配列を作成）
                    projectCopy.worldBuilding = {
                      ...currentWorldBuilding,
                      places: [...existingPlaces, newPlace],
                    };

                    console.log(
                      `場所「${elementData.name}」をプロジェクトに追加しました`
                    );
                    console.log(
                      "更新後の場所一覧:",
                      projectCopy.worldBuilding.places
                    );

                    // 場所を一時保存領域に追加
                    setPendingPlaces((prevPlaces) => {
                      const updatedPlaces = [...prevPlaces, newPlace];
                      console.log(
                        `一時保存に追加: ${elementData.name} (現在${updatedPlaces.length}件)`
                      );
                      return updatedPlaces;
                    });

                    // 地名タブを更新済みとしてマーク
                    markTabAsUpdated(3);
                    break;
                  }

                  case "culture": {
                    // 文化を追加
                    const newCulture = {
                      id: elementData.id,
                      name: elementData.name,
                      description: elementData.description || "",
                      significance: elementData.importance || "",
                    };

                    // 既存の文化配列をチェック
                    const existingCultures = Array.isArray(
                      currentWorldBuilding.cultures
                    )
                      ? currentWorldBuilding.cultures
                      : [];

                    // 新しい文化を追加
                    projectCopy.worldBuilding = {
                      ...currentWorldBuilding,
                      cultures: [...existingCultures, newCulture],
                    };

                    console.log(
                      `文化「${elementData.name}」をプロジェクトに追加しました`
                    );

                    // 文化を一時保存領域に追加
                    setPendingCultures((prevCultures) => {
                      const updatedCultures = [...prevCultures, newCulture];
                      console.log(
                        `文化を一時保存に追加: ${elementData.name} (現在${updatedCultures.length}件)`
                      );
                      return updatedCultures;
                    });

                    // 文化タブを更新済みとしてマーク
                    markTabAsUpdated(4);
                    break;
                  }

                  // タイプに応じたケース分けを続ける
                  case "social": {
                    // 社会構造の更新
                    projectCopy.worldBuilding.socialStructure =
                      elementData.description || "";
                    markTabAsUpdated(6);
                    break;
                  }

                  case "rule": {
                    // ルールを追加
                    const newRule = {
                      id: elementData.id,
                      name: elementData.name,
                      description: elementData.description || "",
                      significance: elementData.importance || "",
                    };

                    // 既存のルール配列をチェック
                    const existingRules = Array.isArray(
                      currentWorldBuilding.rules
                    )
                      ? currentWorldBuilding.rules
                      : [];

                    // 新しいルールを追加
                    projectCopy.worldBuilding = {
                      ...currentWorldBuilding,
                      rules: [...existingRules, newRule],
                    };

                    console.log(
                      `ルール「${elementData.name}」をプロジェクトに追加しました`
                    );

                    // ルールを一時保存領域に追加
                    setPendingRules((prevRules) => {
                      const updatedRules = [...prevRules, newRule];
                      console.log(
                        `ルールを一時保存に追加: ${elementData.name} (現在${updatedRules.length}件)`
                      );
                      return updatedRules;
                    });

                    // ルールタブを更新済みとしてマーク
                    markTabAsUpdated(5);
                    break;
                  }

                  case "culture_field": {
                    // 文化情報を自由記述欄として追加
                    const newCultureField = {
                      id: elementData.id,
                      title: `文化: ${elementData.name}`,
                      content: elementData.description || "",
                    };

                    // 既存の自由記述欄配列をチェック
                    const existingFreeFields = Array.isArray(
                      currentWorldBuilding.freeFields
                    )
                      ? currentWorldBuilding.freeFields
                      : [];

                    // 新しい自由記述欄を追加（完全に新しい配列を作成）
                    projectCopy.worldBuilding = {
                      ...currentWorldBuilding,
                      freeFields: [...existingFreeFields, newCultureField],
                    };

                    console.log(
                      `文化「${elementData.name}」をプロジェクトに追加しました`
                    );
                    console.log(
                      "更新後の自由記述欄一覧:",
                      projectCopy.worldBuilding.freeFields
                    );

                    // 自由記述欄を一時保存領域に追加
                    setPendingFreeFields((prevFields) => {
                      const updatedFields = [...prevFields, newCultureField];
                      console.log(
                        `自由記述欄を一時保存に追加: ${elementData.name} (現在${updatedFields.length}件)`
                      );
                      return updatedFields;
                    });

                    // 自由記述欄タブを更新済みとしてマーク
                    markTabAsUpdated(8);
                    break;
                  }

                  default: {
                    // その他の要素は自由記述欄として追加
                    const newField = {
                      id: elementData.id,
                      title: `${elementData.originalType}: ${elementData.name}`,
                      content: elementData.description || "",
                    };

                    // 既存の自由記述欄配列をチェック
                    const existingFreeFields = Array.isArray(
                      currentWorldBuilding.freeFields
                    )
                      ? currentWorldBuilding.freeFields
                      : [];

                    // 新しい自由記述欄を追加（完全に新しい配列を作成）
                    projectCopy.worldBuilding = {
                      ...currentWorldBuilding,
                      freeFields: [...existingFreeFields, newField],
                    };

                    console.log(
                      `要素「${elementData.name}」をプロジェクトに追加しました`
                    );
                    console.log(
                      "更新後の自由記述欄一覧:",
                      projectCopy.worldBuilding.freeFields
                    );

                    // 自由記述欄を一時保存領域に追加
                    setPendingFreeFields((prevFields) => {
                      const updatedFields = [...prevFields, newField];
                      console.log(
                        `自由記述欄を一時保存に追加: ${elementData.name} (現在${updatedFields.length}件)`
                      );
                      return updatedFields;
                    });

                    // 自由記述欄タブを更新済みとしてマーク
                    markTabAsUpdated(8);
                    break;
                  }
                }

                // デバッグ：最終的な更新結果を確認
                console.log(
                  "最終的な更新プロジェクト:",
                  JSON.stringify(projectCopy.worldBuilding)
                );

                // 個別要素を保存せず、一時配列に追加するだけにする
                // 実際の保存はバッチ処理完了後にまとめて行う
                console.log(`「${elementData.name}」を一時保存に追加しました`);
                toast.success(`「${elementData.name}」を処理しました！`);

                // 一時保存データ確認
                setTimeout(() => {
                  // 一時保存配列の確認
                  console.log(
                    "一時保存データ確認:",
                    `場所:${pendingPlaces.length}件、ルール:${pendingRules.length}件、` +
                      `文化:${pendingCultures.length}件、自由記述欄:${pendingFreeFields.length}件`
                  );
                }, 200);

                // 最終的に更新された状態を返す
                return projectCopy;
              });
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
    onSuccess: (result) => {
      if (result && result.elements && result.elements.length > 0) {
        // すべての要素が追加されたことを通知
        toast.success(
          `全ての世界観要素(${result.elements.length}件)を処理完了しました！`,
          {
            duration: 5000,
          }
        );

        // 処理結果を記録（検証用）
        setProcessResult(result);

        console.log(
          "バッチ処理が完了しました。保留中の要素をすべて保存します..."
        );
      }
    },

    onCharacterGenerationProgress: (progress, current, total) => {
      // 進捗情報の更新
      setAiGenerationProgress(progress);
      if (current) setCurrentElement(current);
      if (total) setTotalElements(total);

      // 進捗状況をコンソールに表示（デバッグ用）
      console.log(
        `生成進捗: ${Math.round(progress * 100)}% ${current?.name} ${total}人中`
      );
    },
  });

  // AIに世界観要素を考えてもらう
  const handleAIAssist = async (message: string) => {
    try {
      // 最新のプロジェクト情報を取得
      const currentProjectInfo = getCurrentProjectState();

      if (!currentProjectInfo) {
        toast.error("現在のプロジェクトが見つかりません");
        return;
      }

      // 開始前に一時保存領域をクリア
      setPendingPlaces([]);
      setPendingRules([]);
      setPendingCultures([]);
      setPendingFreeFields([]);

      const plotElements = currentProjectInfo.plot || [];
      const characterElements = currentProjectInfo.characters || [];

      // AIに世界観要素を生成させる
      const result = await generateWorldBuildingBatch(
        message,
        plotElements,
        characterElements
      );

      console.log("AI世界観生成結果:", result);

      // 生成完了を通知
      if (result && result.elements?.length > 0) {
        toast.success(
          `${result.elements.length}件の世界観要素を生成しました！`,
          {
            duration: 5000,
          }
        );

        // モーダルを閉じる
        setAIModalOpen(false);

        // 処理結果を記録（検証用）
        setProcessResult(result);

        console.log(
          "バッチ処理が完了しました。保留中の要素をすべて保存します..."
        );

        // 保存状態の最終確認
        setTimeout(() => {
          console.log(
            "最終確認：現在のプロジェクト状態",
            getCurrentProjectState().worldBuilding?.places?.length || 0,
            "件の場所データ"
          );
        }, 500);
      }
    } catch (error) {
      console.error("世界観生成エラー:", error);
      toast.error("世界観要素の生成に失敗しました");
    }
  };

  if (!currentProject) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>プロジェクトが選択されていません。</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: "1200px", mx: "auto" }}>
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              {currentProject.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              世界観構築
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SmartToyIcon />}
            onClick={() => setAIModalOpen(true)}
            sx={{ ml: 2 }}
          >
            AIに世界観を考えてもらう
          </Button>
        </Box>
      </Paper>

      {/* AI支援モーダル */}
      <AIAssistModal
        open={aiModalOpen}
        onClose={() => setAIModalOpen(false)}
        title="AIに世界観を考えてもらう"
        description="どのような世界観にしたいか、指示を入力してください。物語の雰囲気や時代背景、主要な場所などを具体的に伝えるとよいでしょう。"
        defaultMessage={`「${
          currentProject.title
        }」の世界観について、以下の要素を考えてください。
- 物語の舞台となる主要な場所（少なくとも3つ）
- この世界のルール（魔法や技術の制約など）
- 特徴的な文化や風習

物語のあらすじ:
${currentProject.synopsis || "（あらすじが設定されていません）"}`}
        requestAssist={handleAIAssist}
        supportsBatchGeneration={true}
      />

      <Paper
        sx={{
          mb: 3,
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "background.paper",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="world building tabs"
          sx={{
            ".MuiTabs-flexContainer": {
              gap: 1,
            },
            ".MuiTab-root": {
              minWidth: "120px",
              px: 2,
              whiteSpace: "nowrap",
            },
            ".MuiTabs-scrollButtons": {
              "&.Mui-disabled": { opacity: 0.3 },
            },
            mb: 1,
          }}
        >
          <Tab
            label={
              updatedTabs[0] ? (
                <Badge color="secondary" variant="dot">
                  ワールドマップ
                </Badge>
              ) : (
                "ワールドマップ"
              )
            }
            sx={{ fontWeight: tabValue === 0 ? "bold" : "normal" }}
          />
          <Tab
            label={
              updatedTabs[1] ? (
                <Badge color="secondary" variant="dot">
                  世界観設定
                </Badge>
              ) : (
                "世界観設定"
              )
            }
            sx={{ fontWeight: tabValue === 1 ? "bold" : "normal" }}
          />
          <Tab
            label={
              updatedTabs[2] ? (
                <Badge color="secondary" variant="dot">
                  ルール
                </Badge>
              ) : (
                "ルール"
              )
            }
            sx={{ fontWeight: tabValue === 2 ? "bold" : "normal" }}
          />
          <Tab
            label={
              updatedTabs[3] ? (
                <Badge color="secondary" variant="dot">
                  地名
                </Badge>
              ) : (
                "地名"
              )
            }
            sx={{ fontWeight: tabValue === 3 ? "bold" : "normal" }}
          />
          <Tab
            label={
              updatedTabs[4] ? (
                <Badge color="secondary" variant="dot">
                  社会と文化
                </Badge>
              ) : (
                "社会と文化"
              )
            }
            sx={{ fontWeight: tabValue === 4 ? "bold" : "normal" }}
          />
          <Tab
            label={
              updatedTabs[5] ? (
                <Badge color="secondary" variant="dot">
                  地理と環境
                </Badge>
              ) : (
                "地理と環境"
              )
            }
            sx={{ fontWeight: tabValue === 5 ? "bold" : "normal" }}
          />
          <Tab
            label={
              updatedTabs[6] ? (
                <Badge color="secondary" variant="dot">
                  歴史と伝説
                </Badge>
              ) : (
                "歴史と伝説"
              )
            }
            sx={{ fontWeight: tabValue === 6 ? "bold" : "normal" }}
          />
          <Tab
            label={
              updatedTabs[7] ? (
                <Badge color="secondary" variant="dot">
                  魔法と技術
                </Badge>
              ) : (
                "魔法と技術"
              )
            }
            sx={{ fontWeight: tabValue === 7 ? "bold" : "normal" }}
          />
          <Tab
            label={
              updatedTabs[8] ? (
                <Badge color="secondary" variant="dot">
                  自由記述欄
                </Badge>
              ) : (
                "自由記述欄"
              )
            }
            sx={{ fontWeight: tabValue === 8 ? "bold" : "normal" }}
          />
          <Tab
            label={
              updatedTabs[9] ? (
                <Badge color="secondary" variant="dot">
                  状態定義
                </Badge>
              ) : (
                "状態定義"
              )
            }
            sx={{ fontWeight: tabValue === 9 ? "bold" : "normal" }}
          />
        </Tabs>

        {/* ワールドマップタブ */}
        <TabPanel value={tabValue} index={0}>
          <WorldMapTab
            mapImageUrl={mapImageUrl}
            onMapImageUpload={handleMapImageUpload}
          />
        </TabPanel>

        {/* 世界観設定タブ */}
        <TabPanel value={tabValue} index={1}>
          <SettingTab
            description={description}
            onDescriptionChange={handleSettingChange}
            history={history}
            onHistoryChange={handleHistoryChange}
          />
        </TabPanel>

        {/* ルールタブ */}
        <TabPanel value={tabValue} index={2}>
          <RulesTab
            rules={rules}
            newRule={newRule}
            setNewRule={setNewRule}
            onAddRule={handleAddRule}
            onDeleteRule={handleDeleteRule}
          />
        </TabPanel>

        {/* 地名タブ */}
        <TabPanel value={tabValue} index={3}>
          <PlacesTab
            places={places as ExtendedPlace[]}
            newPlace={newPlace as ExtendedPlace}
            isEditingPlace={isEditingPlace}
            onPlaceChange={handlePlaceChange}
            onAddPlace={handleAddPlace}
            onEditPlace={handleEditPlace}
            onDeletePlace={handleDeletePlace}
          />
        </TabPanel>

        {/* 社会と文化タブ */}
        <TabPanel value={tabValue} index={4}>
          <SocietyCultureTab
            socialStructure={socialStructure}
            onSocialStructureChange={handleSocialStructureChange}
            government={government}
            onGovernmentChange={handleGovernmentChange}
            economy={economy}
            onEconomyChange={handleEconomyChange}
            religion={religion}
            onReligionChange={handleReligionChange}
            traditions={traditions}
            onTraditionsChange={handleTraditionsChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            art={art}
            onArtChange={handleArtChange}
            education={education}
            onEducationChange={handleEducationChange}
            technology={technology}
            onTechnologyChange={handleTechnologyChange}
          />
        </TabPanel>

        {/* 地理と環境タブ */}
        <TabPanel value={tabValue} index={5}>
          <GeographyEnvironmentTab
            geography={geography}
            onGeographyChange={handleGeographyChange}
            climate={climate}
            onClimateChange={handleClimateChange}
            flora={flora}
            onFloraChange={handleFloraChange}
            fauna={fauna}
            onFaunaChange={handleFaunaChange}
            resources={resources}
            onResourcesChange={handleResourcesChange}
            settlements={settlements}
            onSettlementsChange={handleSettlementsChange}
            naturalDisasters={naturalDisasters}
            onNaturalDisastersChange={handleNaturalDisastersChange}
            seasonalChanges={seasonalChanges}
            onSeasonalChangesChange={handleSeasonalChangesChange}
          />
        </TabPanel>

        {/* 歴史と伝説タブ */}
        <TabPanel value={tabValue} index={6}>
          <HistoryLegendTab
            historicalEvents={historicalEvents}
            onHistoricalEventsChange={handleHistoricalEventsChange}
            ancientCivilizations={ancientCivilizations}
            onAncientCivilizationsChange={handleAncientCivilizationsChange}
            myths={myths}
            onMythsChange={handleMythsChange}
            legends={legends}
            onLegendsChange={handleLegendsChange}
            folklore={folklore}
            onFolkloreChange={handleFolkloreChange}
            religions={religions}
            onReligionsChange={handleReligionsChange}
            historicalFigures={historicalFigures}
            onHistoricalFiguresChange={handleHistoricalFiguresChange}
            conflicts={conflicts}
            onConflictsChange={handleConflictsChange}
          />
        </TabPanel>

        {/* 魔法と技術タブ */}
        <TabPanel value={tabValue} index={7}>
          <MagicTechnologyTab
            magicSystem={magicSystem}
            onMagicSystemChange={handleMagicSystemChange}
            magicRules={magicRules}
            onMagicRulesChange={handleMagicRulesChange}
            magicUsers={magicUsers}
            onMagicUsersChange={handleMagicUsersChange}
            artifacts={artifacts}
            onArtifactsChange={handleArtifactsChange}
            technologyLevel={technologyLevel}
            onTechnologyLevelChange={handleTechnologyLevelChange}
            inventions={inventions}
            onInventionsChange={handleInventionsChange}
            energySources={energySources}
            onEnergySourcesChange={handleEnergySourcesChange}
            transportation={transportation}
            onTransportationChange={handleTransportationChange}
          />
        </TabPanel>

        {/* 自由記述欄タブ */}
        <TabPanel value={tabValue} index={8}>
          <FreeFieldsTab
            freeFields={freeFields}
            newFreeField={newFreeField}
            isEditingFreeField={isEditingFreeField}
            onFreeFieldChange={handleFreeFieldChange}
            onAddFreeField={handleAddFreeField}
            onEditFreeField={handleEditFreeField}
            onDeleteFreeField={handleDeleteFreeField}
          />
        </TabPanel>

        {/* 状態定義タブ */}
        <TabPanel value={tabValue} index={9}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              定義済みキャラクターステータス
            </Typography>
            <Button
              variant="contained"
              onClick={() =>
                handleEditDefinedCharacterStatus({
                  id: "",
                  name: "",
                  type: "custom",
                  mobility: "normal",
                  description: "",
                  effects: [],
                } as CharacterStatus)
              }
              sx={{ mb: 2 }}
            >
              新しい状態を追加
            </Button>
            <CharacterStatusList
              statuses={definedCharacterStatuses || []}
              onEdit={handleEditDefinedCharacterStatus}
              onDelete={handleDeleteDefinedCharacterStatus}
            />
            {isEditingDefinedCharacterStatus && (
              <CharacterStatusEditorDialog
                open={isEditingDefinedCharacterStatus}
                onClose={handleCancelEditDefinedCharacterStatus}
                onSave={handleSaveDefinedCharacterStatus}
                editingStatus={currentDefinedCharacterStatus}
              />
            )}
          </Box>
        </TabPanel>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSaveWorldBuilding}
          disabled={!hasUnsavedChanges}
        >
          保存
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default WorldBuildingPage;
