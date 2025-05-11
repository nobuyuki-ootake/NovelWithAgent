import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentProjectState } from "../store/atoms";
import {
  WorldBuilding,
  Place,
  Culture,
  WorldBuildingFreeField,
  NovelProject,
  CharacterStatus,
} from "../types/index";
import { v4 as uuidv4 } from "uuid";

export function useWorldBuilding() {
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [worldBuilding, setWorldBuilding] = useState<WorldBuilding | null>(
    null
  );
  const [tabValue, setTabValue] = useState(0);
  const [mapImageUrl, setMapImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [history, setHistory] = useState<string>("");
  const [rules, setRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState<string>("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [freeFields, setFreeFields] = useState<WorldBuildingFreeField[]>([]);
  const [newFreeField, setNewFreeField] = useState<WorldBuildingFreeField>({
    id: "",
    title: "",
    content: "",
  });
  const [isEditingFreeField, setIsEditingFreeField] = useState<boolean>(false);
  const [currentFreeFieldId, setCurrentFreeFieldId] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newPlace, setNewPlace] = useState<Place>({
    id: "",
    name: "",
    description: "",
    significance: "",
  });
  const [isEditingPlace, setIsEditingPlace] = useState<boolean>(false);
  const [currentPlaceId, setCurrentPlaceId] = useState<string>("");

  // 社会と文化のタブの状態
  const [socialStructure, setSocialStructure] = useState<string>("");
  const [government, setGovernment] = useState<string>("");
  const [economy, setEconomy] = useState<string>("");
  const [religion, setReligion] = useState<string>("");
  const [traditions, setTraditions] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [art, setArt] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [technology, setTechnology] = useState<string>("");

  // 地理と環境のタブの状態
  const [geography, setGeography] = useState<string>("");
  const [climate, setClimate] = useState<string>("");
  const [flora, setFlora] = useState<string>("");
  const [fauna, setFauna] = useState<string>("");
  const [resources, setResources] = useState<string>("");
  const [settlements, setSettlements] = useState<string>("");
  const [naturalDisasters, setNaturalDisasters] = useState<string>("");
  const [seasonalChanges, setSeasonalChanges] = useState<string>("");

  // 歴史と伝説のタブの状態
  const [historicalEvents, setHistoricalEvents] = useState<string>("");
  const [ancientCivilizations, setAncientCivilizations] = useState<string>("");
  const [myths, setMyths] = useState<string>("");
  const [legends, setLegends] = useState<string>("");
  const [folklore, setFolklore] = useState<string>("");
  const [religions, setReligions] = useState<string>("");
  const [historicalFigures, setHistoricalFigures] = useState<string>("");
  const [conflicts, setConflicts] = useState<string>("");

  // 魔法と技術のタブの状態
  const [magicSystem, setMagicSystem] = useState<string>("");
  const [magicRules, setMagicRules] = useState<string>("");
  const [magicUsers, setMagicUsers] = useState<string>("");
  const [artifacts, setArtifacts] = useState<string>("");
  const [technologyLevel, setTechnologyLevel] = useState<string>("");
  const [inventions, setInventions] = useState<string>("");
  const [energySources, setEnergySources] = useState<string>("");
  const [transportation, setTransportation] = useState<string>("");

  // キャラクター状態定義
  const [definedCharacterStatuses, setDefinedCharacterStatuses] = useState<
    CharacterStatus[]
  >([]);
  const [isEditingDefinedCharacterStatus, setIsEditingDefinedCharacterStatus] =
    useState(false);
  const [currentDefinedCharacterStatus, setCurrentDefinedCharacterStatus] =
    useState<CharacterStatus | null>(null);

  // 世界観情報を取得
  useEffect(() => {
    if (currentProject?.worldBuilding) {
      setWorldBuilding(currentProject.worldBuilding);
      setMapImageUrl(currentProject.worldBuilding.mapImageUrl || "");
      setDescription(currentProject.worldBuilding.setting || "");
      setHistory(currentProject.worldBuilding.history || "");
      setRules(currentProject.worldBuilding.rules || []);
      setPlaces(currentProject.worldBuilding.places || []);
      setCultures(currentProject.worldBuilding.cultures || []);
      setFreeFields(currentProject.worldBuilding.freeFields || []);

      // 社会と文化のタブデータをセット
      setSocialStructure(currentProject.worldBuilding.socialStructure || "");
      setGovernment(currentProject.worldBuilding.government || "");
      setEconomy(currentProject.worldBuilding.economy || "");
      setReligion(currentProject.worldBuilding.religion || "");
      setTraditions(currentProject.worldBuilding.traditions || "");
      setLanguage(currentProject.worldBuilding.language || "");
      setArt(currentProject.worldBuilding.art || "");
      setEducation(currentProject.worldBuilding.education || "");
      setTechnology(currentProject.worldBuilding.technology || "");

      // 地理と環境のタブデータをセット
      setGeography(currentProject.worldBuilding.geography || "");
      setClimate(currentProject.worldBuilding.climate || "");
      setFlora(currentProject.worldBuilding.flora || "");
      setFauna(currentProject.worldBuilding.fauna || "");
      setResources(currentProject.worldBuilding.resources || "");
      setSettlements(currentProject.worldBuilding.settlements || "");
      setNaturalDisasters(currentProject.worldBuilding.naturalDisasters || "");
      setSeasonalChanges(currentProject.worldBuilding.seasonalChanges || "");

      // 歴史と伝説のタブデータをセット
      setHistoricalEvents(currentProject.worldBuilding.historicalEvents || "");
      setAncientCivilizations(
        currentProject.worldBuilding.ancientCivilizations || ""
      );
      setMyths(currentProject.worldBuilding.myths || "");
      setLegends(currentProject.worldBuilding.legends || "");
      setFolklore(currentProject.worldBuilding.folklore || "");
      setReligions(currentProject.worldBuilding.religions || "");
      setHistoricalFigures(
        currentProject.worldBuilding.historicalFigures || ""
      );
      setConflicts(currentProject.worldBuilding.conflicts || "");

      // 魔法と技術のタブデータをセット
      setMagicSystem(currentProject.worldBuilding.magicSystem || "");
      setMagicRules(currentProject.worldBuilding.magicRules || "");
      setMagicUsers(currentProject.worldBuilding.magicUsers || "");
      setArtifacts(currentProject.worldBuilding.artifacts || "");
      setTechnologyLevel(currentProject.worldBuilding.technologyLevel || "");
      setInventions(currentProject.worldBuilding.inventions || "");
      setEnergySources(currentProject.worldBuilding.energySources || "");
      setTransportation(currentProject.worldBuilding.transportation || "");

      // キャラクター状態定義をセット
      setDefinedCharacterStatuses(
        currentProject.definedCharacterStatuses || []
      );
    }
  }, [currentProject]);

  // タブの切り替え
  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      if (hasUnsavedChanges) {
        if (
          window.confirm(
            "保存されていない変更があります。タブを切り替えると失われます。続けますか？"
          )
        ) {
          setTabValue(newValue);
        }
      } else {
        setTabValue(newValue);
      }
    },
    [hasUnsavedChanges]
  );

  // マップ画像をアップロード
  const handleMapImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // ファイルサイズチェック（5MB以下）
      if (file.size > 5 * 1024 * 1024) {
        setSnackbarMessage("画像サイズは5MB以下にしてください");
        setSnackbarOpen(true);
        return;
      }

      // 画像のプレビューURLを作成
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setMapImageUrl(result);
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  // 設定の変更
  const handleSettingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDescription(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  // 歴史の変更
  const handleHistoryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setHistory(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  // ルールの追加
  const handleAddRule = useCallback(() => {
    if (!newRule.trim()) return;
    setRules((prevRules) => [...prevRules, newRule.trim()]);
    setNewRule("");
    setHasUnsavedChanges(true);
  }, [newRule]);

  // ルールの削除
  const handleDeleteRule = useCallback((index: number) => {
    setRules((prevRules) => {
      const updatedRules = [...prevRules];
      updatedRules.splice(index, 1);
      return updatedRules;
    });
    setHasUnsavedChanges(true);
  }, []);

  // 自由入力フィールドの変更
  const handleFreeFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewFreeField((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // 自由入力フィールドの追加
  const handleAddFreeField = useCallback(() => {
    if (!newFreeField.title.trim()) return;

    let updatedFreeFields: WorldBuildingFreeField[] = [];

    if (isEditingFreeField) {
      // 既存のフィールドを更新
      updatedFreeFields = freeFields.map((field) =>
        field.id === currentFreeFieldId ? { ...newFreeField } : field
      );
    } else {
      // 新しいフィールドを追加
      const newField = {
        ...newFreeField,
        id: uuidv4(),
      };
      updatedFreeFields = [...freeFields, newField];
    }

    // 状態を更新
    setFreeFields(updatedFreeFields);

    // worldBuilding状態も更新
    if (worldBuilding) {
      const updatedWorldBuilding = {
        ...worldBuilding,
        freeFields: updatedFreeFields,
      };
      setWorldBuilding(updatedWorldBuilding);

      // currentProjectも更新
      if (currentProject) {
        const updatedProject = {
          ...currentProject,
          worldBuilding: updatedWorldBuilding,
          updatedAt: new Date(),
        };
        setCurrentProject(updatedProject);

        // ローカルストレージも更新
        const projectsStr = localStorage.getItem("novelProjects");
        if (projectsStr) {
          try {
            const projects: NovelProject[] = JSON.parse(projectsStr);
            const updatedProjects = projects.map((p) =>
              p.id === currentProject.id ? updatedProject : p
            );
            localStorage.setItem(
              "novelProjects",
              JSON.stringify(updatedProjects)
            );
            console.log(
              "自由記述欄の追加/編集がローカルストレージに保存されました"
            );
          } catch (error) {
            console.error("自由記述欄保存中にエラーが発生しました:", error);
          }
        }
      }
    }

    setNewFreeField({
      id: "",
      title: "",
      content: "",
    });
    setIsEditingFreeField(false);
    setCurrentFreeFieldId("");
    setHasUnsavedChanges(true);
  }, [
    newFreeField,
    isEditingFreeField,
    currentFreeFieldId,
    freeFields,
    worldBuilding,
    currentProject,
  ]);

  // 自由入力フィールドの編集
  const handleEditFreeField = useCallback((field: WorldBuildingFreeField) => {
    setNewFreeField({ ...field });
    setIsEditingFreeField(true);
    setCurrentFreeFieldId(field.id);
  }, []);

  // 自由入力フィールドの削除
  const handleDeleteFreeField = useCallback((id: string) => {
    if (window.confirm("このフィールドを削除してもよろしいですか？")) {
      setFreeFields((prevFields) =>
        prevFields.filter((field) => field.id !== id)
      );
      setHasUnsavedChanges(true);
    }
  }, []);

  // 地名の変更ハンドラ
  const handlePlaceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewPlace((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // 地名の追加
  const handleAddPlace = useCallback(() => {
    if (!newPlace.name.trim()) return;

    let updatedPlaces: Place[] = [];

    if (isEditingPlace) {
      // 既存の地名を更新
      updatedPlaces = places.map((place) =>
        place.id === currentPlaceId ? { ...newPlace } : place
      );
    } else {
      // 新しい地名を追加
      const newPlaceItem = {
        ...newPlace,
        id: uuidv4(),
      };
      updatedPlaces = [...places, newPlaceItem];
    }

    // 状態を更新
    setPlaces(updatedPlaces);

    // worldBuilding状態も更新
    if (worldBuilding) {
      const updatedWorldBuilding = {
        ...worldBuilding,
        places: updatedPlaces,
      };
      setWorldBuilding(updatedWorldBuilding);

      // currentProjectも更新
      if (currentProject) {
        const updatedProject = {
          ...currentProject,
          worldBuilding: updatedWorldBuilding,
          updatedAt: new Date(),
        };
        setCurrentProject(updatedProject);

        // ローカルストレージへの即時保存
        const projectsStr = localStorage.getItem("novelProjects");
        if (projectsStr) {
          try {
            const projects: NovelProject[] = JSON.parse(projectsStr);
            const updatedProjects = projects.map((p) =>
              p.id === currentProject.id ? updatedProject : p
            );
            localStorage.setItem(
              "novelProjects",
              JSON.stringify(updatedProjects)
            );
            console.log("地名の追加/編集がローカルストレージに保存されました");
          } catch (error) {
            console.error("地名保存中にエラーが発生しました:", error);
          }
        }
      }
    }

    setNewPlace({
      id: "",
      name: "",
      description: "",
      significance: "",
    });
    setIsEditingPlace(false);
    setCurrentPlaceId("");
    setHasUnsavedChanges(true);
  }, [
    newPlace,
    isEditingPlace,
    currentPlaceId,
    places,
    worldBuilding,
    currentProject,
  ]);

  // 地名の編集
  const handleEditPlace = useCallback((place: Place) => {
    setNewPlace({ ...place });
    setIsEditingPlace(true);
    setCurrentPlaceId(place.id);
  }, []);

  // 地名の削除
  const handleDeletePlace = useCallback(
    (id: string) => {
      if (window.confirm("この地名を削除してもよろしいですか？")) {
        const updatedPlaces = places.filter((place) => place.id !== id);
        setPlaces(updatedPlaces);

        // worldBuilding状態も更新
        if (worldBuilding) {
          const updatedWorldBuilding = {
            ...worldBuilding,
            places: updatedPlaces,
          };
          setWorldBuilding(updatedWorldBuilding);
        }

        setHasUnsavedChanges(true);
      }
    },
    [places, worldBuilding]
  );

  // 社会と文化のフィールド変更ハンドラ
  const handleSocialStructureChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSocialStructure(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleGovernmentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setGovernment(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleEconomyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEconomy(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleReligionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setReligion(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleTraditionsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTraditions(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLanguage(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleArtChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setArt(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleEducationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEducation(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleTechnologyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTechnology(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  // 地理と環境のフィールド変更ハンドラ
  const handleGeographyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setGeography(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleClimateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setClimate(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleFloraChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFlora(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleFaunaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFauna(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleResourcesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setResources(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleSettlementsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSettlements(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleNaturalDisastersChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNaturalDisasters(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleSeasonalChangesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSeasonalChanges(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  // 歴史と伝説のフィールド変更ハンドラ
  const handleHistoricalEventsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setHistoricalEvents(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleAncientCivilizationsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAncientCivilizations(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleMythsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setMyths(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleLegendsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLegends(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleFolkloreChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFolklore(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleReligionsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setReligions(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleHistoricalFiguresChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setHistoricalFigures(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleConflictsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setConflicts(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  // 魔法と技術のフィールド変更ハンドラ
  const handleMagicSystemChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setMagicSystem(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleMagicRulesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setMagicRules(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleMagicUsersChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setMagicUsers(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleArtifactsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setArtifacts(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleTechnologyLevelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTechnologyLevel(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleInventionsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInventions(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleEnergySourcesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEnergySources(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  const handleTransportationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTransportation(e.target.value);
      setHasUnsavedChanges(true);
    },
    []
  );

  // 変更を保存
  const handleSaveWorldBuilding = useCallback(async () => {
    if (!currentProject) return;

    const updatedWorldBuildingData: WorldBuilding = {
      id: currentProject.worldBuilding?.id || uuidv4(),
      mapImageUrl,
      setting: description,
      history,
      rules,
      places,
      cultures,
      freeFields,
      // 社会と文化のタブデータ
      socialStructure,
      government,
      economy,
      religion,
      traditions,
      language,
      art,
      education,
      technology,
      // 地理と環境のタブデータ
      geography,
      climate,
      flora,
      fauna,
      resources,
      settlements,
      naturalDisasters,
      seasonalChanges,
      // 歴史と伝説のタブデータ
      historicalEvents,
      ancientCivilizations,
      myths,
      legends,
      folklore,
      religions,
      historicalFigures,
      conflicts,
      // 魔法と技術のタブデータ
      magicSystem,
      magicRules,
      magicUsers,
      artifacts,
      technologyLevel,
      inventions,
      energySources,
      transportation,
    };

    const updatedProject: NovelProject = {
      ...currentProject,
      worldBuilding: updatedWorldBuildingData,
      definedCharacterStatuses: definedCharacterStatuses,
    };

    setCurrentProject(updatedProject);

    // ローカルストレージに保存（プロジェクトの永続化）
    const projectsStr = localStorage.getItem("novelProjects");
    if (projectsStr) {
      const projects: NovelProject[] = JSON.parse(projectsStr);
      const updatedProjects = projects.map((p) =>
        p.id === currentProject.id ? updatedProject : p
      );
      localStorage.setItem("novelProjects", JSON.stringify(updatedProjects));
      console.log("プロジェクトをローカルストレージに保存しました");
    }

    setHasUnsavedChanges(false);
    setSnackbarMessage("世界観設定を保存しました");
    setSnackbarOpen(true);
  }, [
    currentProject,
    mapImageUrl,
    description,
    history,
    rules,
    places,
    cultures,
    freeFields,
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
    definedCharacterStatuses,
    setCurrentProject,
  ]);

  // スナックバーを閉じる
  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // 定義済みキャラクターステータスの保存
  const handleSaveDefinedCharacterStatus = useCallback(
    (status: CharacterStatus) => {
      const newStatus = { ...status, id: status.id || uuidv4() };
      setDefinedCharacterStatuses((prev) => {
        const existingIndex = prev.findIndex((s) => s.id === newStatus.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = newStatus;
          return updated;
        }
        return [...prev, newStatus];
      });
      setHasUnsavedChanges(true);
      setCurrentDefinedCharacterStatus(null);
      setIsEditingDefinedCharacterStatus(false);
      setSnackbarMessage("状態を保存しました。");
      setSnackbarOpen(true);
    },
    []
  );

  // 定義済みキャラクターステータスの削除
  const handleDeleteDefinedCharacterStatus = useCallback((statusId: string) => {
    setDefinedCharacterStatuses((prev) =>
      prev.filter((s) => s.id !== statusId)
    );
    setHasUnsavedChanges(true);
    setSnackbarMessage("状態を削除しました。");
    setSnackbarOpen(true);
  }, []);

  // 定義済みキャラクターステータス編集開始
  const handleEditDefinedCharacterStatus = useCallback(
    (status: CharacterStatus) => {
      setCurrentDefinedCharacterStatus(status);
      setIsEditingDefinedCharacterStatus(true);
    },
    []
  );

  // 定義済みキャラクターステータス編集キャンセル
  const handleCancelEditDefinedCharacterStatus = useCallback(() => {
    setCurrentDefinedCharacterStatus(null);
    setIsEditingDefinedCharacterStatus(false);
  }, []);

  return {
    currentProject,
    worldBuilding,
    tabValue,
    mapImageUrl,
    description,
    history,
    rules,
    newRule,
    places,
    cultures,
    freeFields,
    newFreeField,
    isEditingFreeField,
    snackbarOpen,
    snackbarMessage,
    hasUnsavedChanges,
    newPlace,
    isEditingPlace,
    // 社会と文化のタブの状態
    socialStructure,
    government,
    economy,
    religion,
    traditions,
    language,
    art,
    education,
    technology,
    // 地理と環境のタブの状態
    geography,
    climate,
    flora,
    fauna,
    resources,
    settlements,
    naturalDisasters,
    seasonalChanges,
    // 歴史と伝説のタブの状態
    historicalEvents,
    ancientCivilizations,
    myths,
    legends,
    folklore,
    religions,
    historicalFigures,
    conflicts,
    // 魔法と技術のタブの状態
    magicSystem,
    magicRules,
    magicUsers,
    artifacts,
    technologyLevel,
    inventions,
    energySources,
    transportation,
    // 既存のハンドラ関数
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
    // 社会と文化のタブのハンドラ
    handleSocialStructureChange,
    handleGovernmentChange,
    handleEconomyChange,
    handleReligionChange,
    handleTraditionsChange,
    handleLanguageChange,
    handleArtChange,
    handleEducationChange,
    handleTechnologyChange,
    // 地理と環境のタブのハンドラ
    handleGeographyChange,
    handleClimateChange,
    handleFloraChange,
    handleFaunaChange,
    handleResourcesChange,
    handleSettlementsChange,
    handleNaturalDisastersChange,
    handleSeasonalChangesChange,
    // 歴史と伝説のタブのハンドラ
    handleHistoricalEventsChange,
    handleAncientCivilizationsChange,
    handleMythsChange,
    handleLegendsChange,
    handleFolkloreChange,
    handleReligionsChange,
    handleHistoricalFiguresChange,
    handleConflictsChange,
    // 魔法と技術のタブのハンドラ
    handleMagicSystemChange,
    handleMagicRulesChange,
    handleMagicUsersChange,
    handleArtifactsChange,
    handleTechnologyLevelChange,
    handleInventionsChange,
    handleEnergySourcesChange,
    handleTransportationChange,
    // キャラクター状態定義関連
    definedCharacterStatuses,
    handleSaveDefinedCharacterStatus,
    handleDeleteDefinedCharacterStatus,
    isEditingDefinedCharacterStatus,
    currentDefinedCharacterStatus,
    handleEditDefinedCharacterStatus,
    handleCancelEditDefinedCharacterStatus,
  };
}
