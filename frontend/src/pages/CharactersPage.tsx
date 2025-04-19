import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  Chip,
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  PersonAdd as PersonAddIcon,
  Image as ImageIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { useRecoilState } from "recoil";
import { currentProjectState } from "../store/atoms";
import { Character, CustomField } from "../types";

const defaultAvatarUrl = "/default-avatar.png"; // 仮のデフォルト画像パス

const CharactersPage: React.FC = () => {
  // Recoilの状態
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);

  // ローカルの状態
  const [characters, setCharacters] = useState<Character[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [, setCurrentCharacter] = useState<Character | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 新規キャラクター用の初期状態
  const initialCharacterState: Character = {
    id: "",
    name: "",
    role: "supporting",
    gender: "",
    birthDate: "",
    description: "",
    background: "",
    motivation: "",
    traits: [],
    relationships: [],
    imageUrl: "",
    customFields: [],
  };

  // フォーム入力用の状態
  const [formData, setFormData] = useState<Character>(initialCharacterState);
  const [newTrait, setNewTrait] = useState("");
  const [newCustomField, setNewCustomField] = useState<CustomField>({
    id: "",
    name: "",
    value: "",
  });

  // プロジェクトからキャラクターを読み込む
  useEffect(() => {
    if (currentProject?.characters) {
      setCharacters([...currentProject.characters]);
    }
  }, [currentProject]);

  // 表示モードの切り替え
  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: "list" | "grid" | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // ダイアログを開く（新規作成）
  const handleOpenDialog = () => {
    setFormData({ ...initialCharacterState, id: uuidv4() });
    setTempImageUrl("");
    setFormErrors({});
    setEditMode(false);
    setOpenDialog(true);
  };

  // ダイアログを開く（編集）
  const handleEditCharacter = (character: Character) => {
    setFormData({ ...character });
    setTempImageUrl(character.imageUrl || "");
    setCurrentCharacter(character);
    setFormErrors({});
    setEditMode(true);
    setOpenDialog(true);
  };

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    // 未保存の変更がある場合は確認
    if (hasUnsavedChanges) {
      if (!window.confirm("未保存の変更があります。閉じてもよろしいですか？")) {
        return;
      }
    }
    setOpenDialog(false);
    setHasUnsavedChanges(false);
  };

  // 画像アップロード処理
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        image: "画像サイズは5MB以下にしてください",
      });
      return;
    }

    // 画像のプレビューURLを作成
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setTempImageUrl(result);
      setFormData({ ...formData, imageUrl: result });
      setHasUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  };

  // フォーム入力の処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setHasUnsavedChanges(true);

    // エラーをクリア
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
  };

  // セレクト入力の処理
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setHasUnsavedChanges(true);
  };

  // 特性の追加
  const handleAddTrait = () => {
    if (!newTrait.trim()) return;
    const updatedTraits = [...formData.traits, newTrait.trim()];
    setFormData({ ...formData, traits: updatedTraits });
    setNewTrait("");
    setHasUnsavedChanges(true);
  };

  // 特性の削除
  const handleRemoveTrait = (index: number) => {
    const updatedTraits = formData.traits.filter((_, i) => i !== index);
    setFormData({ ...formData, traits: updatedTraits });
    setHasUnsavedChanges(true);
  };

  // カスタムフィールドの入力処理
  const handleCustomFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCustomField({ ...newCustomField, [name]: value });
  };

  // カスタムフィールドの追加
  const handleAddCustomField = () => {
    if (!newCustomField.name.trim()) return;

    const customFields = formData.customFields || [];
    const updatedCustomFields = [
      ...customFields,
      { ...newCustomField, id: uuidv4() },
    ];

    setFormData({ ...formData, customFields: updatedCustomFields });
    setNewCustomField({ id: "", name: "", value: "" });
    setHasUnsavedChanges(true);
  };

  // カスタムフィールドの削除
  const handleRemoveCustomField = (id: string) => {
    const updatedCustomFields =
      formData.customFields?.filter((field) => field.id !== id) || [];
    setFormData({ ...formData, customFields: updatedCustomFields });
    setHasUnsavedChanges(true);
  };

  // キャラクターの削除
  const handleDeleteCharacter = (id: string) => {
    if (window.confirm("このキャラクターを削除してもよろしいですか？")) {
      const updatedCharacters = characters.filter((char) => char.id !== id);
      setCharacters(updatedCharacters);

      // プロジェクトの更新
      if (currentProject) {
        setCurrentProject({
          ...currentProject,
          characters: updatedCharacters,
          updatedAt: new Date(),
        });
      }

      setSnackbarMessage("キャラクターを削除しました");
      setSnackbarOpen(true);
    }
  };

  // フォームのバリデーション
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "名前は必須です";
    }

    if (!formData.role) {
      errors.role = "役割は必須です";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // キャラクターの保存
  const handleSaveCharacter = () => {
    if (!validateForm()) return;

    let updatedCharacters: Character[];

    if (editMode) {
      // 既存のキャラクターを更新
      updatedCharacters = characters.map((char) =>
        char.id === formData.id ? formData : char
      );
    } else {
      // 新規キャラクターを追加
      updatedCharacters = [...characters, formData];
    }

    setCharacters(updatedCharacters);

    // プロジェクトの更新
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        characters: updatedCharacters,
        updatedAt: new Date(),
      });
    }

    setSnackbarMessage(
      editMode
        ? "キャラクターを更新しました"
        : "新しいキャラクターを作成しました"
    );
    setSnackbarOpen(true);
    setOpenDialog(false);
    setHasUnsavedChanges(false);
  };

  // スナックバーを閉じる
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!currentProject) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>プロジェクトが選択されていません。</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {currentProject.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          キャラクター設定
        </Typography>
      </Paper>

      {/* 上部メニュー */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "center",
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="表示モード"
          size="small"
        >
          <ToggleButton value="grid" aria-label="グリッド表示">
            <GridViewIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="リスト表示">
            <ListViewIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenDialog}
        >
          新規キャラクター作成
        </Button>
      </Box>

      {/* キャラクター一覧（グリッド表示） */}
      {viewMode === "grid" && (
        <Box>
          {characters.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                まだキャラクターがありません
              </Typography>
              <Button
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={handleOpenDialog}
              >
                キャラクターを作成する
              </Button>
            </Paper>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {characters.map((character) => (
                <Box
                  key={character.id}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 12px)",
                      md: "calc(33.333% - 16px)",
                      lg: "calc(25% - 18px)",
                    },
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "0.3s",
                      "&:hover": {
                        boxShadow: (theme) => theme.shadows[8],
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={character.imageUrl || defaultAvatarUrl}
                      alt={character.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="div" gutterBottom>
                        {character.name}
                      </Typography>
                      <Chip
                        label={
                          {
                            protagonist: "主人公",
                            antagonist: "敵役",
                            supporting: "脇役",
                          }[character.role]
                        }
                        size="small"
                        color={
                          character.role === "protagonist"
                            ? "primary"
                            : character.role === "antagonist"
                            ? "error"
                            : "default"
                        }
                        sx={{ mb: 1 }}
                      />
                      {character.gender && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          性別: {character.gender}
                        </Typography>
                      )}
                      {character.birthDate && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          生年月日: {character.birthDate}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          display: "-webkit-box",
                        }}
                      >
                        {character.description || "説明がありません"}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => handleEditCharacter(character)}
                      >
                        詳細
                      </Button>
                      <Box sx={{ flexGrow: 1 }} />
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditCharacter(character)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCharacter(character.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* キャラクター一覧（リスト表示） */}
      {viewMode === "list" && (
        <Paper elevation={1}>
          {characters.length === 0 ? (
            <Box
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                まだキャラクターがありません
              </Typography>
              <Button
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={handleOpenDialog}
              >
                キャラクターを作成する
              </Button>
            </Box>
          ) : (
            <List>
              {characters.map((character, index) => (
                <React.Fragment key={character.id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          color="primary"
                          onClick={() => handleEditCharacter(character)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDeleteCharacter(character.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={character.imageUrl || defaultAvatarUrl}
                        alt={character.name}
                        sx={{ width: 56, height: 56, mr: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="h6">{character.name}</Typography>
                          <Chip
                            label={
                              {
                                protagonist: "主人公",
                                antagonist: "敵役",
                                supporting: "脇役",
                              }[character.role]
                            }
                            size="small"
                            color={
                              character.role === "protagonist"
                                ? "primary"
                                : character.role === "antagonist"
                                ? "error"
                                : "default"
                            }
                          />
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span">
                            {character.gender && `性別: ${character.gender}`}
                            {character.gender && character.birthDate && " | "}
                            {character.birthDate &&
                              `生年月日: ${character.birthDate}`}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              display: "-webkit-box",
                            }}
                          >
                            {character.description || "説明がありません"}
                          </Typography>
                        </React.Fragment>
                      }
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                  {index < characters.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      )}

      {/* キャラクター編集モーダル */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        aria-labelledby="character-dialog-title"
      >
        <DialogTitle id="character-dialog-title">
          {editMode ? "キャラクターを編集" : "新規キャラクター作成"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            {/* 左側：基本情報 */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  基本情報
                </Typography>
                <TextField
                  fullWidth
                  label="名前"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  margin="normal"
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  required
                />
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!formErrors.role}
                >
                  <InputLabel id="role-label">役割</InputLabel>
                  <Select
                    labelId="role-label"
                    name="role"
                    value={formData.role}
                    onChange={handleSelectChange}
                    label="役割"
                    required
                  >
                    <MenuItem value="protagonist">主人公</MenuItem>
                    <MenuItem value="antagonist">敵役</MenuItem>
                    <MenuItem value="supporting">脇役</MenuItem>
                  </Select>
                  {formErrors.role && (
                    <FormHelperText>{formErrors.role}</FormHelperText>
                  )}
                </FormControl>
                <TextField
                  fullWidth
                  label="性別"
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="生年月日"
                  name="birthDate"
                  value={formData.birthDate || ""}
                  onChange={handleInputChange}
                  margin="normal"
                  placeholder="YYYY-MM-DD または自由形式"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  説明
                </Typography>
                <TextField
                  fullWidth
                  label="キャラクター説明"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
                <TextField
                  fullWidth
                  label="背景"
                  name="background"
                  value={formData.background}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
                <TextField
                  fullWidth
                  label="動機"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Box>
            </Box>

            {/* 右側：画像とカスタムフィールド */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                  キャラクター画像
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 200,
                    border: "1px dashed grey",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                    overflow: "hidden",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {tempImageUrl ? (
                    <img
                      src={tempImageUrl}
                      alt="Character preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <ImageIcon sx={{ fontSize: 60, color: "text.secondary" }} />
                  )}
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                >
                  画像をアップロード
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                {formErrors.image && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ display: "block", mt: 1 }}
                  >
                    {formErrors.image}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  特性
                </Typography>
                <Box sx={{ display: "flex", mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="新しい特性"
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddTrait}
                    disabled={!newTrait.trim()}
                    sx={{ ml: 1 }}
                  >
                    追加
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {formData.traits.map((trait, index) => (
                    <Chip
                      key={index}
                      label={trait}
                      onDelete={() => handleRemoveTrait(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  {formData.traits.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      特性がありません
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  カスタムフィールド
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="フィールド名"
                    name="name"
                    value={newCustomField.name}
                    onChange={handleCustomFieldChange}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: "flex" }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="値"
                      name="value"
                      value={newCustomField.value}
                      onChange={handleCustomFieldChange}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddCustomField}
                      disabled={!newCustomField.name.trim()}
                      sx={{ ml: 1 }}
                    >
                      追加
                    </Button>
                  </Box>
                </Box>

                <List dense>
                  {formData.customFields?.map((field) => (
                    <ListItem
                      key={field.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveCustomField(field.id)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={field.name}
                        secondary={field.value}
                      />
                    </ListItem>
                  ))}
                  {(!formData.customFields ||
                    formData.customFields.length === 0) && (
                    <Typography variant="body2" color="text.secondary">
                      カスタムフィールドがありません
                    </Typography>
                  )}
                </List>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button
            onClick={handleSaveCharacter}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* スナックバー */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CharactersPage;
