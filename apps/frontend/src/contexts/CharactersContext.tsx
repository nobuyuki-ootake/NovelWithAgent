import React, { createContext, useContext, ReactNode, useState } from "react";
import { useCharacters } from "../hooks/useCharacters";
import { useAIAssist } from "../hooks/useAIAssist";
import { useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";
import {
  Character,
  NovelProject,
  CustomField,
  CharacterStatus,
  // CharacterTrait, // 未使用のためコメントアウト
  // Relationship, // 未使用のためコメントアウト
} from "@novel-ai-assistant/types";
import { currentProjectState } from "../store/atoms";
import { AIResponse, CharacterBatchResponse } from "../types/apiResponse";
import { ResponseData } from "../components/modals/AIAssistModal";

// Helper function to parse a single character from AI response
const parseAIResponseToCharacter = (aiResponse: string): Character | null => {
  const character: Partial<Character> = {
    id: uuidv4(), // Always generate a new ID
    traits: [],
    statuses: [],
    customFields: [],
    relationships: [],
  };

  const nameMatch = aiResponse.match(/名前[：:]\\s*(.+?)($|\\n)/);
  if (nameMatch && nameMatch[1]) character.name = nameMatch[1].trim();

  const roleMatch = aiResponse.match(/役割[：:]\\s*(主人公|敵役|脇役)($|\\n)/);
  if (roleMatch && roleMatch[1]) {
    const roleMap: Record<string, Character["role"]> = {
      主人公: "protagonist",
      敵役: "antagonist",
      脇役: "supporting",
    };
    character.role = roleMap[roleMatch[1]] || "supporting";
  }

  const genderMatch = aiResponse.match(/性別[：:]\\s*(.+?)($|\\n)/);
  if (genderMatch && genderMatch[1]) character.gender = genderMatch[1].trim();

  // Add other fields parsing here based on CharacterForm's applyAIResponse
  const backgroundMatch = aiResponse.match(
    /背景[：:]\\s*(.+?)(\\n\\n|\\n[^:]|$)/s
  );
  if (backgroundMatch && backgroundMatch[1]) {
    character.background = backgroundMatch[1].trim();
  }

  const motivationMatch = aiResponse.match(
    /動機[：:]\\s*(.+?)(\\n\\n|\\n[^:]|$)/s
  );
  if (motivationMatch && motivationMatch[1]) {
    character.motivation = motivationMatch[1].trim();
  }

  const descriptionMatch = aiResponse.match(
    /説明[：:]\\s*(.+?)(\\n\\n|\\n[^:]|$)/s
  );
  if (descriptionMatch && descriptionMatch[1]) {
    character.description = descriptionMatch[1].trim();
  }

  const appearanceMatch = aiResponse.match(
    /外見[：:]\\s*(.+?)(\\n\\n|\\n[^:]|$)/s
  );
  if (appearanceMatch && appearanceMatch[1]) {
    character.appearance = appearanceMatch[1].trim();
  }

  const personalityMatch = aiResponse.match(
    /性格[：:]\\s*(.+?)(\\n\\n|\\n[^:]|$)/s
  );
  if (personalityMatch && personalityMatch[1]) {
    character.personality = personalityMatch[1].trim();
  }

  const traitsMatch = aiResponse.match(/特性[：:]\\s*(.+?)(\\n\\n|\\n[^:]|$)/s);
  if (traitsMatch && traitsMatch[1]) {
    character.traits = traitsMatch[1]
      .split(/[,、]/)
      .map((t) => t.trim())
      .filter((t) => t)
      .map((traitValue) => ({
        id: uuidv4(),
        name: traitValue,
        value: traitValue,
      }));
  }

  if (!character.name) return null; // Basic validation: name is required
  return character as Character;
};

// Helper function to parse multiple characters from AI response
const parseAIResponseToCharacters = (aiResponse: string): Character[] => {
  // This is a simplified parser.
  // Assumes characters are separated by a specific delimiter or pattern.
  // For now, let's assume each character block is separated by "---"
  const characterBlocks = aiResponse.split(/\\n-----\\n|\\n---\\n/);
  return characterBlocks
    .map((block) => parseAIResponseToCharacter(block.trim()))
    .filter((char): char is Character => char !== null);
};

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
  handleAIAssist: (params: {
    message: string;
    plotId?: string | null;
  }) => Promise<ResponseData>;
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
  const handleAIAssist = async (params: {
    message: string;
    plotId?: string | null;
  }): Promise<ResponseData> => {
    if (isLoading) {
      return {
        response: "AIキャラクター生成処理が既に実行中です。",
        error: true,
      };
    }
    try {
      // plotId は generateCharactersBatch では直接使用しないが、互換性のために残す
      // 必要であれば message に含めるなどの処理を追加
      const result = await generateCharactersBatch(
        params.message,
        currentProject?.plot || [],
        characters
      );

      // CharacterBatchResponse を ResponseData に変換
      // ここでは成功した旨のメッセージを返す。実際のキャラクターデータは onCharacterGenerated で処理される想定。
      if ((result as AIBatchResponse)?.batchResponse) {
        setAiAssistModalOpen(false); // 成功したらモーダルを閉じる
        return {
          response: `${
            (result as AIBatchResponse).totalCharacters
          }体のキャラクター生成処理を開始しました。完了までお待ちください。`,
        };
      } else {
        // エラーか、予期しないレスポンスの場合
        return {
          response: "キャラクター生成リクエストで予期しない応答がありました。",
          error: true,
        };
      }
    } catch (error) {
      console.error("AI Character batch assist error:", error);
      return {
        response: `AIキャラクター一括生成中にエラーが発生しました: ${
          error instanceof Error ? error.message : String(error)
        }`,
        error: true,
      };
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
        characters.forEach((parsedCharacter: Character) => {
          addCharacter(parsedCharacter); // IDはパース時にすでに設定済み
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
