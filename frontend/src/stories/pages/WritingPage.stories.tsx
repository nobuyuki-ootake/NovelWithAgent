import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { RecoilRoot } from "recoil";
import WritingPage from "../../pages/WritingPage";
import { v4 as uuidv4 } from "uuid";
import { Chapter, RelatedEvent } from "../../types";

// useWriting フックのモック
jest.mock("../../hooks/useWriting", () => {
  return {
    useWriting: () => ({
      currentProject: mockProject,
      chapters: mockChapters,
      relatedEvents: mockRelatedEvents,
      activeChapter: mockChapters[0],
      editorContent: mockChapters[0]?.content || "",
      previewDialogOpen: false,
      previewContent: "",
      createChapterDialogOpen: false,
      newChapterTitle: "",
      snackbarOpen: false,
      snackbarMessage: "",
      handleChapterSelect: () => {},
      handleEditorChange: () => {},
      handleSaveContent: () => {},
      handleOpenPreview: () => {},
      handleClosePreview: () => {},
      handleOpenCreateChapterDialog: () => {},
      handleCloseCreateChapterDialog: () => {},
      handleNewChapterTitleChange: () => {},
      handleCreateChapter: () => {},
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

const mockChapters: Chapter[] = [
  {
    id: uuidv4(),
    title: "第1章: 魔法との出会い",
    content:
      "森の奥深くで、主人公のアレックスは偶然古い杖を見つけた。それは彼の人生を永遠に変える出会いとなった。\n\n「これは...」アレックスは杖に触れた瞬間、体中に電流が走るのを感じた。周囲の木々が微かに揺れ、風もないのに葉が舞い上がる。\n\n彼はその日から、自分の中に眠る不思議な力に気づき始めた。",
    order: 0,
  },
  {
    id: uuidv4(),
    title: "第2章: 魔法学校",
    content:
      "招待状は一羽の鳥によって届けられた。\n\n「親愛なるアレックス・ライト様、あなたを魔法学院へご招待できることを光栄に思います」\n\nアレックスは何度も読み返した。これは現実なのか、それとも誰かのいたずらなのか。",
    order: 1,
  },
  {
    id: uuidv4(),
    title: "第3章: 初めての試練",
    content: "",
    order: 2,
  },
];

const mockRelatedEvents: RelatedEvent[] = [
  {
    id: uuidv4(),
    title: "主人公が魔法の杖を発見",
    description: "森の奥で古代の魔法の杖を偶然発見する",
    chapterId: mockChapters[0].id,
  },
  {
    id: uuidv4(),
    title: "魔法学校への入学",
    description: "魔法の才能を認められ、隠された魔法学校への招待状が届く",
    chapterId: mockChapters[1].id,
  },
];

const meta: Meta<typeof WritingPage> = {
  title: "Pages/WritingPage",
  component: WritingPage,
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

type Story = StoryObj<typeof WritingPage>;

// 標準表示（チャプターあり）
export const StandardView: Story = {
  parameters: {
    useWriting: {
      currentProject: mockProject,
      chapters: mockChapters,
      relatedEvents: mockRelatedEvents,
      activeChapter: mockChapters[0],
    },
  },
};

// 空の執筆画面
export const EmptyWriting: Story = {
  parameters: {
    useWriting: {
      currentProject: mockProject,
      chapters: [],
      relatedEvents: [],
      activeChapter: null,
    },
  },
};

// 多数のチャプターがある状態
export const ManyChapters: Story = {
  parameters: {
    useWriting: {
      currentProject: mockProject,
      chapters: [
        ...mockChapters,
        {
          id: uuidv4(),
          title: "第4章: 仲間との出会い",
          content:
            "アレックスは魔法学院で初めての友人を作った。赤髪の少女ルナと、いつも本を読んでいる眼鏡の少年マーカス。彼らとの出会いが、これからの冒険の始まりとなる。",
          order: 3,
        },
        {
          id: uuidv4(),
          title: "第5章: 秘密の部屋",
          content:
            "図書館の奥に隠された扉。三人は好奇心に駆られてその扉を開けた。そこには誰も知らない秘密の部屋があった。",
          order: 4,
        },
        {
          id: uuidv4(),
          title: "第6章: 闇の予兆",
          content:
            "学院の空に黒い雲が渦巻き始めた。何かが起ころうとしている。アレックスは胸の奥に不安を感じていた。",
          order: 5,
        },
      ],
      relatedEvents: [
        ...mockRelatedEvents,
        {
          id: uuidv4(),
          title: "最初の試練",
          description:
            "学校での最初の試練で困難に直面するが、新しい友人の助けを得る",
          chapterId: mockChapters[2].id,
        },
      ],
      activeChapter: mockChapters[0],
    },
  },
};
