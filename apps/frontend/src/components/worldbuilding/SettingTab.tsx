import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRecoilState } from "recoil";
import { currentProjectState } from "../../store/atoms";
import { v4 as uuidv4 } from "uuid";
import { SettingElement, NovelProject } from "@novel-ai-assistant/types";

interface SettingTabProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  history: string;
  onHistoryChange: (value: string) => void;
}

const SettingTab: React.FC<SettingTabProps> = ({
  description,
  onDescriptionChange,
  history,
  onHistoryChange,
}) => {
  // Recoilからデータを取得
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);

  // 設定要素データを取得
  const settings = currentProject?.worldBuilding?.settings || [];

  // 状態管理
  const [currentSetting, setCurrentSetting] = useState<SettingElement | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 新規設定要素作成ダイアログを開く
  const handleOpenNewDialog = () => {
    setCurrentSetting({
      id: uuidv4(),
      name: "",
      type: "setting",
      originalType: "setting",
      description: "",
      features: "",
      importance: "",
      relations: "",
      img: "",
    } as SettingElement);
    setIsEditing(false);
    setDialogOpen(true);
  };

  // 設定要素編集ダイアログを開く
  const handleEdit = (setting: SettingElement) => {
    setCurrentSetting({ ...setting });
    setIsEditing(true);
    setDialogOpen(true);
  };

  // 設定要素を削除
  const handleDelete = (id: string) => {
    if (!currentProject) return;

    const updatedSettings = settings.filter(
      (setting: SettingElement) => setting.id !== id
    );

    setCurrentProject((prevProject: NovelProject | null) => {
      if (!prevProject) return null;
      return {
        ...prevProject,
        worldBuilding: {
          ...prevProject.worldBuilding,
          settings: updatedSettings,
        },
      } as NovelProject;
    });
  };

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentSetting(null);
  };

  // 設定要素の保存
  const handleSaveSetting = () => {
    if (!currentSetting || !currentProject) return;

    if (isEditing) {
      const updatedSettings = settings.map((setting: SettingElement) =>
        setting.id === currentSetting.id ? currentSetting : setting
      );
      setCurrentProject((prevProject: NovelProject | null) => {
        if (!prevProject) return null;
        return {
          ...prevProject,
          worldBuilding: {
            ...prevProject.worldBuilding,
            settings: updatedSettings,
          },
        } as NovelProject;
      });
    } else {
      setCurrentProject((prevProject: NovelProject | null) => {
        if (!prevProject) return null;
        return {
          ...prevProject,
          worldBuilding: {
            ...prevProject.worldBuilding,
            settings: [
              ...(prevProject.worldBuilding?.settings || []),
              currentSetting,
            ],
          },
        } as NovelProject;
      });
    }
    handleCloseDialog();
  };

  // 入力フィールドの変更を処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!currentSetting) return;
    setCurrentSetting({
      ...currentSetting,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      {/* 基本的な世界観設定 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          世界観設定
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          この物語の世界はどのような場所ですか？時代、技術レベル、魔法の有無、文明の特徴などを記述してください。
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={5}
          maxRows={15}
          label="世界観の基本設定"
          placeholder="例: この世界は魔法と科学技術が共存する近未来の地球が舞台です。人類は1000年前の大災害から回復し、新しい文明を築きました。..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          variant="outlined"
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          歴史
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          この世界の歴史的背景について説明してください。重要な出来事、戦争、大きな変化などを含めます。
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={5}
          maxRows={15}
          label="世界の歴史"
          placeholder="例: 1000年前、世界は「大崩壊」という名の災害に見舞われました。古代の超科学文明は一夜にして滅び、生き残った人々は技術を失いながらも徐々に社会を再建していきました..."
          value={history}
          onChange={(e) => onHistoryChange(e.target.value)}
          variant="outlined"
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* 詳細な設定要素 */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6">詳細な設定要素</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenNewDialog}
          >
            新しい設定要素を追加
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          世界観の詳細な設定要素を管理します。特定の制度、システム、重要な概念などを個別に定義できます。
        </Typography>

        {settings.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              まだ詳細な設定要素が追加されていません。「新しい設定要素を追加」ボタンから追加できます。
            </Typography>
          </Paper>
        ) : (
          <List sx={{ width: "100%" }}>
            {settings.map((setting: SettingElement, index: number) => (
              <Paper
                key={setting.id || index}
                elevation={1}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <ListItem
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    p: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {setting.name || "名称未設定"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        重要性: {setting.importance || "未設定"}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={() => handleEdit(setting)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(setting.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {setting.description && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        説明
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {setting.description}
                      </Typography>
                    </Box>
                  )}

                  {setting.features && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        特徴
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {setting.features}
                      </Typography>
                    </Box>
                  )}

                  {setting.relations && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        関連要素
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {setting.relations}
                      </Typography>
                    </Box>
                  )}
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Box>

      {/* 編集・新規作成ダイアログ */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? "設定要素を編集" : "新しい設定要素を追加"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="名前"
            name="name"
            placeholder="設定要素の名前"
            value={currentSetting?.name || ""}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="説明"
            name="description"
            placeholder="この設定要素の詳細な説明"
            value={currentSetting?.description || ""}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="特徴"
            name="features"
            placeholder="この設定要素の特徴的な要素"
            value={currentSetting?.features || ""}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="重要性"
            name="importance"
            placeholder="物語における重要度（高・中・低など）"
            value={currentSetting?.importance || ""}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="関連要素"
            name="relations"
            placeholder="他の世界観要素、キャラクター、イベントとの関連性"
            value={currentSetting?.relations || ""}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button onClick={handleSaveSetting} variant="contained">
            {isEditing ? "更新" : "追加"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingTab;
