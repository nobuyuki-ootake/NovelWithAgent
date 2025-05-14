export interface CultureElement {
  id: string;
  name: string;
  description: string;
  significance?: string;
  history?: string;
  relatedPlaces?: string[];
  [key: string]: unknown;
}

export interface RuleElement {
  id: string;
  name: string;
  description: string;
  limitations?: string;
  exceptions?: string;
  impact?: string;
  origin?: string;
  type?: string;
  originalType?: string;
  features?: string;
  importance?: string;
  relations?: string;
  [key: string]: unknown;
}

export interface PlaceElement {
  id: string;
  name: string;
  type?: string;
  description: string;
  significance?: string;
  history?: string;
  locationType?: string;
  [key: string]: unknown;
}

// 他の必要な型定義をここに追加
