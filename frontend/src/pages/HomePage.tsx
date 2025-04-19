import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { currentProjectState } from "../store/atoms";
import { NovelProject } from "../types";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<NovelProject[]>([]);
  const [, setCurrentProject] = useRecoilState(currentProjectState);
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
  const handleOpenDeleteDialog = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", mx: "auto" }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        AI共創型小説作成ツール
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                プロジェクト一覧
              </Typography>

              {projects.length === 0 ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ my: 4, textAlign: "center" }}
                >
                  まだプロジェクトがありません。新しいプロジェクトを作成してください。
                </Typography>
              ) : (
                <List>
                  {projects.map((project) => (
                    <ListItem
                      key={project.id}
                      disablePadding
                      secondaryAction={
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={(e) => handleOpenDeleteDialog(project.id, e)}
                        >
                          削除
                        </Button>
                      }
                    >
                      <ListItemButton
                        onClick={() => handleSelectProject(project)}
                      >
                        <ListItemText
                          primary={project.title}
                          secondary={`作成日: ${new Date(
                            project.createdAt
                          ).toLocaleDateString()}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                >
                  新規プロジェクト作成
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                AI共創型小説作成について
              </Typography>
              <Typography variant="body1" paragraph>
                このツールはAIの力を借りながら、あなた自身の創造性を最大限に引き出すための共創型小説作成ツールです。
              </Typography>
              <Typography variant="body1" paragraph>
                物語のあらすじ、プロット、キャラクター設定から章立てまで、創作の全工程をAIがサポートします。
              </Typography>
              <Typography variant="body1" paragraph>
                始めるには、左側の「新規プロジェクト作成」ボタンをクリックして、作品のタイトルを入力してください。
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold", mt: 2 }}>
                主な機能:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="あらすじ作成"
                    secondary="物語の概要を決めましょう"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="プロット構成"
                    secondary="物語の流れを組み立てましょう"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="キャラクター設定"
                    secondary="魅力的な登場人物を作り出しましょう"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="世界観構築"
                    secondary="物語の舞台を設定しましょう"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="本文執筆"
                    secondary="400字縦書き原稿用紙風のエディタで執筆しましょう"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 新規プロジェクト作成ダイアログ */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>新規プロジェクト作成</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="作品タイトル"
            fullWidth
            variant="outlined"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
            placeholder="例：星空の約束"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button
            onClick={handleCreateProject}
            variant="contained"
            color="primary"
            disabled={!newProjectTitle.trim()}
          >
            作成
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>プロジェクトを削除しますか？</DialogTitle>
        <DialogContent>
          <Typography>
            このプロジェクトを削除すると、関連するすべてのデータが失われます。この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>キャンセル</Button>
          <Button onClick={handleDeleteProject} color="error">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;
