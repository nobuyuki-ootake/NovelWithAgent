// 文化の型定義
export interface Culture {
  id: string;
  name: string;
  description: string;
  values: string[];
  customs: string[];
  socialStructure?: string;
  government?: string;
  religion?: string;
  language?: string;
  art?: string;
  technology?: string;
  notes?: string;
}
