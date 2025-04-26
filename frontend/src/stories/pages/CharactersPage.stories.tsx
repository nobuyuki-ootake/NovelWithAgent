import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { RecoilRoot } from "recoil";
import CharactersPage from "../../pages/CharactersPage";
import { Character } from "../../types";
import { v4 as uuidv4 } from "uuid";

// useCharacters フックのモック
jest.mock("../../hooks/useCharacters", () => {
  return {
    useCharacters: () => ({
      characters: mockCharacters,
      viewMode: mockViewMode,
      openDialog: mockOpenDialog,
      editMode: mockEditMode,
      formData: mockFormData,
      formErrors: {},
      tempImageUrl: "",
      selectedEmoji: "",
      newTrait: "",
      newCustomField: { id: "", name: "", value: "" },
      snackbarOpen: mockSnackbarOpen,
      snackbarMessage: mockSnackbarMessage,
      snackbarSeverity: mockSnackbarSeverity,
      handleViewModeChange: () => {},
      handleOpenDialog: () => {},
      handleEditCharacter: () => {},
      handleCloseDialog: () => {},
      handleImageUpload: () => {},
      handleEmojiSelect: () => {},
      handleInputChange: () => {},
      handleSelectChange: () => {},
      handleAddTrait: () => {},
      handleRemoveTrait: () => {},
      handleNewTraitChange: () => {},
      handleCustomFieldChange: () => {},
      handleAddCustomField: () => {},
      handleRemoveCustomField: () => {},
      handleDeleteCharacter: () => {},
      handleSaveCharacter: () => {},
      handleCloseSnackbar: () => {},
    }),
  };
});

// モックデータの初期値
let mockCharacters: Character[] = [];
let mockViewMode: "list" | "grid" = "grid";
let mockOpenDialog = false;
let mockEditMode = false;
let mockFormData: Character = {
  id: "",
  name: "",
  role: "supporting",
  description: "",
  background: "",
  motivation: "",
  traits: [],
  relationships: [],
};
let mockSnackbarOpen = false;
let mockSnackbarMessage = "";
let mockSnackbarSeverity: "success" | "error" | "info" | "warning" = "success";

const meta: Meta<typeof CharactersPage> = {
  title: "Pages/CharactersPage",
  component: CharactersPage,
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof CharactersPage>;

// キャラクターが存在しない状態
export const NoCharacters: Story = {
  parameters: {
    useCharacters: {
      characters: [],
      viewMode: "grid",
    },
  },
};

// キャラクターが存在する状態（グリッド表示）
export const WithCharactersGrid: Story = {
  parameters: {
    useCharacters: {
      characters: [
        {
          id: uuidv4(),
          name: "山田太郎",
          role: "protagonist",
          gender: "男性",
          birthDate: "2000-01-15",
          description: "物語の主人公。18歳の高校生で、特殊な能力に目覚める。",
          background: "幼い頃に両親を事故で亡くし、祖父母に育てられた。",
          motivation: "失われた家族の謎を解明し、自分の能力の真実を知ること。",
          traits: [
            { id: uuidv4(), name: "勇敢", value: "" },
            { id: uuidv4(), name: "正義感が強い", value: "" },
            { id: uuidv4(), name: "頑固", value: "" },
          ],
          relationships: [],
          imageUrl: "https://picsum.photos/id/1012/200",
          customFields: [
            { id: uuidv4(), name: "好きな食べ物", value: "オムライス" },
            { id: uuidv4(), name: "特技", value: "剣術" },
          ],
        },
        {
          id: uuidv4(),
          name: "佐藤花子",
          role: "supporting",
          gender: "女性",
          birthDate: "2001-05-20",
          description: "主人公のクラスメイト。賢く、主人公を助ける存在。",
          background: "裕福な家庭で育ち、幼い頃から優秀な成績を収めてきた。",
          motivation: "新しい知識を得ることと、友人を守ること。",
          traits: [
            { id: uuidv4(), name: "聡明", value: "" },
            { id: uuidv4(), name: "思いやりがある", value: "" },
            { id: uuidv4(), name: "好奇心旺盛", value: "" },
          ],
          relationships: [],
          imageUrl: "https://picsum.photos/id/1027/200",
          customFields: [
            { id: uuidv4(), name: "好きな教科", value: "数学" },
            { id: uuidv4(), name: "趣味", value: "読書、パズル" },
          ],
        },
        {
          id: uuidv4(),
          name: "黒川剛",
          role: "antagonist",
          gender: "男性",
          birthDate: "1980-11-03",
          description: "謎の組織のリーダー。主人公と対立する存在。",
          background: "秘密組織で育てられ、特殊な訓練を受けてきた。",
          motivation: "力を手に入れ、世界を自分の理想に塗り替えること。",
          traits: [
            { id: uuidv4(), name: "冷酷", value: "" },
            { id: uuidv4(), name: "知略に富む", value: "" },
            { id: uuidv4(), name: "完璧主義", value: "" },
          ],
          relationships: [],
          imageUrl: "https://picsum.photos/id/1041/200",
          customFields: [
            { id: uuidv4(), name: "弱点", value: "過去のトラウマ" },
            { id: uuidv4(), name: "武器", value: "特殊能力「闇の炎」" },
          ],
        },
      ],
      viewMode: "grid",
    },
  },
};

// キャラクターが存在する状態（リスト表示）
export const WithCharactersList: Story = {
  parameters: {
    useCharacters: {
      characters: WithCharactersGrid.parameters?.useCharacters?.characters,
      viewMode: "list",
    },
  },
};

// キャラクター作成ダイアログが開いている状態
export const WithOpenDialog: Story = {
  parameters: {
    useCharacters: {
      characters: WithCharactersGrid.parameters?.useCharacters?.characters,
      viewMode: "grid",
      openDialog: true,
      editMode: false,
      formData: {
        id: uuidv4(),
        name: "",
        role: "supporting",
        gender: "",
        birthDate: "",
        description: "",
        background: "",
        motivation: "",
        traits: [],
        relationships: [],
        customFields: [],
      },
    },
  },
};

// キャラクター編集ダイアログが開いている状態
export const WithEditDialog: Story = {
  parameters: {
    useCharacters: {
      characters: WithCharactersGrid.parameters?.useCharacters?.characters,
      viewMode: "grid",
      openDialog: true,
      editMode: true,
      formData: {
        id: uuidv4(),
        name: "山田太郎",
        role: "protagonist",
        gender: "男性",
        birthDate: "2000-01-15",
        description: "物語の主人公。18歳の高校生で、特殊な能力に目覚める。",
        background: "幼い頃に両親を事故で亡くし、祖父母に育てられた。",
        motivation: "失われた家族の謎を解明し、自分の能力の真実を知ること。",
        traits: [
          { id: uuidv4(), name: "勇敢", value: "" },
          { id: uuidv4(), name: "正義感が強い", value: "" },
          { id: uuidv4(), name: "頑固", value: "" },
        ],
        relationships: [],
        imageUrl: "https://picsum.photos/id/1012/200",
        customFields: [
          { id: uuidv4(), name: "好きな食べ物", value: "オムライス" },
          { id: uuidv4(), name: "特技", value: "剣術" },
        ],
      },
    },
  },
};

// スナックバー通知が表示されている状態
export const WithSnackbar: Story = {
  parameters: {
    useCharacters: {
      characters: WithCharactersGrid.parameters?.useCharacters?.characters,
      viewMode: "grid",
      snackbarOpen: true,
      snackbarMessage: "キャラクターを保存しました",
      snackbarSeverity: "success",
    },
  },
};

// モバイル表示
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    useCharacters: {
      characters: WithCharactersGrid.parameters?.useCharacters?.characters,
      viewMode: "grid",
    },
  },
};
