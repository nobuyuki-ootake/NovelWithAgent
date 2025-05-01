// 小説プロジェクトの型定義
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
}

// 世界観設定の型定義
export interface WorldBuilding {
  id: string;
  setting: string;
  rules: string[];
  places: Place[];
  cultures: Culture[];
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

// 世界観の自由入力フィールド
export interface WorldBuildingFreeField {
  id: string;
  title: string;
  content: string;
}

// 場所の型定義
export interface Place {
  id: string;
  name: string;
  description: string;
  significance: string;
}

// 文化の型定義
export interface Culture {
  id: string;
  name: string;
  description: string;
  customs: string[];
}

// タイムラインイベントの型定義
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  relatedCharacters: string[];
  relatedPlaces: string[];
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
