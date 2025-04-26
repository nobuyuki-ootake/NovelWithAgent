import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { RecoilRoot } from "recoil";
import PlotPage from "../../pages/PlotPage";
import { v4 as uuidv4 } from "uuid";
import { PlotItem } from "../../types";

// usePlot フックのモック
jest.mock("../../hooks/usePlot", () => {
  return {
    usePlot: () => ({
      currentProject: mockProject,
      plotItems: mockPlotItems,
      editDialogOpen: false,
      editingItem: null,
      newPlotItemTitle: "",
      newPlotItemDescription: "",
      newPlotItemType: "イベント",
      newPlotItemOrder: 0,
      snackbarOpen: false,
      snackbarMessage: "",
      handleNewPlotItemTitleChange: () => {},
      handleNewPlotItemDescriptionChange: () => {},
      handleNewPlotItemTypeChange: () => {},
      handleAddPlotItem: () => {},
      handleEditDialogOpen: () => {},
      handleEditDialogClose: () => {},
      handleDeletePlotItem: () => {},
      handleUpdatePlotItem: () => {},
      handleDragEnd: () => {},
    }),
  };
});

// モックデータ
const mockProject = {
  id: uuidv4(),
  title: "ファンタジー小説",
  createdAt: new Date(),
  updatedAt: new Date(),
  synopsis: "魔法の世界を冒険する若者の物語",
  plot: [],
  characters: [],
  worldBuilding: {
    id: uuidv4(),
    setting: "",
    rules: [],
    places: [],
    cultures: [],
    history: "",
    freeFields: [],
  },
  timeline: [],
  chapters: [],
  feedback: [],
};

const mockPlotItems: PlotItem[] = [
  {
    id: uuidv4(),
    title: "主人公が魔法の杖を発見",
    description: "森の奥で古代の魔法の杖を偶然発見する",
    type: "イベント",
    order: 0,
  },
  {
    id: uuidv4(),
    title: "魔法学校への入学",
    description: "魔法の才能を認められ、隠された魔法学校への招待状が届く",
    type: "イベント",
    order: 1,
  },
  {
    id: uuidv4(),
    title: "最初の試練",
    description: "学校での最初の試練で困難に直面するが、新しい友人の助けを得る",
    type: "転機",
    order: 2,
  },
  {
    id: uuidv4(),
    title: "敵対者の出現",
    description: "主人公の持つ力を狙う闇の魔法使いが現れる",
    type: "伏線",
    order: 3,
  },
  {
    id: uuidv4(),
    title: "守護者との出会い",
    description: "主人公に古代の魔法の秘密を教える年老いた守護者との出会い",
    type: "設定",
    order: 4,
  },
];

const meta: Meta<typeof PlotPage> = {
  title: "Pages/PlotPage",
  component: PlotPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <RecoilRoot>
        <Story />
      </RecoilRoot>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PlotPage>;

// 標準表示（プロットアイテムあり）
export const StandardView: Story = {
  parameters: {
    usePlot: {
      currentProject: mockProject,
      plotItems: mockPlotItems,
    },
  },
};

// 空のプロット画面
export const EmptyPlot: Story = {
  parameters: {
    usePlot: {
      currentProject: mockProject,
      plotItems: [],
    },
  },
};

// 多数のプロットアイテムがある状態
export const ManyPlotItems: Story = {
  parameters: {
    usePlot: {
      currentProject: mockProject,
      plotItems: [
        ...mockPlotItems,
        {
          id: uuidv4(),
          title: "真実の発見",
          description: "主人公が自分の出生の秘密に気づく",
          type: "転機",
          order: 5,
        },
        {
          id: uuidv4(),
          title: "仲間との衝突",
          description: "意見の相違から親友との間に亀裂が生まれる",
          type: "伏線",
          order: 6,
        },
        {
          id: uuidv4(),
          title: "和解と成長",
          description: "試練を乗り越え、より強い絆で結ばれる",
          type: "イベント",
          order: 7,
        },
        {
          id: uuidv4(),
          title: "最終決戦",
          description: "闇の魔法使いとの決戦に挑む",
          type: "転機",
          order: 8,
        },
        {
          id: uuidv4(),
          title: "魔法世界の秩序",
          description: "魔法世界には古代から伝わる厳格な掟がある",
          type: "設定",
          order: 9,
        },
      ],
    },
  },
};
