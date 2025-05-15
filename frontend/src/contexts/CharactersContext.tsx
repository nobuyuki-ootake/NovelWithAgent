import React, { createContext, useContext, ReactNode, useState } from "react";
import { useCharacters } from "../hooks/useCharacters";
import { useAIAssist } from "../hooks/useAIAssist";
import { v4 as uuidv4 } from "uuid";
import {
  Character,
  CharacterStatus,
  CustomField,
  NovelProject,
} from "../types";
import { useRecoilValue } from "recoil";
import { currentProjectState } from "../store/atoms";
import { AIResponse, CharacterBatchResponse } from "../types/apiResponse";

// AIレスポンスの型定義
interface AICharacterResponse extends AIResponse {
  response: string;
}

// バッチレスポンスの型
interface AIBatchResponse extends CharacterBatchResponse {
  batchResponse: true;
  characters: AICharacterResponse[];
  totalCharacters: number;
}

// コンテキストで提供する値の型定義
interface CharactersContextType {
  // キャラクター状態
  characters: Character[];
  viewMode: "grid" | "list";
  openDialog: boolean;
  editMode: boolean;
  formData: Character;
  formErrors: Record<string, string>;
  tempImageUrl: string;
  selectedEmoji: string;
  newTrait: string;
  newCustomField: CustomField;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: "success" | "error" | "info" | "warning";
  aiProgress: number | null; // AIの進捗状態 (0-100, nullの場合は非表示)
  currentProject: NovelProject | null; // 現在のプロジェクト情報

  // アクション
  handleViewModeChange: (
    event: React.MouseEvent<HTMLElement>,
    newMode: "grid" | "list" | null
  ) => void;
  handleOpenDialog: (characterId?: string) => void;
  handleEditCharacter: (character: Character) => void;
  handleCloseDialog: () => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmojiSelect: (emoji: string) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (e: { target: { name: string; value: string } }) => void;
  handleAddTrait: () => void;
  handleRemoveTrait: (index: number) => void;
  handleNewTraitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleAddCustomField: () => void;
  handleRemoveCustomField: (id: string) => void;
  handleDeleteCharacter: (id: string) => void;
  handleSaveCharacter: () => void;
  handleCloseSnackbar: () => void;
  handleSaveStatus: (status: CharacterStatus) => void;
  handleDeleteStatus: (statusId: string) => void;
  addCharacter: (character: Character) => void;

  // AIアシスト機能
  aiAssistModalOpen: boolean;
  setAiAssistModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingAI: boolean;
  handleOpenAIAssist: () => Promise<void>;
  handleAIAssist: (message: string) => Promise<unknown>;
  handleAIAssistComplete: (result: unknown) => void;
  parseAIResponseToCharacter: (aiResponse: string) => Character | null;
  parseAIResponseToCharacters: (aiResponse: string) => Character[];
}

// コンテキストの作成
const CharactersContext = createContext<CharactersContextType | undefined>(
  undefined
);

// プロバイダーコンポーネント
export const CharactersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [aiAssistModalOpen, setAiAssistModalOpen] = useState(false);
  const currentProject = useRecoilValue(currentProjectState);
  const [aiProgress, setAiProgress] = useState<number | null>(null);

  // useCharactersフックからキャラクター関連のロジックを取得
  const {
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
    handleNewTraitChange,
    handleCustomFieldChange,
    handleAddCustomField,
    handleRemoveCustomField,
    handleDeleteCharacter,
    handleSaveCharacter,
    handleCloseSnackbar,
    handleSaveStatus,
    handleDeleteStatus,
    addCharacter,
  } = useCharacters();

  // AIアシスト機能
  const { generateCharactersBatch, isLoading } = useAIAssist({
    onCharacterGenerated: (result) => {
      if (result && (result as AICharacterResponse).response) {
        // 個別のキャラクターをパースして追加
        const character = parseAIResponseToCharacter(
          (result as AICharacterResponse).response
        );
        if (character) {
          console.log(`キャラクター「${character.name}」を追加します`);
          // 必ず新しいIDを割り当てて追加（既存キャラクターとの重複を避ける）
          const newCharacterId = uuidv4();

          // 関係性のIDも更新
          const updatedRelationships = character.relationships.map((rel) => ({
            ...rel,
            id: uuidv4(), // 関係性のIDを更新
          }));

          // 最終的なキャラクターオブジェクト
          const newCharacter = {
            ...character,
            id: newCharacterId,
            relationships: updatedRelationships,
          };

          // キャラクターを追加
          addCharacter(newCharacter);
        }
      }
    },
    onCharacterGenerationProgress: (progress, character, total) => {
      console.log(
        `生成進捗: ${Math.round(progress * 100)}%`,
        character?.name,
        `${total || "?"}人中`
      );

      // 進捗状態を更新
      setAiProgress(Math.round(progress * 100));
    },
  });

  // AIアシスタントを開く
  const handleOpenAIAssist = async () => {
    setAiAssistModalOpen(true);
    return Promise.resolve();
  };

  // AIアシストリクエスト実行
  const handleAIAssist = async (message: string) => {
    try {
      // 進捗バーを表示
      setAiProgress(0);
      // Snackbarで処理中を表示
      handleCloseSnackbar(); // 既存のSnackbarを閉じる

      // あらすじとプロットを参照してキャラクター生成をリクエスト
      const synopsis = currentProject?.synopsis || "";
      const plotElements = currentProject?.plot || [];
      const existingCharacters = currentProject?.characters || [];

      // 分割生成モードを使用
      return await generateCharactersBatch(
        message,
        [
          ...plotElements.map(
            (item) => ({ type: "plotItem", content: item } as any)
          ),
          { type: "synopsis", content: synopsis } as any,
        ],
        existingCharacters.map(
          (char) => ({ type: "character", content: char } as any)
        )
      );
    } catch (error) {
      console.error("AIリクエストエラー:", error);
      // エラーの場合もプログレスバーを非表示に
      setAiProgress(null);
      throw error;
    }
  };

  // AIアシスト完了時の処理
  const handleAIAssistComplete = (result: unknown) => {
    try {
      if (
        result &&
        typeof result === "object" &&
        "batchResponse" in result &&
        "characters" in result
      ) {
        console.log(
          "バッチ生成完了:",
          (result as AIBatchResponse).totalCharacters,
          "人のキャラクターが生成されました"
        );

        // バッチ処理の場合は個別キャラクターがすでに追加済みなので
        // ここでの追加処理は不要
      } else if (result && typeof result === "object" && "response" in result) {
        // 従来の処理 - 一括レスポンスからキャラクターをパース
        const characters = parseAIResponseToCharacters(
          (result as AICharacterResponse).response
        );
        console.log("追加するキャラクター:", characters.length, "件");

        // すべてのキャラクターを追加
        characters.forEach((character) => {
          addCharacter(character); // IDはパース時にすでに設定済み
        });
      }

      // 完了したらプログレスバーを非表示に
      setAiProgress(null);
    } catch (error) {
      console.error("AIレスポンス処理エラー:", error);
      setAiProgress(null);
    }
  };

  // コンテキストで提供する値
  const value: CharactersContextType = {
    // キャラクター状態と関数
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
    aiProgress,
    currentProject,
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
    handleNewTraitChange,
    handleCustomFieldChange,
    handleAddCustomField,
    handleRemoveCustomField,
    handleDeleteCharacter,
    handleSaveCharacter,
    handleCloseSnackbar,
    handleSaveStatus,
    handleDeleteStatus,
    addCharacter,

    // AIアシスト関連
    aiAssistModalOpen,
    setAiAssistModalOpen,
    isLoadingAI: isLoading,
    handleOpenAIAssist,
    handleAIAssist,
    handleAIAssistComplete,
    parseAIResponseToCharacter,
    parseAIResponseToCharacters,
  };

  return (
    <CharactersContext.Provider value={value}>
      {children}
    </CharactersContext.Provider>
  );
};

// カスタムフック
export const useCharactersContext = () => {
  const context = useContext(CharactersContext);
  if (context === undefined) {
    throw new Error(
      "useCharactersContext must be used within a CharactersProvider"
    );
  }
  return context;
};
