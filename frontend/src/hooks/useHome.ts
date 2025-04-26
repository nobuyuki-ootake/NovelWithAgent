import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { currentProjectState } from "../store/atoms";
import { NovelProject } from "../types/index";

export function useHome() {
  const [projects, setProjects] = useState<NovelProject[]>([]);
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // ローカルストレージからプロジェクト一覧を取得
  useEffect(() => {
    const savedProjects = localStorage.getItem("novelProjects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // プロジェクト一覧を保存
  const saveProjects = (updatedProjects: NovelProject[]) => {
    localStorage.setItem("novelProjects", JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  // 新規プロジェクト作成ダイアログを開く
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // 新規プロジェクト作成ダイアログを閉じる
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewProjectTitle("");
  };

  // 新規プロジェクト作成
  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;

    const newProject: NovelProject = {
      id: uuidv4(),
      title: newProjectTitle.trim(),
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
      },
      timeline: [],
      chapters: [],
      feedback: [],
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);

    // 新規プロジェクトを選択
    setCurrentProject(newProject);
    localStorage.setItem("currentProjectId", newProject.id);

    handleCloseDialog();
  };

  // プロジェクト選択
  const handleSelectProject = (project: NovelProject) => {
    setCurrentProject(project);
    localStorage.setItem("currentProjectId", project.id);
  };

  // 削除確認ダイアログを開く
  const handleOpenDeleteDialog = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 削除確認ダイアログを閉じる
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  // プロジェクト削除
  const handleDeleteProject = () => {
    if (!projectToDelete) return;

    const updatedProjects = projects.filter(
      (project) => project.id !== projectToDelete
    );
    saveProjects(updatedProjects);
    handleCloseDeleteDialog();
  };

  return {
    projects,
    currentProject,
    newProjectTitle,
    setNewProjectTitle,
    dialogOpen,
    deleteDialogOpen,
    handleOpenDialog,
    handleCloseDialog,
    handleCreateProject,
    handleSelectProject,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteProject,
  };
}
