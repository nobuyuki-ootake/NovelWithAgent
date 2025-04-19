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
}

// キャラクターの型定義
export interface Character {
  id: string;
  name: string;
  role: "protagonist" | "antagonist" | "supporting";
  description: string;
  background: string;
  motivation: string;
  traits: string[];
  relationships: CharacterRelationship[];
  imageUrl?: string;
}

// キャラクター関係の型定義
export interface CharacterRelationship {
  characterId: string;
  relationshipType: string;
  description: string;
}

// 世界観設定の型定義
export interface WorldBuilding {
  id: string;
  setting: string;
  rules: string[];
  places: Place[];
  cultures: Culture[];
  history: string;
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
