/**
 * プロジェクトの状態を表す型
 */
export type ProjectStatus = "active" | "archived" | "template";

/**
 * プロジェクトのメタデータ
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
 * プロジェクト型定義
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  characters: {
    id: string;
    name: string;
    [key: string]: unknown;
  }[];
  worldBuilding: {
    id: string;
    [key: string]: unknown;
  };
  timeline: {
    id: string;
    title: string;
    [key: string]: unknown;
  }[];
  chapters: {
    id: string;
    title: string;
    [key: string]: unknown;
  }[];
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
