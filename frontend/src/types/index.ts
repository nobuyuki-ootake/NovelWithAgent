export interface NovelProject {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  synopsis: string;
  plot: PlotElement[];
  characters: Character[];
  worldBuilding: WorldBuilding;
  timeline: TimelineEvent[];
  chapters: Chapter[];
  feedback: Feedback[];
  definedCharacterStatuses?: CharacterStatus[];
}

// プロット要素の型定義
export interface PlotElement {
  id: string;
  title: string;
  description: string;
  order: number;
  status: "決定" | "検討中";
}

// キャラクターの特性（traits）の型定義
export interface CharacterTrait {
  id: string;
  name: string;
  value: string;
}

// キャラクター間の関係の型定義（UI用）
export interface Relationship {
  id: string;
  targetCharacterId: string;
  type: string;
  description: string;
}

// キャラクターの状態（ステータス）型
export interface CharacterStatus {
  id: string;
  name: string; // 例: 生存, 死亡, 毒, やけど, カスタム名
  type: "life" | "abnormal" | "custom";
  mobility: "normal" | "slow" | "impossible"; // 歩行可能/鈍足/不可
  description?: string;
}

// キャラクターの型定義
export interface Character {
  id: string;
  name: string;
  role: "protagonist" | "antagonist" | "supporting";
  gender?: string;
  birthDate?: string;
  description: string;
  background: string;
  motivation: string;
  traits: CharacterTrait[];
  relationships: Relationship[];
  imageUrl?: string;
  customFields?: CustomField[];
  statuses?: CharacterStatus[];
}

// バッチ処理結果の型定義
export interface BatchProcessResult {
  batchResponse?: boolean;
  elements?: Array<{
    response: string;
    agentUsed: string;
    steps: Array<unknown>;
    elementName?: string;
    elementType?: string;
  }>;
  totalElements?: number;
}

// 世界観設定の型定義
export interface WorldBuilding {
  id: string;
  setting: string;
  rules: RuleElement[];
  places: PlaceElement[];
  cultures: CultureElement[];
  geographyEnvironment: GeographyEnvironmentElement[];
  historyLegend: HistoryLegendElement[];
  magicTechnology: MagicTechnologyElement[];
  freeText: FreeTextElement[];
  stateDefinition: StateDefinitionElement[];
  custom: CustomElement[];
  history: string;
  mapImageUrl?: string;
  freeFields?: WorldBuildingFreeField[];
  timelineSettings?: {
    startDate: string;
  };
  // 社会と文化のタブ用フィールド
  socialStructure?: string;
  government?: string;
  economy?: string;
  religion?: string;
  traditions?: string;
  language?: string;
  art?: string;
  education?: string;
  technology?: string;

  // 地理と環境のタブ用フィールド
  geography?: string;
  climate?: string;
  flora?: string;
  fauna?: string;
  resources?: string;
  settlements?: string;
  naturalDisasters?: string;
  seasonalChanges?: string;

  // 歴史と伝説のタブ用フィールド
  historicalEvents?: string;
  ancientCivilizations?: string;
  myths?: string;
  legends?: string;
  folklore?: string;
  religions?: string;
  historicalFigures?: string;
  conflicts?: string;

  // 魔法と技術のタブ用フィールド
  magicSystem?: string;
  magicRules?: string;
  magicUsers?: string;
  artifacts?: string;
  technologyLevel?: string;
  inventions?: string;
  energySources?: string;
  transportation?: string;
}

// ルール、文化、場所の型定義は worldBuilding 内の型を使用

// タイムラインイベントの型定義
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  relatedCharacters: string[];
  relatedPlaces: string[];
  order: number;
  postEventCharacterStatuses?: {
    [characterId: string]: CharacterStatus[];
  };
}

// 章の型定義
export interface Chapter {
  id: string;
  title: string;
  synopsis: string;
  content: string;
  order: number;
  scenes: Scene[];
  relatedEvents?: string[]; // 章に関連するタイムラインイベントのID配列
}

// シーンの型定義
export interface Scene {
  id: string;
  title: string;
  description: string;
  content: string;
  order: number;
  characters: string[];
  location: string;
  timeOfDay: string;
}

// フィードバックの型定義
export interface Feedback {
  id: string;
  type: "critique" | "suggestion" | "reaction";
  content: string;
  targetId?: string; // 章やシーンなどの対象ID
  targetType?: "chapter" | "scene" | "character" | "plot" | "entire";
  createdAt: Date;
}

// カスタムフィールドの型定義
export interface CustomField {
  id: string;
  name: string;
  value: string;
}

// タイムライングループの型定義
export interface TimelineGroup {
  id: string;
  name: string;
  color: string;
}

// タイムライン設定の型定義
export interface TimelineSettings {
  startDate: Date;
  endDate: Date;
  zoomLevel: number;
}

/**
 * プロジェクトの状態を表す型 (project.ts オリジナル)
 */
export type ProjectStatus = "active" | "archived" | "template";

/**
 * プロジェクトのメタデータ (project.ts オリジナル)
 */
export interface ProjectMetadata {
  version: string;
  tags?: string[];
  genre?: string[];
  targetAudience?: string;
  wordCountGoal?: number;
  status: ProjectStatus;
  lastBackupDate?: string;
}

/**
 * タイムラインイベントの重要度 (project.ts オリジナル)
 */
export type EventImportance = 1 | 2 | 3 | 4 | 5;

/**
 * 章の状態 (project.ts オリジナル)
 */
export type ChapterStatus = "draft" | "inProgress" | "review" | "completed";

/**
 * セクション（章の中の小見出し） (project.ts オリジナル)
 */
export interface Section {
  id: string;
  title: string;
  content: string;
  order: number;
}

/**
 * プロジェクト（小説の一つの作品） (project.ts オリジナル)
 * NovelProject と内容が近いため、どちらかに寄せるか検討。一旦両方定義。
 */
export interface Project {
  id: string;
  name: string; // NovelProject の title と対応か
  description?: string; // NovelProject の synopsis と対応か
  createdAt: string; // NovelProject では Date 型
  updatedAt: string; // NovelProject では Date 型
  characters: Character[];
  worldBuilding: WorldBuilding;
  timeline: TimelineEvent[];
  chapters: Chapter[];
  metadata: ProjectMetadata;
  notes?: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    tags?: string[];
  }[];
}

/**
 * 世界観要素の基本型定義
 */
export interface BaseWorldBuildingElement {
  id: string;
  name: string;
  type: string;
  originalType: string;
  description: string;
  features: string;
  importance: string;
  relations: string;
}

/**
 * ワールドマップの型定義
 */
export interface WorldmapElement extends BaseWorldBuildingElement {
  img: string;
}

/**
 * 世界観設定の型定義
 */
export interface SettingElement extends BaseWorldBuildingElement {
  img: string;
}

/**
 * ルール要素の型定義
 */
export interface RuleElement extends BaseWorldBuildingElement {
  name: string;
  description: string;
  features: string;
  importance: string;
  impact: string;
  exceptions: string;
  origin: string;
  relations: string;
}

/**
 * 場所要素の型定義
 */
export interface PlaceElement extends BaseWorldBuildingElement {
  name: string;
  description: string;
  features: string;
  importance: string;
  location: string;
  population: string;
  culturalFeatures: string;
  relations: string;
}

/**
 * 文化要素の型定義
 */
export interface CultureElement extends BaseWorldBuildingElement {
  name: string;
  description: string;
  features: string;
  importance: string;
  customText: string;
  beliefs: string;
  history: string;
  socialStructure: string;
  values: string[];
  customsArray: string[];
  relations: string;
}

/**
 * 自然環境の型定義
 */
export interface GeographyEnvironmentElement extends BaseWorldBuildingElement {
  name: string;
}

/**
 * 歴史伝説要素の型定義
 */
export interface HistoryLegendElement extends BaseWorldBuildingElement {
  name: string;
  description: string;
  features: string;
  importance: string;
  period: string;
  significantEvents: string;
  consequences: string;
  relations: string;
}

/**
 * 技術要素の型定義
 */
export interface MagicTechnologyElement extends BaseWorldBuildingElement {
  name: string;
  description: string;
  features: string;
  importance: string;
  functionality: string;
  development: string;
  impact: string;
  relations: string;
}

/**
 * 自由記述要素の型定義
 */
export interface FreeTextElement extends BaseWorldBuildingElement {
  name: string;
  description: string;
  features: string;
  importance: string;
  relations: string;
}

/**
 * 状態異常の型定義
 */
export interface StateDefinitionElement extends BaseWorldBuildingElement {
  name: string;
  description: string;
  features: string;
  importance: string;
  relations: string;
}

/**
 * 追加要素の型定義
 */
export interface CustomElement extends BaseWorldBuildingElement {
  occasion: string;
  participants: string;
  significance: string;
}

/**
 * 世界観の自由入力フィールド
 */
export interface WorldBuildingFreeField {
  id: string;
  title: string;
  content: string;
}

/**
 * 世界観要素の型（すべての要素型の統合）
 */
export type WorldBuildingElement =
  | WorldmapElement
  | SettingElement
  | RuleElement
  | PlaceElement
  | CultureElement
  | GeographyEnvironmentElement
  | HistoryLegendElement
  | MagicTechnologyElement
  | FreeTextElement
  | StateDefinitionElement
  | CustomElement
  | WorldBuildingFreeField;

/**
 * 世界観要素の種類
 */
export enum WorldBuildingElementType {
  WORLDMAP = "worldmap",
  SETTING = "setting",
  RULE = "rule",
  PLACE = "place",
  SOCIETY_CULTURE = "society_culture",
  GEOGRAPHY_ENVIRONMENT = "geography_environment",
  HISTORY_LEGEND = "history_legend",
  MAGIC_TECHNOLOGY = "magic_technology",
  FREE_TEXT = "free_text",
  STATE_DEFINITION = "state_definition",
}

// 日本語の表示名
export const ElementTypeDisplayNames: Record<string, string> = {
  [WorldBuildingElementType.WORLDMAP]: "ワールドマップ",
  [WorldBuildingElementType.SETTING]: "世界観設定",
  [WorldBuildingElementType.RULE]: "ルール",
  [WorldBuildingElementType.PLACE]: "地名",
  [WorldBuildingElementType.SOCIETY_CULTURE]: "社会と文化",
  [WorldBuildingElementType.GEOGRAPHY_ENVIRONMENT]: "地理と環境",
  [WorldBuildingElementType.HISTORY_LEGEND]: "歴史と伝説",
  [WorldBuildingElementType.MAGIC_TECHNOLOGY]: "魔法と技術",
  [WorldBuildingElementType.FREE_TEXT]: "自由記述欄",
  [WorldBuildingElementType.STATE_DEFINITION]: "状態定義",
};

/**
 * 世界観構築カテゴリの型定義
 */
export interface WorldBuildingCategory {
  id: string;
  label: string;
  description?: string;
  iconName?: string;
  index: number;
}

// タブ定義配列
export const worldBuildingTabs: WorldBuildingCategory[] = [
  {
    id: "worldmap",
    label: "ワールドマップ",
    index: 0,
    iconName: "map",
    description: "世界の地図や地理的な関係を視覚的に表現します。",
  },
  {
    id: "setting",
    label: "世界観設定",
    index: 1,
    iconName: "history_edu",
    description: "世界の基本設定や歴史的背景、重要な事件などを記述します。",
  },
  {
    id: "rule",
    label: "ルール",
    index: 2,
    iconName: "auto_fix_high",
    description:
      "この世界の物理法則、魔法のルール、特殊能力の制限などを定義します。",
  },
  {
    id: "place",
    label: "地名",
    index: 3,
    iconName: "location_on",
    description: "物語の舞台となる場所や地理的特徴を定義します。",
  },
  {
    id: "culture",
    label: "社会と文化",
    index: 4,
    iconName: "groups",
    description:
      "異なる文化、社会構造、言語、宗教、伝統、慣習などを定義します。",
  },
  {
    id: "geography_environment",
    label: "地理と環境",
    index: 5,
    iconName: "terrain",
    description: "世界の自然環境、気候、生態系、種族や生物について定義します。",
  },
  {
    id: "history_legend",
    label: "歴史と伝説",
    index: 6,
    iconName: "auto_stories",
    description: "世界の歴史的な出来事、神話、伝説などを定義します。",
  },
  {
    id: "magic_technology",
    label: "魔法と技術",
    index: 7,
    iconName: "auto_awesome",
    description: "魔法システム、科学技術、発明品などを定義します。",
  },
  {
    id: "free_text",
    label: "自由記述欄",
    index: 8,
    iconName: "edit_note",
    description: "その他の世界観要素を自由に記述できます。",
  },
  {
    id: "state_definition",
    label: "状態定義",
    index: 9,
    iconName: "settings",
    description: "世界の状態や設定に関する詳細な定義を行います。",
  },
];

/**
 * 順序付きカテゴリ配列を取得するヘルパー関数
 */
export const getOrderedCategories = (): WorldBuildingCategory[] => {
  return [...worldBuildingTabs].sort((a, b) => a.index - b.index);
};

/**
 * カテゴリIDからカテゴリ情報を取得するヘルパー関数
 */
export const getCategoryById = (
  id: string
): WorldBuildingCategory | undefined => {
  return worldBuildingTabs.find((category) => category.id === id);
};

/**
 * カテゴリIDからUIのタブインデックスを取得するマッピング関数
 */
export const getCategoryTabIndex = (categoryId: string): number => {
  const category = getCategoryById(categoryId);
  return category ? category.index : -1;
};

/**
 * 世界観API応答データの基本型
 */
export interface WorldBuildingElementData {
  id?: string;
  name: string;
  type?: string;
  originalType?: string;
  description?: string;
  features?: string;
  importance?: string;
  significance?: string;
  location?: string;
  population?: string;
  culturalFeatures?: string;
  customText?: string; // 文字列型のcustoms
  beliefs?: string;
  history?: string;
  impact?: string;
  exceptions?: string;
  origin?: string;
  period?: string;
  significantEvents?: string;
  consequences?: string;
  moralLesson?: string;
  characters?: string;
  functionality?: string;
  development?: string;
  system?: string;
  limitations?: string;
  practitioners?: string;
  deities?: string;
  practices?: string;
  occasion?: string;
  participants?: string;
  terrain?: string;
  resources?: string;
  conditions?: string;
  seasons?: string;
  speakers?: string;
  characteristics?: string;
  writingSystem?: string;
  attributes?: string;
  socialStructure?: string;
  values?: string[];
  customsArray?: string[]; // 配列型のcustoms
  rawData?: Record<string, unknown>;
  relations?: string | { name: string; description: string }[];
  img?: string;
}

/**
 * タイプ文字列から適切な世界観要素型を取得するユーティリティ関数
 * @param type 世界観要素の種類
 * @param data 要素データ
 * @returns 適切な型を持つ世界観要素
 */
export function createTypedWorldBuildingElement(
  type: string,
  data: WorldBuildingElementData
): WorldBuildingElement {
  // 基本フィールドの設定
  const baseElement: BaseWorldBuildingElement = {
    id: data.id || crypto.randomUUID(),
    name: data.name || "",
    type: type,
    originalType: data.originalType || type,
    description: data.description || "",
    features: data.features || "",
    importance: data.importance || data.significance || "",
    relations:
      typeof data.relations === "string"
        ? data.relations
        : Array.isArray(data.relations)
        ? data.relations.map((r) => `${r.name}: ${r.description}`).join("\n")
        : "",
  };

  // タイプに基づいて拡張フィールドを設定
  switch (type.toLowerCase()) {
    case "worldmap":
      return {
        ...baseElement,
        img: data.img || "",
      } as WorldmapElement;

    case "setting":
      return {
        ...baseElement,
        img: data.img || "",
      } as SettingElement;

    case "rule":
      return {
        ...baseElement,
        impact: data.impact || "",
        exceptions: data.exceptions || "",
        origin: data.origin || "",
      } as RuleElement;

    case "place":
      return {
        ...baseElement,
        location: data.location || "",
        population: data.population || "",
        culturalFeatures: data.culturalFeatures || "",
      } as PlaceElement;

    case "culture":
      return {
        ...baseElement,
        customText: data.customText || "",
        beliefs: data.beliefs || "",
        history: data.history || "",
        socialStructure: data.socialStructure || "",
        values: Array.isArray(data.values) ? data.values : [],
      } as CultureElement;

    case "geography_environment":
      return {
        ...baseElement,
        period: data.period || "",
        significantEvents: data.significantEvents || "",
        consequences: data.consequences || "",
      } as GeographyEnvironmentElement;

    case "history_legend":
      return {
        ...baseElement,
        period: data.period || "",
        significantEvents: data.significantEvents || "",
        consequences: data.consequences || "",
      } as HistoryLegendElement;

    case "magic_technology":
      return {
        ...baseElement,
        functionality: data.functionality || "",
        development: data.development || "",
        impact: data.impact || "",
      } as MagicTechnologyElement;

    case "free_text":
      return {
        ...baseElement,
        customText: data.customText || "",
      } as FreeTextElement;

    case "state_definition":
      return {
        ...baseElement,
        occasion: data.occasion || "",
        participants: data.participants || "",
        significance: data.significance || "",
      } as StateDefinitionElement;

    default:
      // デフォルトは汎用的な要素として扱う
      return {
        ...baseElement,
        occasion: data.occasion || "",
        participants: data.participants || "",
        significance: data.significance || "",
      } as CustomElement;
  }
}
