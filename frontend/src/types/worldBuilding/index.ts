/**
 * 世界観要素の型定義
 */
export interface WorldBuildingElement {
  id: string;
  name: string;
  type: string;
  originalType: string;
  description: string;
  features: string;
  importance: string;
  // 場所特有のフィールド
  location?: string;
  population?: string;
  culturalFeatures?: string;
  // 文化特有のフィールド
  customs?: string;
  beliefs?: string;
  history?: string;
  // ルール特有のフィールド
  impact?: string;
  exceptions?: string;
  origin?: string;
  // 関連事項
  relations: string;
}

/**
 * 世界観要素の種類
 */
export enum WorldBuildingElementType {
  PLACE = "place",
  CULTURE = "culture",
  RULE = "rule",
  HISTORY = "history",
  LEGEND = "legend",
  TECHNOLOGY = "technology",
  MAGIC = "magic",
  RELIGION = "religion",
  CUSTOM = "custom",
  GEOGRAPHY = "geography",
  CLIMATE = "climate",
  LANGUAGE = "language",
  ELEMENT = "element",
}
