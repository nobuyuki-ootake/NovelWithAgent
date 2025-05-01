import { Meta, StoryObj } from "@storybook/react";
import { RecoilRoot } from "recoil";
import WorldBuildingPage from "../../pages/WorldBuildingPage";
import { NovelProject } from "../../types/index";
import { v4 as uuidv4 } from "uuid";

// モックデータ
const mockProject: NovelProject = {
  id: uuidv4(),
  title: "ファンタジー小説",
  createdAt: new Date(),
  updatedAt: new Date(),
  synopsis: "魔法の世界を冒険する若者の物語",
  plot: [],
  characters: [],
  worldBuilding: {
    id: uuidv4(),
    setting: "魔法とドラゴンが存在する中世ファンタジー世界",
    rules: [
      "魔法は魔力という資源を消費する",
      "ドラゴンは知性を持ち人間語を話せる",
      "魔法は血統により才能が決まる",
    ],
    places: [
      {
        id: uuidv4(),
        name: "アルマリア王国",
        description:
          "七つの王国の中で最も強大な国。豊かな森と肥沃な土地に恵まれた王国。",
        significance: "物語の主要な舞台。主人公の出身地。",
      },
    ],
    cultures: [],
    history:
      "五百年前の大魔法戦争で古代文明は崩壊し、現在の七王国体制が確立した。",
    freeFields: [],
  },
  timeline: [],
  chapters: [],
  feedback: [],
};

const meta: Meta<typeof WorldBuildingPage> = {
  title: "Pages/WorldBuildingPage",
  component: WorldBuildingPage,
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
type Story = StoryObj<typeof WorldBuildingPage>;

export const NoProject: Story = {
  args: {
    currentProject: null,
  },
};

export const StandardView: Story = {
  args: {
    currentProject: mockProject,
  },
};
