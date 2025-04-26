import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentProjectState } from "../store/atoms";
import { Character, CustomField, CharacterTrait, Relationship } from "../types";
import { v4 as uuidv4 } from "uuid";
import {
  NovelProject,
  Character as IndexCharacter,
  CharacterRelationship,
} from "../types/index";

// 絵文字をデータURLに変換する関数
const emojiToDataUrl = (emoji: string): string => {
  return `data:text/plain;charset=utf-8,${encodeURIComponent(emoji)}`;
};

// データURLから絵文字を抽出する関数
const dataUrlToEmoji = (dataUrl: string): string | null => {
  if (!dataUrl || !dataUrl.startsWith("data:text/plain;charset=utf-8,")) {
    return null;
  }
  return decodeURIComponent(dataUrl.split(",")[1]);
};

// キャラクター型を変換する関数
const convertToIndexCharacter = (character: Character): IndexCharacter => {
  // 文字列配列としてのtraitsを作成
  const stringTraits = (character.traits || []).map((trait) =>
    typeof trait === "string" ? trait : trait.name
  );

  // リレーションシップをCharacterRelationship型に変換
  const indexRelationships = (character.relationships || []).map((rel) => {
    if ("targetCharacterId" in rel) {
      return {
        characterId: rel.targetCharacterId,
        relationshipType: rel.type || "",
        description: rel.description || "",
      } as CharacterRelationship;
    }
    return rel as unknown as CharacterRelationship;
  });

  // IndexCharacterオブジェクトを作成して返す
  return {
    id: character.id,
    name: character.name,
    role: character.role,
    gender: character.gender,
    birthDate: character.birthDate,
    description: character.description || "",
    background: character.background || "",
    motivation: character.motivation || "",
    traits: stringTraits,
    relationships: indexRelationships,
    imageUrl: character.imageUrl,
    customFields: character.customFields,
  } as unknown as IndexCharacter;
};

export function useCharacters() {
  // Recoilの状態
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);

  // ローカルの状態
  const [characters, setCharacters] = useState<Character[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 新規キャラクター用の初期状態
  const initialCharacterState: Partial<Character> & {
    id: string;
    name: string;
    role: "protagonist" | "antagonist" | "supporting";
  } = {
    id: "",
    name: "",
    role: "supporting",
    gender: "",
    birthDate: "",
    description: "",
    background: "",
    motivation: "",
    traits: [],
    relationships: [],
    imageUrl: "",
    customFields: [],
  };

  // フォーム入力用の状態
  const [formData, setFormData] = useState<Character>({
    ...(initialCharacterState as Character),
  });
  const [newTrait, setNewTrait] = useState("");
  const [newCustomField, setNewCustomField] = useState<CustomField>({
    id: "",
    name: "",
    value: "",
  });

  // プロジェクトからキャラクターを読み込む
  useEffect(() => {
    if (currentProject?.characters) {
      // キャラクターデータの互換性を確保
      const convertedCharacters = currentProject.characters.map((character) => {
        // traitsが文字列配列の場合、CharacterTrait配列に変換
        const traits = Array.isArray(character.traits)
          ? character.traits.map((trait) => {
              if (typeof trait === "string") {
                return {
                  id: uuidv4(),
                  name: trait,
                  value: "",
                } as CharacterTrait;
              }
              return trait as CharacterTrait;
            })
          : [];

        // 型を互換性のある形式に変換
        const convertedChar = {
          ...character,
          traits,
          // 必須フィールドにデフォルト値を設定
          description: character.description || "",
          background: character.background || "",
          motivation: character.motivation || "",
          relationships: (character.relationships || []).map((rel) => {
            // CharacterRelationshipからRelationshipに変換
            if ("characterId" in rel) {
              return {
                id: uuidv4(),
                targetCharacterId: rel.characterId,
                type: rel.relationshipType || "",
                description: rel.description || "",
              } as Relationship;
            }
            return rel as Relationship;
          }),
        };

        return convertedChar as unknown as Character;
      });

      setCharacters(convertedCharacters);
    }
  }, [currentProject]);

  // 表示モードの切り替え
  const handleViewModeChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, newMode: "list" | "grid" | null) => {
      if (newMode !== null) {
        setViewMode(newMode);
      }
    },
    []
  );

  // ダイアログを開く（新規作成）
  const handleOpenDialog = useCallback(() => {
    setFormData({ ...(initialCharacterState as Character), id: uuidv4() });
    setTempImageUrl("");
    setSelectedEmoji("");
    setFormErrors({});
    setEditMode(false);
    setOpenDialog(true);
  }, [initialCharacterState]);

  // ダイアログを開く（編集）
  const handleEditCharacter = useCallback((character: Character) => {
    // 必須フィールドを確保
    const ensuredCharacter = {
      ...character,
      description: character.description || "",
      background: character.background || "",
      motivation: character.motivation || "",
      relationships: character.relationships || [],
      traits: character.traits || [],
      customFields: character.customFields || [],
    };

    setFormData(ensuredCharacter);
    setTempImageUrl(character.imageUrl || "");
    // 画像URLが絵文字データURIの場合は選択絵文字を設定
    if (
      character.imageUrl &&
      character.imageUrl.startsWith("data:text/plain;charset=utf-8,")
    ) {
      const emoji = dataUrlToEmoji(character.imageUrl);
      if (emoji) setSelectedEmoji(emoji);
    } else {
      setSelectedEmoji("");
    }
    setFormErrors({});
    setEditMode(true);
    setOpenDialog(true);
  }, []);

  // ダイアログを閉じる
  const handleCloseDialog = useCallback(() => {
    if (hasUnsavedChanges) {
      // 未保存の変更がある場合の処理（警告表示など）
      const confirm = window.confirm(
        "未保存の変更があります。破棄してもよろしいですか？"
      );
      if (!confirm) return;
    }
    setOpenDialog(false);
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges]);

  // 画像アップロード処理
  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // ファイルサイズチェック（5MB以下）
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors({
          ...formErrors,
          image: "画像サイズは5MB以下にしてください",
        });
        return;
      }

      // 画像のプレビューURLを作成
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setTempImageUrl(result);
        setFormData({ ...formData, imageUrl: result });
        setSelectedEmoji(""); // 画像がアップロードされたら絵文字選択をクリア
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    },
    [formData, formErrors]
  );

  // 絵文字を選択
  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      const emojiDataUrl = emojiToDataUrl(emoji);
      setSelectedEmoji(emoji);
      setTempImageUrl(""); // 絵文字が選択されたら画像をクリア
      setFormData({ ...formData, imageUrl: emojiDataUrl });
      setHasUnsavedChanges(true);
    },
    [formData]
  );

  // 入力フィールドの変更処理
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      // エラーがあれば消去
      if (formErrors[name]) {
        setFormErrors({ ...formErrors, [name]: "" });
      }
      setHasUnsavedChanges(true);
    },
    [formData, formErrors]
  );

  // セレクトフィールドの変更処理
  const handleSelectChange = useCallback(
    (e: { target: { name: string; value: string } }) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      setHasUnsavedChanges(true);
    },
    [formData]
  );

  // 特性の追加
  const handleAddTrait = useCallback(() => {
    if (!newTrait.trim()) return;
    const traits = formData.traits || [];
    const newCharacterTrait: CharacterTrait = {
      id: uuidv4(),
      name: newTrait.trim(),
      value: "",
    };
    const updatedTraits = [...traits, newCharacterTrait];
    setFormData({ ...formData, traits: updatedTraits });
    setNewTrait("");
    setHasUnsavedChanges(true);
  }, [newTrait, formData]);

  // 特性の削除
  const handleRemoveTrait = useCallback(
    (index: number) => {
      const traits = formData.traits || [];
      const updatedTraits = traits.filter((_, i) => i !== index);
      setFormData({ ...formData, traits: updatedTraits });
      setHasUnsavedChanges(true);
    },
    [formData]
  );

  // カスタムフィールドの入力処理
  const handleCustomFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewCustomField({ ...newCustomField, [name]: value });
    },
    [newCustomField]
  );

  // カスタムフィールドの追加
  const handleAddCustomField = useCallback(() => {
    if (!newCustomField.name.trim()) return;

    const customFields = formData.customFields || [];
    const updatedCustomFields = [
      ...customFields,
      { ...newCustomField, id: uuidv4() },
    ];

    setFormData({ ...formData, customFields: updatedCustomFields });
    setNewCustomField({ id: "", name: "", value: "" });
    setHasUnsavedChanges(true);
  }, [formData, newCustomField]);

  // カスタムフィールドの削除
  const handleRemoveCustomField = useCallback(
    (id: string) => {
      const customFields = formData.customFields || [];
      const updatedCustomFields = customFields.filter(
        (field) => field.id !== id
      );
      setFormData({ ...formData, customFields: updatedCustomFields });
      setHasUnsavedChanges(true);
    },
    [formData]
  );

  // キャラクターの削除
  const handleDeleteCharacter = useCallback(
    (id: string) => {
      const confirm = window.confirm(
        "このキャラクターを削除してもよろしいですか？"
      );
      if (!confirm) return;

      const updatedCharacters = characters.filter(
        (character) => character.id !== id
      );
      setCharacters(updatedCharacters);

      // Recoilの状態も更新
      if (currentProject) {
        // NovelProjectの型に合わせてキャラクターを変換
        const indexCharacters = updatedCharacters.map(convertToIndexCharacter);

        // 明示的にunknownを介して型変換
        const updatedProject = {
          ...currentProject,
          characters: indexCharacters,
          updatedAt: new Date(),
        } as unknown as NovelProject;

        setCurrentProject(updatedProject);

        setSnackbarMessage("キャラクターを削除しました");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    },
    [characters, currentProject, setCurrentProject]
  );

  // フォームのバリデーション
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "名前は必須です";
    }

    if (!formData.role) {
      errors.role = "役割は必須です";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // キャラクターの保存
  const handleSaveCharacter = useCallback(async () => {
    // バリデーション
    if (!validateForm()) return;

    let newCharacters: Character[];
    if (editMode) {
      // 既存キャラクターの更新
      newCharacters = characters.map((char) =>
        char.id === formData.id ? formData : char
      );
    } else {
      // 新規キャラクターの追加
      newCharacters = [...characters, formData];
    }

    setCharacters(newCharacters);

    // Recoilの状態も更新
    if (currentProject) {
      // NovelProjectの型に合わせてキャラクターを変換
      const indexCharacters = newCharacters.map(convertToIndexCharacter);

      // 明示的にunknownを介して型変換
      const updatedProject = {
        ...currentProject,
        characters: indexCharacters,
        updatedAt: new Date(),
      } as unknown as NovelProject;

      setCurrentProject(updatedProject);
    }

    // ダイアログを閉じる
    setOpenDialog(false);
    setHasUnsavedChanges(false);

    // フォームをリセット
    setFormData({ ...(initialCharacterState as Character) });
    setTempImageUrl("");
    setSelectedEmoji("");

    // 成功メッセージを表示
    setSnackbarMessage(
      editMode
        ? "キャラクターを更新しました"
        : "新しいキャラクターを作成しました"
    );
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  }, [
    validateForm,
    editMode,
    characters,
    formData,
    currentProject,
    setCurrentProject,
    initialCharacterState,
  ]);

  // スナックバーを閉じる
  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // 新しい特性の入力処理
  const handleNewTraitChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTrait(e.target.value);
    },
    []
  );

  return {
    characters,
    viewMode,
    openDialog,
    editMode,
    formData,
    formErrors,
    tempImageUrl,
    selectedEmoji,
    newTrait,
    newCustomField,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleViewModeChange,
    handleOpenDialog,
    handleEditCharacter,
    handleCloseDialog,
    handleImageUpload,
    handleEmojiSelect,
    handleInputChange,
    handleSelectChange,
    handleAddTrait,
    handleRemoveTrait,
    handleCustomFieldChange,
    handleAddCustomField,
    handleRemoveCustomField,
    handleDeleteCharacter,
    handleSaveCharacter,
    handleCloseSnackbar,
    handleNewTraitChange,
    emojiToDataUrl,
    dataUrlToEmoji,
  };
}
