import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Avatar,
  FormHelperText,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Image as ImageIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { Character, CustomField } from "../../types";

// キャラクターの役割に応じたアイコンとカラーを定義
const characterIcons = {
  protagonist: {
    color: "#FFD700", // ゴールド
    emoji: "👑",
    label: "主人公",
  },
  antagonist: {
    color: "#DC143C", // クリムゾン
    emoji: "😈",
    label: "敵役",
  },
  supporting: {
    color: "#4169E1", // ロイヤルブルー
    emoji: "🙂",
    label: "脇役",
  },
  default: {
    color: "#808080", // グレー
    emoji: "👤",
    label: "その他",
  },
};

// 利用可能な絵文字リスト
const availableEmojis = [
  "👑",
  "😈",
  "🙂",
  "👤",
  "🦸",
  "🦹",
  "🧙",
  "👸",
  "🤴",
  "👩‍🚀",
  "👨‍🚀",
  "👩‍🔬",
  "👨‍🔬",
  "🧝",
  "🧛",
  "🧟",
  "🧞",
  "🥷",
  "🧚",
  "🧜",
  "🧝‍♀️",
  "🧙‍♂️",
  "🦊",
  "🐱",
  "🐶",
  "🐺",
  "🦁",
  "🐯",
];

interface CharacterFormProps {
  formData: Character;
  formErrors: Record<string, string>;
  selectedEmoji: string;
  tempImageUrl: string;
  newTrait: string;
  newCustomField: CustomField;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (e: { target: { name: string; value: string } }) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEmojiSelect: (emoji: string) => void;
  onNewTraitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTrait: () => void;
  onRemoveTrait: (index: number) => void;
  onCustomFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onAddCustomField: () => void;
  onRemoveCustomField: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({
  formData,
  formErrors,
  selectedEmoji,
  tempImageUrl,
  newTrait,
  newCustomField,
  onInputChange,
  onSelectChange,
  onImageUpload,
  onEmojiSelect,
  onNewTraitChange,
  onAddTrait,
  onRemoveTrait,
  onCustomFieldChange,
  onAddCustomField,
  onRemoveCustomField,
  onSave,
  onCancel,
}) => {
  // デフォルトアイコンのプレビュー表示
  const getIconPreview = () => {
    if (tempImageUrl && !tempImageUrl.startsWith("data:text/plain")) {
      // 通常の画像
      return (
        <img
          src={tempImageUrl}
          alt="Character preview"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      );
    } else if (selectedEmoji) {
      // 選択した絵文字
      return (
        <Avatar
          sx={{
            width: 120,
            height: 120,
            fontSize: "4rem",
            bgcolor:
              characterIcons[formData.role]?.color ||
              characterIcons.default.color,
          }}
        >
          {selectedEmoji}
        </Avatar>
      );
    } else {
      // デフォルトアイコン
      const iconConfig =
        characterIcons[formData.role] || characterIcons.default;
      return (
        <Avatar
          sx={{
            width: 120,
            height: 120,
            fontSize: "4rem",
            bgcolor: iconConfig.color,
          }}
        >
          {iconConfig.emoji}
        </Avatar>
      );
    }
  };

  return (
    <>
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
              onChange={onInputChange}
              margin="normal"
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
            />
            <FormControl fullWidth margin="normal" error={!!formErrors.role}>
              <InputLabel id="role-label">役割</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={onSelectChange}
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
              onChange={onInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="生年月日"
              name="birthDate"
              value={formData.birthDate || ""}
              onChange={onInputChange}
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
              value={formData.description || ""}
              onChange={onInputChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="背景"
              name="background"
              value={formData.background || ""}
              onChange={onInputChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="動機"
              name="motivation"
              value={formData.motivation || ""}
              onChange={onInputChange}
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
              キャラクター画像/アイコン
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
              {getIconPreview()}
            </Box>

            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              sx={{ mr: 1 }}
            >
              画像をアップロード
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={onImageUpload}
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

            {/* 絵文字アイコン選択セクション */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                または絵文字アイコンを選択:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availableEmojis.map((emoji, index) => (
                  <Box key={index} sx={{ width: 40, height: 40 }}>
                    <Tooltip title={`${emoji}を選択`}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: "1.2rem",
                          cursor: "pointer",
                          bgcolor:
                            selectedEmoji === emoji
                              ? characterIcons[formData.role]?.color ||
                                characterIcons.default.color
                              : "transparent",
                          border:
                            selectedEmoji === emoji
                              ? "2px solid #000"
                              : "1px solid #ddd",
                          "&:hover": {
                            transform: "scale(1.1)",
                            transition: "transform 0.2s",
                          },
                        }}
                        onClick={() => onEmojiSelect(emoji)}
                      >
                        {emoji}
                      </Avatar>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            </Box>
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
                onChange={onNewTraitChange}
              />
              <Button
                variant="contained"
                onClick={onAddTrait}
                disabled={!newTrait.trim()}
                sx={{ ml: 1 }}
              >
                追加
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {(formData.traits || []).map((trait, index) => (
                <Chip
                  key={index}
                  label={trait.name}
                  onDelete={() => onRemoveTrait(index)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {!formData.traits || formData.traits.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  特性がありません
                </Typography>
              ) : null}
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
                onChange={onCustomFieldChange}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: "flex" }}>
                <TextField
                  fullWidth
                  size="small"
                  label="値"
                  name="value"
                  value={newCustomField.value}
                  onChange={onCustomFieldChange}
                />
                <Button
                  variant="contained"
                  onClick={onAddCustomField}
                  disabled={!newCustomField.name.trim()}
                  sx={{ ml: 1 }}
                >
                  追加
                </Button>
              </Box>
            </Box>

            <List dense>
              {(formData.customFields || []).map((field) => (
                <ListItem
                  key={field.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => onRemoveCustomField(field.id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText primary={field.name} secondary={field.value} />
                </ListItem>
              ))}
              {!formData.customFields || formData.customFields.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  カスタムフィールドがありません
                </Typography>
              ) : null}
            </List>
          </Box>
        </Box>
      </Stack>

      {/* フォームのアクション */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          キャンセル
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          保存
        </Button>
      </Box>
    </>
  );
};

export default CharacterForm;
