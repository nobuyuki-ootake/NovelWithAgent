import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { RecoilRoot } from "recoil";
import WorldBuildingPage from "../../pages/WorldBuildingPage";
import { NovelProject } from "../../types/index";
import { v4 as uuidv4 } from "uuid";

// useWorldBuilding フックのモック
jest.mock("../../hooks/useWorldBuilding", () => {
  return {
    useWorldBuilding: () => ({
      currentProject: mockProject,
      tabValue: mockTabValue,
      mapImageUrl: mockMapImageUrl,
      description: mockDescription,
      history: mockHistory,
      rules: mockRules,
      newRule: "",
      places: mockPlaces,
      freeFields: mockFreeFields,
      newFreeField: { id: "", title: "", content: "" },
      isEditingFreeField: false,
      snackbarOpen: false,
      snackbarMessage: "",
      hasUnsavedChanges: false,
      newPlace: { id: "", name: "", description: "", significance: "" },
      isEditingPlace: false,
      // 社会と文化のタブの状態
      socialStructure: mockSocialStructure,
      government: mockGovernment,
      economy: mockEconomy,
      religion: mockReligion,
      traditions: mockTraditions,
      language: mockLanguage,
      art: mockArt,
      education: mockEducation,
      technology: mockTechnology,
      // 地理と環境のタブの状態
      geography: mockGeography,
      climate: mockClimate,
      flora: mockFlora,
      fauna: mockFauna,
      resources: mockResources,
      settlements: mockSettlements,
      naturalDisasters: mockNaturalDisasters,
      seasonalChanges: mockSeasonalChanges,
      // 歴史と伝説のタブの状態
      historicalEvents: mockHistoricalEvents,
      ancientCivilizations: mockAncientCivilizations,
      myths: mockMyths,
      legends: mockLegends,
      folklore: mockFolklore,
      religions: mockReligions,
      historicalFigures: mockHistoricalFigures,
      conflicts: mockConflicts,
      // 魔法と技術のタブの状態
      magicSystem: mockMagicSystem,
      magicRules: mockMagicRules,
      magicUsers: mockMagicUsers,
      artifacts: mockArtifacts,
      technologyLevel: mockTechnologyLevel,
      inventions: mockInventions,
      energySources: mockEnergySources,
      transportation: mockTransportation,
      // ハンドラ関数
      handleTabChange: () => {},
      handleMapImageUpload: () => {},
      handleSettingChange: () => {},
      handleHistoryChange: () => {},
      handleAddRule: () => {},
      handleDeleteRule: () => {},
      setNewRule: () => {},
      handleFreeFieldChange: () => {},
      handleAddFreeField: () => {},
      handleEditFreeField: () => {},
      handleDeleteFreeField: () => {},
      handlePlaceChange: () => {},
      handleAddPlace: () => {},
      handleEditPlace: () => {},
      handleDeletePlace: () => {},
      handleSave: () => {},
      handleCloseSnackbar: () => {},
      // 社会と文化のタブのハンドラ
      handleSocialStructureChange: () => {},
      handleGovernmentChange: () => {},
      handleEconomyChange: () => {},
      handleReligionChange: () => {},
      handleTraditionsChange: () => {},
      handleLanguageChange: () => {},
      handleArtChange: () => {},
      handleEducationChange: () => {},
      handleTechnologyChange: () => {},
      // 地理と環境のタブのハンドラ
      handleGeographyChange: () => {},
      handleClimateChange: () => {},
      handleFloraChange: () => {},
      handleFaunaChange: () => {},
      handleResourcesChange: () => {},
      handleSettlementsChange: () => {},
      handleNaturalDisastersChange: () => {},
      handleSeasonalChangesChange: () => {},
      // 歴史と伝説のタブのハンドラ
      handleHistoricalEventsChange: () => {},
      handleAncientCivilizationsChange: () => {},
      handleMythsChange: () => {},
      handleLegendsChange: () => {},
      handleFolkloreChange: () => {},
      handleReligionsChange: () => {},
      handleHistoricalFiguresChange: () => {},
      handleConflictsChange: () => {},
      // 魔法と技術のタブのハンドラ
      handleMagicSystemChange: () => {},
      handleMagicRulesChange: () => {},
      handleMagicUsersChange: () => {},
      handleArtifactsChange: () => {},
      handleTechnologyLevelChange: () => {},
      handleInventionsChange: () => {},
      handleEnergySourcesChange: () => {},
      handleTransportationChange: () => {},
    }),
  };
});

// モックデータの初期値
let mockProject: NovelProject | null = null;
let mockTabValue = 0;
let mockMapImageUrl = "";
let mockDescription = "";
let mockHistory = "";
let mockRules: string[] = [];
let mockPlaces: any[] = [];
let mockFreeFields: any[] = [];
// 社会と文化のタブのモックデータ
let mockSocialStructure = "";
let mockGovernment = "";
let mockEconomy = "";
let mockReligion = "";
let mockTraditions = "";
let mockLanguage = "";
let mockArt = "";
let mockEducation = "";
let mockTechnology = "";
// 地理と環境のタブのモックデータ
let mockGeography = "";
let mockClimate = "";
let mockFlora = "";
let mockFauna = "";
let mockResources = "";
let mockSettlements = "";
let mockNaturalDisasters = "";
let mockSeasonalChanges = "";
// 歴史と伝説のタブのモックデータ
let mockHistoricalEvents = "";
let mockAncientCivilizations = "";
let mockMyths = "";
let mockLegends = "";
let mockFolklore = "";
let mockReligions = "";
let mockHistoricalFigures = "";
let mockConflicts = "";
// 魔法と技術のタブのモックデータ
let mockMagicSystem = "";
let mockMagicRules = "";
let mockMagicUsers = "";
let mockArtifacts = "";
let mockTechnologyLevel = "";
let mockInventions = "";
let mockEnergySources = "";
let mockTransportation = "";

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

// プロジェクトなし状態
export const NoProject: Story = {
  parameters: {
    useWorldBuilding: {
      currentProject: null,
    },
  },
};

// 新規プロジェクト（世界観未設定）
export const EmptyWorldBuilding: Story = {
  parameters: {
    useWorldBuilding: {
      currentProject: {
        id: uuidv4(),
        title: "新しい小説プロジェクト",
        createdAt: new Date(),
        updatedAt: new Date(),
        synopsis: "",
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
      },
      tabValue: 0,
      mapImageUrl: "",
      description: "",
      history: "",
      rules: [],
      places: [],
      freeFields: [],
    },
  },
};

// 標準表示（各タブのコンテンツあり）
export const StandardView: Story = {
  parameters: {
    useWorldBuilding: {
      currentProject: {
        id: uuidv4(),
        title: "ファンタジー小説",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-10"),
        synopsis: "魔法の世界を冒険する若者の物語",
        plot: [],
        characters: [],
        worldBuilding: {
          id: uuidv4(),
          setting:
            "魔法とドラゴンが存在する中世ファンタジー世界「アルクディア」は、七つの王国が互いに同盟と対立を繰り返す世界。魔法は日常的に使われているが、その力は減衰しつつあり、古代魔法は失われている。",
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
            {
              id: uuidv4(),
              name: "スカイタワー魔法学院",
              description: "空に浮かぶ塔の上に建てられた魔法使いの養成学校。",
              significance: "主人公が魔法を学ぶ場所。重要な出会いがある。",
            },
          ],
          cultures: [],
          history:
            "五百年前の大魔法戦争で古代文明は崩壊し、現在の七王国体制が確立した。古代の魔法技術は失われ、伝説となっている。",
          mapImageUrl: "https://example.com/fantasy-map.jpg",
          freeFields: [
            {
              id: uuidv4(),
              title: "魔法の種類",
              content:
                "元素魔法、召喚魔法、変成魔法、幻影魔法、治癒魔法の5つの系統がある。",
            },
          ],
          socialStructure:
            "貴族、自由民、農民の三階級社会。魔法使いは階級と関係なく特別な地位を持つ。",
          government:
            "七つの王国それぞれが君主制。王国連合評議会が全体の調整を行う。",
          economy: "農業と魔法工芸品の取引が主要産業。魔力結晶は高価な交易品。",
          religion:
            "自然崇拝と先祖崇拝が主流。「七神」への信仰が広く浸透している。",
          traditions:
            "春分の日に行われる「光の祭り」は最大の祝祭。魔法の才能が現れる子供の祝福式がある。",
          language:
            "共通語の他に、古代魔法語、エルフ語、ドワーフ語などがある。",
          art: "魔法を用いた幻影芸術が発達。歌や物語を通じて歴史を伝承する吟遊詩人が重要な役割を持つ。",
          education: "基本教育は寺院で行われる。魔法使いは専門の学院で学ぶ。",
          technology:
            "魔法と職人技術が融合した独自の技術発展。蒸気機関に魔法を組み合わせた装置が発明されている。",
          geography:
            "北部の山岳地帯、中央の平原地帯、南部の森林地帯に大きく分かれる。西に大海、東に砂漠がある。",
          climate:
            "四季がはっきりしており、北部は寒冷、南部は温暖。魔法の影響で局所的な気候変動が起こることもある。",
          flora:
            "魔力を帯びた植物が存在し、特に「銀葉の木」は魔法薬の材料として珍重される。",
          fauna:
            "ドラゴン、グリフォン、ユニコーンなどの魔法生物が生息。一般的な動物も魔力の影響を受けている。",
          resources:
            "魔力結晶、魔法金属「ミスリル」、薬草が重要資源。山岳地帯では鉱物資源が豊富。",
          settlements:
            "七王国の首都がそれぞれあり、交易都市、魔法都市、港町など特色のある都市が点在している。",
          naturalDisasters:
            "「魔力嵐」と呼ばれる魔法エネルギーの乱れによる自然災害が発生することがある。",
          seasonalChanges:
            "「魔法の季」と呼ばれる魔力が高まる時期がある。この時期は魔法の効果が強化される。",
          historicalEvents:
            "500年前：大魔法戦争、300年前：七王国同盟の成立、100年前：最後のドラゴン王の死",
          ancientCivilizations:
            "「魔法帝国アゾリア」は高度な魔法文明を持っていたが、大魔法戦争で滅亡した。",
          myths:
            "世界の創造神話では、七人の神が力を合わせて世界を作ったとされる。",
          legends:
            "「最初の魔法使い」エルダリオンの伝説は広く知られている。彼の遺した七つの魔法書は今も探索の対象。",
          folklore:
            "村々には「森の精霊」や「泉の女神」などの民間伝承がある。子供をさらう「影取り」の話は子供のしつけに使われる。",
          religions:
            "自然崇拝の「風の教会」と魔法崇拝の「魔道結社」の二大宗教が対立している。",
          historicalFigures:
            "初代アルマリア王のアルドゥイン、魔法革命を起こしたマギウス、七王国を統一したエレナ女王など。",
          conflicts:
            "魔法資源をめぐる「百年魔法戦争」、異世界からの侵略「影の侵攻」など。",
          magicSystem:
            "魔力を操ることで自然法則を変化させる体系。詠唱、触媒、魔法陣の三要素が基本。",
          magicRules:
            "等価交換の法則が基本。強力な魔法ほど代償が大きい。魔法は使用者の意思と感情に影響される。",
          magicUsers:
            "血統による先天的な才能と修練による後天的な技術の両方が必要。魔法学院で体系的に学ぶ。",
          artifacts:
            "「七大魔法器」は伝説の魔法使いが作った強力な魔法アイテム。各王国が1つずつ所有している。",
          technologyLevel:
            "魔法と機械の融合技術「魔導機械」が発達。照明、交通、通信などに魔法が活用されている。",
          inventions:
            "瞬間移動門、魔法通信鏡、飛行船、魔法動力車など魔法を応用した発明品が多数ある。",
          energySources:
            "魔力結晶、元素の力、生命力などから魔法エネルギーを引き出す技術がある。",
          transportation:
            "魔法の力で動く馬車、空を飛ぶ絨毯、ドラゴンの背に乗る騎士など多様な移動手段がある。",
        },
        timeline: [],
        chapters: [],
        feedback: [],
      },
      tabValue: 0,
      mapImageUrl: "https://example.com/fantasy-map.jpg",
      description:
        "魔法とドラゴンが存在する中世ファンタジー世界「アルクディア」は、七つの王国が互いに同盟と対立を繰り返す世界。魔法は日常的に使われているが、その力は減衰しつつあり、古代魔法は失われている。",
      history:
        "五百年前の大魔法戦争で古代文明は崩壊し、現在の七王国体制が確立した。古代の魔法技術は失われ、伝説となっている。",
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
        {
          id: uuidv4(),
          name: "スカイタワー魔法学院",
          description: "空に浮かぶ塔の上に建てられた魔法使いの養成学校。",
          significance: "主人公が魔法を学ぶ場所。重要な出会いがある。",
        },
      ],
      freeFields: [
        {
          id: uuidv4(),
          title: "魔法の種類",
          content:
            "元素魔法、召喚魔法、変成魔法、幻影魔法、治癒魔法の5つの系統がある。",
        },
      ],
      // 社会と文化
      socialStructure:
        "貴族、自由民、農民の三階級社会。魔法使いは階級と関係なく特別な地位を持つ。",
      government:
        "七つの王国それぞれが君主制。王国連合評議会が全体の調整を行う。",
      economy: "農業と魔法工芸品の取引が主要産業。魔力結晶は高価な交易品。",
      religion:
        "自然崇拝と先祖崇拝が主流。「七神」への信仰が広く浸透している。",
      traditions:
        "春分の日に行われる「光の祭り」は最大の祝祭。魔法の才能が現れる子供の祝福式がある。",
      language: "共通語の他に、古代魔法語、エルフ語、ドワーフ語などがある。",
      art: "魔法を用いた幻影芸術が発達。歌や物語を通じて歴史を伝承する吟遊詩人が重要な役割を持つ。",
      education: "基本教育は寺院で行われる。魔法使いは専門の学院で学ぶ。",
      technology:
        "魔法と職人技術が融合した独自の技術発展。蒸気機関に魔法を組み合わせた装置が発明されている。",
      // 地理と環境
      geography:
        "北部の山岳地帯、中央の平原地帯、南部の森林地帯に大きく分かれる。西に大海、東に砂漠がある。",
      climate:
        "四季がはっきりしており、北部は寒冷、南部は温暖。魔法の影響で局所的な気候変動が起こることもある。",
      flora:
        "魔力を帯びた植物が存在し、特に「銀葉の木」は魔法薬の材料として珍重される。",
      fauna:
        "ドラゴン、グリフォン、ユニコーンなどの魔法生物が生息。一般的な動物も魔力の影響を受けている。",
      resources:
        "魔力結晶、魔法金属「ミスリル」、薬草が重要資源。山岳地帯では鉱物資源が豊富。",
      settlements:
        "七王国の首都がそれぞれあり、交易都市、魔法都市、港町など特色のある都市が点在している。",
      naturalDisasters:
        "「魔力嵐」と呼ばれる魔法エネルギーの乱れによる自然災害が発生することがある。",
      seasonalChanges:
        "「魔法の季」と呼ばれる魔力が高まる時期がある。この時期は魔法の効果が強化される。",
      // 歴史と伝説
      historicalEvents:
        "500年前：大魔法戦争、300年前：七王国同盟の成立、100年前：最後のドラゴン王の死",
      ancientCivilizations:
        "「魔法帝国アゾリア」は高度な魔法文明を持っていたが、大魔法戦争で滅亡した。",
      myths: "世界の創造神話では、七人の神が力を合わせて世界を作ったとされる。",
      legends:
        "「最初の魔法使い」エルダリオンの伝説は広く知られている。彼の遺した七つの魔法書は今も探索の対象。",
      folklore:
        "村々には「森の精霊」や「泉の女神」などの民間伝承がある。子供をさらう「影取り」の話は子供のしつけに使われる。",
      religions:
        "自然崇拝の「風の教会」と魔法崇拝の「魔道結社」の二大宗教が対立している。",
      historicalFigures:
        "初代アルマリア王のアルドゥイン、魔法革命を起こしたマギウス、七王国を統一したエレナ女王など。",
      conflicts:
        "魔法資源をめぐる「百年魔法戦争」、異世界からの侵略「影の侵攻」など。",
      // 魔法と技術
      magicSystem:
        "魔力を操ることで自然法則を変化させる体系。詠唱、触媒、魔法陣の三要素が基本。",
      magicRules:
        "等価交換の法則が基本。強力な魔法ほど代償が大きい。魔法は使用者の意思と感情に影響される。",
      magicUsers:
        "血統による先天的な才能と修練による後天的な技術の両方が必要。魔法学院で体系的に学ぶ。",
      artifacts:
        "「七大魔法器」は伝説の魔法使いが作った強力な魔法アイテム。各王国が1つずつ所有している。",
      technologyLevel:
        "魔法と機械の融合技術「魔導機械」が発達。照明、交通、通信などに魔法が活用されている。",
      inventions:
        "瞬間移動門、魔法通信鏡、飛行船、魔法動力車など魔法を応用した発明品が多数ある。",
      energySources:
        "魔力結晶、元素の力、生命力などから魔法エネルギーを引き出す技術がある。",
      transportation:
        "魔法の力で動く馬車、空を飛ぶ絨毯、ドラゴンの背に乗る騎士など多様な移動手段がある。",
    },
  },
};

// タブ切り替え表示（ルールタブ）
export const RulesTab: Story = {
  parameters: {
    useWorldBuilding: {
      ...StandardView.parameters?.useWorldBuilding,
      tabValue: 2,
    },
  },
};

// タブ切り替え表示（地名タブ）
export const PlacesTab: Story = {
  parameters: {
    useWorldBuilding: {
      ...StandardView.parameters?.useWorldBuilding,
      tabValue: 3,
    },
  },
};

// モバイル表示
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    useWorldBuilding: {
      ...StandardView.parameters?.useWorldBuilding,
    },
  },
};

// 未保存の変更がある状態
export const UnsavedChanges: Story = {
  parameters: {
    useWorldBuilding: {
      ...StandardView.parameters?.useWorldBuilding,
      hasUnsavedChanges: true,
    },
  },
};
