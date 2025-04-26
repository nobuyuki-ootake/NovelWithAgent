import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { RecoilRoot } from "recoil";
import TimelinePage from "../../pages/TimelinePage";
import { TimelineItem, TimelineGroup } from "../../hooks/useTimeline";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

// useTimeline フックのモック
jest.mock("../../hooks/useTimeline", () => {
  return {
    useTimeline: () => ({
      currentProject: mockCurrentProject,
      timelineEvents: mockTimelineEvents,
      characters: mockCharacters,
      places: mockPlaces,
      timelineItems: mockTimelineItems,
      timelineGroups: mockTimelineGroups,
      timelineSettings: mockTimelineSettings,
      settingsDialogOpen: mockSettingsDialogOpen,
      newEvent: mockNewEvent,
      dialogOpen: mockDialogOpen,
      isEditing: mockIsEditing,
      currentEventId: "",
      snackbarOpen: mockSnackbarOpen,
      snackbarMessage: mockSnackbarMessage,
      hasUnsavedChanges: mockHasUnsavedChanges,
      safeMinY: mockSafeMinY,
      safeMaxY: mockSafeMaxY,
      dateArray: mockDateArray,
      handleOpenDialog: () => {},
      handleOpenSettingsDialog: () => {},
      handleCloseSettingsDialog: () => {},
      handleSaveSettings: () => {},
      handleSettingsChange: () => {},
      handleCloseDialog: () => {},
      handleEventChange: () => {},
      handleCharactersChange: () => {},
      handlePlacesChange: () => {},
      handleSaveEvent: () => {},
      handleEventClick: () => {},
      handleSave: () => {},
      handleCloseSnackbar: () => {},
      getCharacterName: (id: string) => {
        const character = mockCharacters.find((c) => c.id === id);
        return character ? character.name : "不明なキャラクター";
      },
      getPlaceName: (id: string) => {
        const place = mockPlaces.find((p) => p.id === id);
        return place ? place.name : "不明な場所";
      },
      calculateEventPosition: (placeId: string, dateValue: number) => {
        const placeIndex = mockTimelineGroups.findIndex(
          (g) => g.id === placeId
        );
        const xPos = placeIndex !== -1 ? placeIndex : 0;
        const dateRange = mockSafeMaxY - mockSafeMinY;
        const yPos = (dateValue - mockSafeMinY) / dateRange;
        return { xPos, yPos: 1 - yPos };
      },
      createEventFromPosition: () => {},
    }),
  };
});

// モックデータ
let mockCurrentProject = null;
let mockTimelineEvents = [];
let mockCharacters = [
  {
    id: "char1",
    name: "山田太郎",
    role: "protagonist" as const,
    description: "物語の主人公",
    background: "",
    motivation: "",
    traits: [],
    relationships: [],
  },
  {
    id: "char2",
    name: "佐藤花子",
    role: "supporting" as const,
    description: "主人公の幼馴染",
    background: "",
    motivation: "",
    traits: [],
    relationships: [],
  },
  {
    id: "char3",
    name: "黒川剛",
    role: "antagonist" as const,
    description: "主人公のライバル",
    background: "",
    motivation: "",
    traits: [],
    relationships: [],
  },
];
let mockPlaces = [
  {
    id: "place1",
    name: "主人公の家",
    description: "物語の主人公が住む家",
    significance: "主人公の拠点",
  },
  {
    id: "place2",
    name: "学校",
    description: "主人公が通う学校",
    significance: "多くの出来事が起こる主要な舞台",
  },
  {
    id: "place3",
    name: "公園",
    description: "主人公たちがよく集まる公園",
    significance: "重要な出会いや別れの場所",
  },
];
let mockTimelineGroups: TimelineGroup[] = [
  { id: "unassigned", title: "未分類" },
  { id: "place1", title: "主人公の家" },
  { id: "place2", title: "学校" },
  { id: "place3", title: "公園" },
];
let mockTimelineSettings = {
  startDate: "2023-01-01",
};
let mockSettingsDialogOpen = false;
let mockNewEvent = {
  id: "",
  title: "",
  description: "",
  date: "",
  relatedCharacters: [],
  relatedPlaces: [],
};
let mockDialogOpen = false;
let mockIsEditing = false;
let mockSnackbarOpen = false;
let mockSnackbarMessage = "";
let mockHasUnsavedChanges = false;
let mockSafeMinY = moment("2023-01-01").valueOf();
let mockSafeMaxY = moment("2023-01-31").valueOf();
let mockDateArray = Array.from({ length: 11 }).map((_, i) => {
  const date = moment("2023-01-01")
    .add(i * 3, "days")
    .valueOf();
  return {
    date,
    label: moment(date).format("YYYY/MM/DD"),
  };
});
let mockTimelineItems: TimelineItem[] = [];

const meta: Meta<typeof TimelinePage> = {
  title: "Pages/TimelinePage",
  component: TimelinePage,
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
type Story = StoryObj<typeof TimelinePage>;

// イベントが存在しない状態
export const NoEvents: Story = {
  parameters: {
    useTimeline: {
      currentProject: {
        id: uuidv4(),
        title: "サンプルプロジェクト",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
        synopsis: "サンプルプロジェクトのあらすじ",
        plot: [],
        characters: mockCharacters,
        worldBuilding: {
          id: uuidv4(),
          setting: "",
          rules: [],
          places: mockPlaces,
          cultures: [],
          history: "",
        },
        timeline: [],
        chapters: [],
        feedback: [],
      },
      timelineItems: [],
      timelineGroups: mockTimelineGroups,
      characters: mockCharacters,
      places: mockPlaces,
      timelineSettings: mockTimelineSettings,
      dateArray: mockDateArray,
      hasUnsavedChanges: false,
    },
  },
};

// イベントが存在する状態
export const WithEvents: Story = {
  parameters: {
    useTimeline: {
      currentProject: {
        id: uuidv4(),
        title: "サンプルプロジェクト",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
        synopsis: "サンプルプロジェクトのあらすじ",
        plot: [],
        characters: mockCharacters,
        worldBuilding: {
          id: uuidv4(),
          setting: "",
          rules: [],
          places: mockPlaces,
          cultures: [],
          history: "",
        },
        timeline: [
          {
            id: uuidv4(),
            title: "物語の開始",
            description: "主人公が冒険に出発する",
            date: "2023-01-05",
            relatedCharacters: ["char1"],
            relatedPlaces: ["place1"],
          },
          {
            id: uuidv4(),
            title: "ライバルとの出会い",
            description: "主人公が学校でライバルと出会う",
            date: "2023-01-10",
            relatedCharacters: ["char1", "char3"],
            relatedPlaces: ["place2"],
          },
          {
            id: uuidv4(),
            title: "親友との約束",
            description: "主人公が親友と重要な約束をする",
            date: "2023-01-15",
            relatedCharacters: ["char1", "char2"],
            relatedPlaces: ["place3"],
          },
        ],
        chapters: [],
        feedback: [],
      },
      timelineItems: [
        {
          id: uuidv4(),
          placeId: "place1",
          placeName: "主人公の家",
          title: "物語の開始",
          date: "2023-01-05",
          dateValue: moment("2023-01-05").valueOf(),
          description: "主人公が冒険に出発する",
          relatedCharacters: ["char1"],
          relatedCharacterNames: "山田太郎",
        },
        {
          id: uuidv4(),
          placeId: "place2",
          placeName: "学校",
          title: "ライバルとの出会い",
          date: "2023-01-10",
          dateValue: moment("2023-01-10").valueOf(),
          description: "主人公が学校でライバルと出会う",
          relatedCharacters: ["char1", "char3"],
          relatedCharacterNames: "山田太郎, 黒川剛",
        },
        {
          id: uuidv4(),
          placeId: "place3",
          placeName: "公園",
          title: "親友との約束",
          date: "2023-01-15",
          dateValue: moment("2023-01-15").valueOf(),
          description: "主人公が親友と重要な約束をする",
          relatedCharacters: ["char1", "char2"],
          relatedCharacterNames: "山田太郎, 佐藤花子",
        },
      ],
      timelineGroups: mockTimelineGroups,
      characters: mockCharacters,
      places: mockPlaces,
      timelineSettings: mockTimelineSettings,
      dateArray: mockDateArray,
      hasUnsavedChanges: false,
    },
  },
};

// イベント追加ダイアログが開いている状態
export const WithOpenDialog: Story = {
  parameters: {
    useTimeline: {
      ...WithEvents.parameters?.useTimeline,
      dialogOpen: true,
      isEditing: false,
      newEvent: {
        id: "",
        title: "",
        description: "",
        date: "2023-01-20",
        relatedCharacters: [],
        relatedPlaces: [],
      },
    },
  },
};

// イベント編集ダイアログが開いている状態
export const WithEditDialog: Story = {
  parameters: {
    useTimeline: {
      ...WithEvents.parameters?.useTimeline,
      dialogOpen: true,
      isEditing: true,
      newEvent: {
        id: uuidv4(),
        title: "親友との約束",
        description: "主人公が親友と重要な約束をする",
        date: "2023-01-15",
        relatedCharacters: ["char1", "char2"],
        relatedPlaces: ["place3"],
      },
    },
  },
};

// 設定ダイアログが開いている状態
export const WithSettingsDialog: Story = {
  parameters: {
    useTimeline: {
      ...WithEvents.parameters?.useTimeline,
      settingsDialogOpen: true,
    },
  },
};

// 未保存の変更がある状態
export const WithUnsavedChanges: Story = {
  parameters: {
    useTimeline: {
      ...WithEvents.parameters?.useTimeline,
      hasUnsavedChanges: true,
    },
  },
};

// スナックバーが表示されている状態
export const WithSnackbar: Story = {
  parameters: {
    useTimeline: {
      ...WithEvents.parameters?.useTimeline,
      snackbarOpen: true,
      snackbarMessage: "タイムラインを保存しました",
    },
  },
};

// モバイル表示
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    useTimeline: {
      ...WithEvents.parameters?.useTimeline,
    },
  },
};
