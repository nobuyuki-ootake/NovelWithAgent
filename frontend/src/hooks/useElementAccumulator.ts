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

// 型定義
// Place型は中央のtypes/index.tsからインポート

// Culture型は中央のtypes/index.tsからインポート

// Rule型は中央のtypes/index.tsからインポート

// WorldBuildingFreeField型は中央のtypes/index.tsからインポート

/**
 * 世界観要素を累積的に保存するためのフック
 * AIが生成した要素を一時保存し、一括で保存する機能を提供
 */
export const useElementAccumulator = () => {
  const [currentProject_, setCurrentProject_] =
    useRecoilState(currentProjectState);

  // ローカル状態からRecoilのグローバル状態に変更
  const [updatedTabs, setUpdatedTabs] = useRecoilState(
    worldBuildingUpdatedTabsState
  );
  const [forceUpdateCounter, setForceUpdateCounter] = useRecoilState(
    worldBuildingForceUpdateCounterState
  );

  // 生成した要素を一時的に保持する配列
  const [pendingRules, setPendingRules] = useState<RuleElement[]>([]);
  const [pendingCultures, setPendingCultures] = useState<CultureElement[]>([]);
  const [pendingFreeFields, setPendingFreeFields] = useState<
    WorldBuildingFreeField[]
  >([]);
  const [pendingWorldmaps, setPendingWorldmaps] = useState<WorldmapElement[]>(
    []
  );
  const [pendingSettings, setPendingSettings] = useState<SettingElement[]>([]);
  const [pendingPlaces, setPendingPlaces] = useState<PlaceElement[]>([]);
  const [pendingHistories, setPendingHistories] = useState<
    HistoryLegendElement[]
  >([]);
  const [pendingTechnologies, setPendingTechnologies] = useState<
    MagicTechnologyElement[]
  >([]);
  const [pendingGeographies, setPendingGeographies] = useState<
    GeographyEnvironmentElement[]
  >([]);

  // プロジェクト状態変更の監視
  useEffect(() => {
    if (currentProject_ && currentProject_.worldBuilding) {
      console.log("[DEBUG] プロジェクト状態が変更されました", {
        worldBuilding: {
          places: currentProject_.worldBuilding?.places?.length || 0,
          rules: currentProject_.worldBuilding?.rules?.length || 0,
          cultures: currentProject_.worldBuilding?.cultures?.length || 0,
          freeFields: currentProject_.worldBuilding?.freeFields?.length || 0,
        },
      });

      // 地名データがある場合は地名タブを自動的に更新済みとしてマーク
      if (currentProject_.worldBuilding?.places?.length > 0) {
        console.log(
          "[DEBUG] 地名データがあるため、地名タブを更新済みとしてマーク"
        );
        // 遅延実行して初期化後に実行されるようにする
        setTimeout(() => {
          forceMarkTabAsUpdated(3);
        }, 100);
      }
    }
  }, [currentProject_]); // forceMarkTabAsUpdated は依存配列から削除

  // タブが更新されたことを記録
  const markTabAsUpdated = useCallback(
    (tabIndex: number) => {
      console.log(`[DEBUG] タブ${tabIndex}を更新済みとしてマーク - 開始`);

      // 新しいオブジェクト参照を作成して確実に状態変更を検知させる
      const newUpdatedTabs = { ...updatedTabs, [tabIndex]: true };

      // 更新前の状態を記録
      console.log("[DEBUG] 更新前のタブ状態:", updatedTabs);

      // 状態を更新
      setUpdatedTabs(newUpdatedTabs);

      console.log("[DEBUG] 更新後のタブ状態（即時）:", newUpdatedTabs);

      // 強制更新カウンターをインクリメント - 常に新しい値にする
      const newCounter = forceUpdateCounter + 1;
      setForceUpdateCounter(newCounter);
      console.log("[DEBUG] 強制更新カウンター更新:", newCounter);

      // すぐにRecoilの状態が更新したか確認
      console.log("[DEBUG] markTabAsUpdated直後のupdatedTabs:", {
        ...updatedTabs,
      });
      console.log(
        "[DEBUG] markTabAsUpdated直後のforceUpdateCounter:",
        forceUpdateCounter
      );

      // 確実に反映されるようにタイマーを設定
      setTimeout(() => {
        console.log(`[DEBUG] タブ${tabIndex}を更新済みとしてマーク - 完了確認`);
        console.log("[DEBUG] タブ状態（遅延確認）:", { ...newUpdatedTabs });
      }, 0);
    },
    [updatedTabs, forceUpdateCounter]
  );

  // 特定のタブを更新済みとして設定（外部から直接呼び出し可能）
  const forceMarkTabAsUpdated = useCallback(
    (tabIndex: number) => {
      console.log(
        `[DEBUG] 強制的にタブ${tabIndex}を更新済みとしてマーク - 開始`
      );

      // 新しいオブジェクト参照を作成して確実に状態変更を検知させる
      const newUpdatedTabs = { ...updatedTabs, [tabIndex]: true };

      // 更新前の状態を記録
      console.log("[DEBUG] 強制更新前のタブ状態:", updatedTabs);

      // 状態を更新 - 直接新しいオブジェクト参照で更新
      setUpdatedTabs(newUpdatedTabs);

      console.log("[DEBUG] 強制更新後のタブ状態（即時）:", newUpdatedTabs);

      // 強制更新カウンターをインクリメント - 常に新しい値にする
      const newCounter = forceUpdateCounter + 1;
      setForceUpdateCounter(newCounter);
      console.log("[DEBUG] 強制更新カウンター更新:", newCounter);

      // すぐにRecoilの状態が更新したか確認
      console.log("[DEBUG] forceMarkTabAsUpdated直後のupdatedTabs:", {
        ...newUpdatedTabs,
      });
      console.log(
        "[DEBUG] forceMarkTabAsUpdated直後のforceUpdateCounter:",
        newCounter
      );

      // 確実に反映されるようにタイマーを設定
      setTimeout(() => {
        console.log(
          `[DEBUG] 強制的にタブ${tabIndex}を更新済みとしてマーク - 完了確認`
        );
        console.log("[DEBUG] タブ状態（遅延確認）:", { ...newUpdatedTabs });
        console.log("[DEBUG] 強制更新カウンター（遅延確認）:", newCounter);
      }, 0);
    },
    [updatedTabs, forceUpdateCounter, setUpdatedTabs, setForceUpdateCounter]
  );

  // 現在のプロジェクト状態を取得する関数（常に最新の状態を取得するため）
  const getCurrentProjectState = useCallback(() => {
    // ディープコピーして返す
    return JSON.parse(JSON.stringify(currentProject_));
  }, [currentProject_]);

  // プロジェクト更新関数（累積的な更新を行うための関数）
  const updateProjectState = useCallback(
    (updater: (project: typeof currentProject_) => typeof currentProject_) => {
      // 現在の最新状態を取得
      const latestProject = getCurrentProjectState();

      // 更新関数を適用
      const updatedProject = updater(latestProject);

      // 状態を更新
      setCurrentProject_(updatedProject);

      console.log("[DEBUG] プロジェクト状態を更新しました");

      return updatedProject;
    },
    [getCurrentProjectState, setCurrentProject_]
  );

  // 場所を一時保存に追加
  const addPendingPlace = useCallback(
    (place: PlaceElement) => {
      console.log(`[DEBUG] 保留中の場所を追加: ${place.name}`);
      setPendingPlaces((prevPlaces) => [...prevPlaces, place]);
      markTabAsUpdated(3); // 地名タブを更新済みとしてマーク

      // デバッグ: 保留中の場所を確認
      setTimeout(() => {
        console.log(
          "[DEBUG] 保留中の場所一覧:",
          pendingPlaces.map((p) => p.name)
        );
      }, 10);
    },
    [markTabAsUpdated, pendingPlaces]
  );

  // ルールを一時保存に追加
  const addPendingRule = useCallback(
    (rule: RuleElement) => {
      console.log(`[DEBUG] 保留中のルールを追加: ${rule.name}`);
      setPendingRules((prevRules) => [...prevRules, rule]);
      markTabAsUpdated(2); // ルールタブを更新済みとしてマーク
    },
    [markTabAsUpdated]
  );

  // 文化を一時保存に追加
  const addPendingCulture = useCallback(
    (culture: CultureElement) => {
      console.log(`[DEBUG] 保留中の文化を追加: ${culture.name}`);
      setPendingCultures((prevCultures) => [...prevCultures, culture]);
      markTabAsUpdated(4); // 社会と文化タブを更新済みとしてマーク
    },
    [markTabAsUpdated]
  );

  // 自由記述欄を一時保存に追加
  const addPendingFreeField = useCallback(
    (freeField: WorldBuildingFreeField) => {
      console.log(`[DEBUG] 保留中の自由記述欄を追加: ${freeField.title}`);
      setPendingFreeFields((prevFields) => [...prevFields, freeField]);
      markTabAsUpdated(8); // 自由記述欄タブを更新済みとしてマーク
    },
    [markTabAsUpdated]
  );

  const addPendingWorldmap = useCallback(
    (worldmap: WorldmapElement) => {
      console.log(`[DEBUG] 保留中の世界地図を追加: ${worldmap.name}`);
      setPendingWorldmaps((prevWorldmaps) => [...prevWorldmaps, worldmap]);
      markTabAsUpdated(1); // 世界地図タブを更新済みとしてマーク
    },
    [markTabAsUpdated]
  );

  const addPendingSetting = useCallback(
    (setting: SettingElement) => {
      console.log(`[DEBUG] 保留中の設定を追加: ${setting.name}`);
      setPendingSettings((prevSettings) => [...prevSettings, setting]);
      markTabAsUpdated(2); // 設定タブを更新済みとしてマーク
    },
    [markTabAsUpdated]
  );

  const addPendingHistory = useCallback(
    (history: HistoryLegendElement) => {
      console.log(`[DEBUG] 保留中の歴史を追加: ${history.name}`);
      setPendingHistories((prevHistories) => [...prevHistories, history]);
      markTabAsUpdated(4); // 歴史タブを更新済みとしてマーク
    },
    [markTabAsUpdated]
  );

  const addPendingSocietyCulture = useCallback(
    (societyCulture: CultureElement) => {
      console.log(`[DEBUG] 保留中の社会と文化を追加: ${societyCulture.name}`);
      setPendingSocietyCultures((prevSocietyCultures) => [
        ...prevSocietyCultures,
        societyCulture,
      ]);
      markTabAsUpdated(6); // 社会と文化タブを更新済みとしてマーク
    },
    [markTabAsUpdated]
  );

  const addPendingTechnology = useCallback(
    (technology: MagicTechnologyElement) => {
      console.log(`[DEBUG] 保留中の技術を追加: ${technology.name}`);
      setPendingTechnologies((prevTechnologies) => [
        ...prevTechnologies,
        technology,
      ]);
      markTabAsUpdated(7); // 技術タブを更新済みとしてマーク
    },
    [markTabAsUpdated]
  );

  const addPendingGeography = useCallback(
    (geography: GeographyEnvironmentElement) => {
      console.log(`[DEBUG] 保留中の地理を追加: ${geography.name}`);
      setPendingGeographies((prevGeographies) => [
        ...prevGeographies,
        geography,
      ]);
      markTabAsUpdated(8); // 地理タブを更新済みとしてマーク
    },
    [markTabAsUpdated]
  );

  // 全ての保留中要素を保存し、更新されたプロジェクトを返す
  const saveAllPendingElements = useCallback((): NovelProject => {
    if (!currentProject_) {
      console.error("プロジェクトが未設定のため保存できません");
      return {} as NovelProject;
    }

    console.log("[DEBUG] 全保留中要素の保存処理開始");

    // プロジェクト状態をディープコピーして更新用オブジェクトを作成
    const projectToUpdate = JSON.parse(
      JSON.stringify(currentProject_)
    ) as NovelProject;

    // WorldBuilding が未設定の場合は初期化
    if (!projectToUpdate.worldBuilding) {
      projectToUpdate.worldBuilding = {
        id: uuidv4(),
        setting: "",
        history: "",
        rules: [],
        places: [],
        cultures: [],
        freeFields: [],
        worldmaps: [],
        settings: [],
        histories: [],
        societiesAndCultures: [],
        magicTechnologies: [],
        geographies: [],
      };
    }

    // 場所の保存 - 安全な初期化とマージ
    if (pendingPlaces.length > 0) {
      console.log(`[DEBUG] 保留中の場所: ${pendingPlaces.length}件`);
      console.log(
        "[DEBUG] 保留中の場所データ(詳細):",
        JSON.stringify(pendingPlaces),
        "マップ結果:",
        pendingPlaces.map((p) => p.name)
      );

      // 配列の安全な初期化
      if (!projectToUpdate.worldBuilding.places) {
        projectToUpdate.worldBuilding.places = [];
      }

      // 既存の場所配列を確保
      const existingPlaces = Array.isArray(projectToUpdate.worldBuilding.places)
        ? projectToUpdate.worldBuilding.places
        : [];

      console.log(`[DEBUG] 既存の場所: ${existingPlaces.length}件`);
      console.log(
        "[DEBUG] 既存の場所詳細:",
        JSON.stringify(existingPlaces),
        "マップ結果:",
        existingPlaces.map((p) => p.name)
      );

      // 重複確認用のSetを名前で作成
      const placeNames = new Set(existingPlaces.map((p) => p.name));

      // フィルタリング: 名前のみで重複チェック（IDは無視）
      const newPlaces = pendingPlaces.filter((p) => !placeNames.has(p.name));

      if (newPlaces.length > 0) {
        // 新しい場所を既存の配列と確実にマージ
        projectToUpdate.worldBuilding.places = [
          ...existingPlaces,
          ...newPlaces,
        ];

        console.log("[DEBUG] マージ後の場所データ:", {
          count: projectToUpdate.worldBuilding.places.length,
          names: projectToUpdate.worldBuilding.places.map((p) => p.name),
          lastAdded: newPlaces.map((p) => p.name),
        });
      } else {
        console.log(
          "[DEBUG] 新規に追加する場所はありませんでした（フィルタ後）"
        );
      }

      // 重要: 保存後に保留データをコピーして保存結果を検証するたキープ
      const savedPendingPlaces = [...newPlaces];

      // 保留中の場所データを空にする（重複防止のため）
      setPendingPlaces([]);

      // 100ms後に保存結果を検証し、失敗していれば再保存を試みる
      setTimeout(() => {
        const currentProject = getCurrentProjectState();
        const currentPlaces = currentProject?.worldBuilding?.places || [];

        // 保存されたデータを検証（名前で比較）
        const allSaved = savedPendingPlaces.every((pendingPlace) =>
          currentPlaces.some(
            (savedPlace: { name: string }) =>
              savedPlace.name === pendingPlace.name
          )
        );

        if (!allSaved && savedPendingPlaces.length > 0) {
          console.log(
            "[DEBUG] 一部の場所データが保存されていません。再保存を試みます..."
          );
          // 失敗した場所データを再度保留中に追加
          const missingPlaces = savedPendingPlaces.filter(
            (pendingPlace) =>
              !currentPlaces.some(
                (savedPlace: { name: string }) =>
                  savedPlace.name === pendingPlace.name
              )
          );

          if (missingPlaces.length > 0) {
            setPendingPlaces(missingPlaces);

            // 少し遅延して再保存を試みる
            setTimeout(() => {
              console.log(
                "[DEBUG] 失敗した場所データを再保存します:",
                missingPlaces.map((p) => p.name)
              );
              saveAllPendingElements();
              forceMarkTabAsUpdated(3); // 地名タブを強制的に更新
            }, 200);
          }
        }
      }, 200);
    }

    // ルールの保存 - 安全な初期化とマージ
    if (pendingRules.length > 0) {
      console.log(`保留中のルール: ${pendingRules.length}件`);

      // 配列の安全な初期化
      if (!projectToUpdate.worldBuilding.rules) {
        projectToUpdate.worldBuilding.rules = [];
      }

      // 既存のルール配列を確保
      const existingRules = Array.isArray(projectToUpdate.worldBuilding.rules)
        ? projectToUpdate.worldBuilding.rules
        : [];

      // 重複確認
      const ruleIds = new Set(existingRules.map((r: RuleElement) => r.id));
      const newRules = pendingRules.filter((r) => !ruleIds.has(r.id));

      if (newRules.length > 0) {
        console.log(`新規追加するルール: ${newRules.length}件`);
        const updatedRules = [...existingRules, ...newRules];
        projectToUpdate.worldBuilding.rules = updatedRules;
        console.log(
          "[DEBUG] 更新後のルール配列:",
          projectToUpdate.worldBuilding.rules.length
        );
      }

      console.log(
        "ルールの累積保存完了:",
        projectToUpdate.worldBuilding.rules.length
      );
    }

    // 文化の保存 - 安全な初期化とマージ
    if (pendingCultures.length > 0) {
      console.log(`保留中の文化: ${pendingCultures.length}件`);

      // 配列の安全な初期化
      if (!projectToUpdate.worldBuilding.cultures) {
        projectToUpdate.worldBuilding.cultures = [];
      }

      // 既存の文化配列を確保
      const existingCultures = Array.isArray(
        projectToUpdate.worldBuilding.cultures
      )
        ? projectToUpdate.worldBuilding.cultures
        : [];

      // 重複確認
      const cultureIds = new Set(
        existingCultures.map((c: { id: string }) => c.id)
      );
      const newCultures = pendingCultures.filter((c) => !cultureIds.has(c.id));

      if (newCultures.length > 0) {
        console.log(`新規追加する文化: ${newCultures.length}件`);
        // 型を明示的にキャストして互換性の問題を解決
        const updatedCultures = [
          ...existingCultures,
          ...newCultures,
        ] as typeof projectToUpdate.worldBuilding.cultures;
        projectToUpdate.worldBuilding.cultures = updatedCultures;
        console.log(
          "[DEBUG] 更新後の文化配列:",
          projectToUpdate.worldBuilding.cultures.length
        );
      }

      console.log(
        "文化の累積保存完了:",
        projectToUpdate.worldBuilding.cultures.length
      );
    }

    // 自由記述欄の保存 - 安全な初期化とマージ
    if (pendingFreeFields.length > 0) {
      console.log(`保留中の自由記述欄: ${pendingFreeFields.length}件`);

      // 配列の安全な初期化
      if (!projectToUpdate.worldBuilding.freeFields) {
        projectToUpdate.worldBuilding.freeFields = [];
      }

      // 既存の自由記述欄配列を確保
      const existingFreeFields = Array.isArray(
        projectToUpdate.worldBuilding.freeFields
      )
        ? projectToUpdate.worldBuilding.freeFields
        : [];

      // 重複確認
      const fieldIds = new Set(
        existingFreeFields.map((f: WorldBuildingFreeField) => f.id)
      );
      const newFields = pendingFreeFields.filter(
        (f: WorldBuildingFreeField) => !fieldIds.has(f.id)
      );

      if (newFields.length > 0) {
        console.log(`新規追加する自由記述欄: ${newFields.length}件`);
        const updatedFields = [...existingFreeFields, ...newFields];
        projectToUpdate.worldBuilding.freeFields = updatedFields;
        console.log(
          "[DEBUG] 更新後の自由記述欄配列:",
          projectToUpdate.worldBuilding?.freeFields?.length || 0
        );
      }

      console.log(
        "自由記述欄の累積保存完了:",
        projectToUpdate.worldBuilding?.freeFields?.length || 0
      );
    }

    console.log("[DEBUG] 保存後の世界観", {
      places: projectToUpdate.worldBuilding.places?.length || 0,
      rules: projectToUpdate.worldBuilding.rules?.length || 0,
      cultures: projectToUpdate.worldBuilding.cultures?.length || 0,
      freeFields: projectToUpdate.worldBuilding?.freeFields?.length || 0,
    });

    // 更新したプロジェクトを状態に保存
    setCurrentProject_(projectToUpdate);

    // 重要: 直近の保存結果を確実に確認
    console.log(
      "[DEBUG] setCurrentProject_直後の地名データ:",
      projectToUpdate.worldBuilding.places.map((p) => p.name),
      "projectデータ",
      projectToUpdate
    );

    // 同期的に最新状態を取得するため、projectToUpdateを返す
    setTimeout(() => {
      // RecoilのcurrentProjectStateが更新されたか確認
      console.log(
        "[DEBUG] 保存後のRecoil状態確認 (遅延):",
        getCurrentProjectState().worldBuilding?.places?.map(
          (p: { name: string }) => p.name
        ) || []
      );
    }, 10);

    // 更新されたタブのマーキング - 新しいオブジェクト参照を確実に作成
    const newUpdatedTabs = { ...updatedTabs };

    // 更新されたタブを強制的にマーク
    if (projectToUpdate.worldBuilding.places?.length > 0) {
      newUpdatedTabs[3] = true; // 地名タブ
      console.log("[DEBUG] 地名タブに更新マークを設定");
    }
    if (projectToUpdate.worldBuilding.rules?.length > 0) {
      newUpdatedTabs[2] = true; // ルールタブ
      console.log("[DEBUG] ルールタブに更新マークを設定");
    }
    if (projectToUpdate.worldBuilding.cultures?.length > 0) {
      newUpdatedTabs[4] = true; // 社会と文化タブ
      console.log("[DEBUG] 社会と文化タブに更新マークを設定");
    }
    if ((projectToUpdate.worldBuilding?.freeFields?.length || 0) > 0) {
      newUpdatedTabs[8] = true; // 自由記述欄タブ
      console.log("[DEBUG] 自由記述欄タブに更新マークを設定");
    }

    // タブの更新状態をUIに反映 - 新しい状態オブジェクトを設定
    console.log("[DEBUG] タブの更新状態:", newUpdatedTabs);
    setUpdatedTabs(newUpdatedTabs);

    // 強制更新カウンターをインクリメント
    const newCounter = forceUpdateCounter + 1;
    setForceUpdateCounter(newCounter);
    console.log("[DEBUG] 強制更新カウンター更新:", newCounter);

    // 変更確認のための遅延チェック
    setTimeout(() => {
      console.log("[DEBUG] 更新後のタブ状態確認:", {
        updatedTabsState: { ...newUpdatedTabs },
        forceUpdateCounter: newCounter,
        placeCount: getCurrentProjectState().worldBuilding?.places?.length || 0,
      });

      // 最終チェック: 保留中だった場所データが本当に保存されているか確認
      const currentPlaces =
        getCurrentProjectState().worldBuilding?.places || [];
      console.log(
        "[DEBUG] 保存後の場所データ確認:",
        currentPlaces.length > 0
          ? currentPlaces.map((p: { name: string }) => p.name)
          : []
      );

      // 保存結果のサマリー
      if (
        projectToUpdate.worldBuilding.places.length > 0 ||
        projectToUpdate.worldBuilding.rules.length > 0 ||
        projectToUpdate.worldBuilding.cultures.length > 0 ||
        (projectToUpdate.worldBuilding?.freeFields?.length || 0) > 0
      ) {
        console.log("[DEBUG] 世界観要素の保存サマリー:", {
          places:
            projectToUpdate.worldBuilding.places.length > 0
              ? "更新あり"
              : "更新なし",
          rules:
            projectToUpdate.worldBuilding.rules.length > 0
              ? "更新あり"
              : "更新なし",
          cultures:
            projectToUpdate.worldBuilding.cultures.length > 0
              ? "更新あり"
              : "更新なし",
          freeFields:
            (projectToUpdate.worldBuilding?.freeFields?.length || 0) > 0
              ? "更新あり"
              : "更新なし",
          updatedTabsState: { ...newUpdatedTabs },
          forceUpdateCounter: newCounter,
        });
      }
    }, 10);

    // 保留中の要素をリセット - 確実に配列の参照を新しく作り直す
    setPendingPlaces([]);
    setPendingRules([]);
    setPendingCultures([]);
    setPendingFreeFields([]);

    return projectToUpdate;
  }, [
    getCurrentProjectState,
    setCurrentProject_,
    pendingPlaces,
    pendingRules,
    pendingCultures,
    pendingFreeFields,
    updatedTabs,
    setUpdatedTabs,
    forceUpdateCounter,
  ]);

  // データの不整合をチェックして修正する関数
  const validateWorldBuildingData = useCallback(() => {
    console.log("[DEBUG] データの整合性チェック開始");

    // 現在のプロジェクト情報を取得
    const currentProject = getCurrentProjectState();
    let isFixed = false;

    // プロジェクトまたは世界観データがない場合は何もしない
    if (!currentProject || !currentProject.worldBuilding) {
      console.log("[DEBUG] 検証するプロジェクトデータがありません");
      return false;
    }

    try {
      // 場所データの整合性チェック
      if (pendingPlaces.length > 0) {
        // 保留中の場所データがあるが保存されていない場合
        if (
          !currentProject.worldBuilding.places ||
          pendingPlaces.some(
            (p: Place) =>
              !currentProject.worldBuilding.places.some(
                (sp: Place) => sp.id === p.id
              )
          )
        ) {
          console.log(
            "[DEBUG] 保留中の場所データが保存されていません、再保存を実行"
          );
          // 再保存処理を実行
          saveAllPendingElements();
          isFixed = true;
        }
      }

      // ルールデータの整合性チェック
      if (pendingRules.length > 0) {
        if (
          !currentProject.worldBuilding.rules ||
          pendingRules.some(
            (r: Rule) =>
              !currentProject.worldBuilding.rules.some(
                (sr: Rule) => sr.id === r.id
              )
          )
        ) {
          console.log(
            "[DEBUG] 保留中のルールデータが保存されていません、再保存を実行"
          );
          saveAllPendingElements();
          isFixed = true;
        }
      }

      // 文化データの整合性チェック
      if (pendingCultures.length > 0) {
        if (
          !currentProject.worldBuilding.cultures ||
          pendingCultures.some(
            (c: Culture) =>
              !currentProject.worldBuilding.cultures.some(
                (sc: Culture) => sc.id === c.id
              )
          )
        ) {
          console.log(
            "[DEBUG] 保留中の文化データが保存されていません、再保存を実行"
          );
          saveAllPendingElements();
          isFixed = true;
        }
      }

      // 自由記述欄データの整合性チェック
      if (pendingFreeFields.length > 0) {
        if (
          !currentProject.worldBuilding.freeFields ||
          pendingFreeFields.some(
            (f: WorldBuildingFreeField) =>
              !currentProject.worldBuilding.freeFields.some(
                (sf: { id: string }) => sf.id === f.id
              )
          )
        ) {
          console.log(
            "[DEBUG] 保留中の自由記述欄データが保存されていません、再保存を実行"
          );
          saveAllPendingElements();
          isFixed = true;
        }
      }

      if (isFixed) {
        console.log("[DEBUG] データの不整合を修正しました");
      } else {
        console.log("[DEBUG] データの整合性に問題はありません");
      }
    } catch (error) {
      console.error("[DEBUG] データ整合性チェック中にエラー:", error);
    }

    return isFixed;
  }, [
    getCurrentProjectState,
    pendingPlaces,
    pendingRules,
    pendingCultures,
    pendingFreeFields,
    saveAllPendingElements,
  ]);

  // すべての保留中要素をクリアする関数
  const clearPendingElements = useCallback(() => {
    setPendingPlaces([]);
    setPendingRules([]);
    setPendingCultures([]);
    setPendingFreeFields([]);
    console.log("[DEBUG] 保留中の要素をクリアしました");
  }, []);

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
