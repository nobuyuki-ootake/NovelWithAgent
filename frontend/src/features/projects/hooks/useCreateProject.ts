import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LocalStorageManager } from "../../../utils/localStorage";
import { Project, ProjectStatus } from "../../../types/project";

interface CreateProjectOptions {
  name: string;
  description?: string;
  genre?: string[];
  tags?: string[];
}

export const useCreateProject = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (
    options: CreateProjectOptions
  ): Promise<Project | null> => {
    try {
      setIsCreating(true);
      setError(null);

      const now = new Date().toISOString();
      const projectId = uuidv4();

      // 新しいプロジェクトの基本構造を作成
      const newProject: Project = {
        id: projectId,
        name: options.name,
        description: options.description || "",
        createdAt: now,
        updatedAt: now,
        characters: [],
        worldBuilding: {
          id: uuidv4(),
          places: [],
          timelineSettings: {
            startDate: now.split("T")[0],
          },
        },
        timeline: [],
        chapters: [
          {
            id: uuidv4(),
            title: "第1章",
            content: "",
            order: 0,
            status: "draft",
          },
        ],
        metadata: {
          version: "1.0",
          tags: options.tags || [],
          genre: options.genre || [],
          status: "active" as ProjectStatus,
        },
      };

      // ローカルストレージに保存
      const success = LocalStorageManager.saveProject(newProject);

      if (!success) {
        throw new Error("プロジェクトの保存に失敗しました");
      }

      return newProject;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "プロジェクト作成中にエラーが発生しました"
      );
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createProject,
    isCreating,
    error,
  };
};
