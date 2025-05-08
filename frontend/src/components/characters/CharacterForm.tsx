import React, { useState } from "react";
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
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Image as ImageIcon,
  Save as SaveIcon,
  Add as AddIcon,
  AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material";
import { Character, CustomField, CharacterStatus } from "../../types/index";
import CharacterStatusList from "./CharacterStatusList";
import CharacterStatusEditorDialog from "./CharacterStatusEditorDialog";
import { AIAssistModal } from "../modals/AIAssistModal";
import { useAIAssist } from "../../hooks/useAIAssist";
import { AIAssistButton } from "../ui/AIAssistButton";
import { useRecoilValue } from "recoil";
import { currentProjectState } from "../../store/atoms";

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
  onAddTrait: (trait: { value: string; source: string }) => void;
  onRemoveTrait: (index: number) => void;
  onCustomFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onAddCustomField: () => void;
  onRemoveCustomField: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onSaveStatus: (status: CharacterStatus) => void;
  onDeleteStatus: (statusId: string) => void;
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
  onSaveStatus,
  onDeleteStatus,
}) => {
  const [statusEditorOpen, setStatusEditorOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<
    CharacterStatus | undefined
  >(undefined);
  const [aiAssistModalOpen, setAiAssistModalOpen] = useState(false);
  const [aiAssistTarget, setAiAssistTarget] = useState<
    "basic" | "background" | "personality"
  >("basic");
  const currentProject = useRecoilValue(currentProjectState);

  // AIアシスト機能
  const { assistCharacter, isLoading } = useAIAssist({
    onSuccess: (result) => {
      if (result && result.response) {
        applyAIResponse(result.response, aiAssistTarget);
      }
    },
  });

  // AIアシストモーダルを開く
  const handleOpenAIAssist =
    (target: "basic" | "background" | "personality") => async () => {
      setAiAssistTarget(target);
      setAiAssistModalOpen(true);
      return Promise.resolve();
    };

  // AIアシストリクエスト実行
  const handleAIAssist = async (message: string) => {
    // あらすじとプロットを参照してキャラクター生成をリクエスト
    const synopsis = currentProject?.synopsis || "";
    const plotElements = currentProject?.plot || [];
    const existingCharacters = currentProject?.characters || [];

    return await assistCharacter(message, [
      { type: "synopsis", content: synopsis },
      ...plotElements.map((item) => ({ type: "plotItem", content: item })),
      ...existingCharacters.map((char) => ({
        type: "character",
        content: char,
      })),
    ]);
  };

  // AIの応答を適用する関数
  const applyAIResponse = (
    aiResponse: string,
    target: "basic" | "background" | "personality"
  ) => {
    if (target === "basic") {
      // 基本情報の抽出
      const nameMatch = aiResponse.match(/名前[：:]\s*(.+?)($|\n)/);
      if (nameMatch && nameMatch[1]) {
        onInputChange({
          target: { name: "name", value: nameMatch[1].trim() },
        } as any);
      }

      const roleMatch = aiResponse.match(
        /役割[：:]\s*(主人公|敵役|脇役)($|\n)/
      );
      if (roleMatch && roleMatch[1]) {
        const roleMap: Record<string, string> = {
          主人公: "protagonist",
          敵役: "antagonist",
          脇役: "supporting",
        };
        const role = roleMap[roleMatch[1]] || "supporting";
        onSelectChange({ target: { name: "role", value: role } } as any);
      }

      const genderMatch = aiResponse.match(/性別[：:]\s*(.+?)($|\n)/);
      if (genderMatch && genderMatch[1]) {
        onInputChange({
          target: { name: "gender", value: genderMatch[1].trim() },
        } as any);
      }

      const ageMatch = aiResponse.match(/年齢[：:]\s*(.+?)($|\n)/);
      if (ageMatch && ageMatch[1]) {
        onInputChange({
          target: { name: "age", value: ageMatch[1].trim() },
        } as any);
      }
    } else if (target === "background") {
      // 背景情報の抽出
      const backgroundMatch = aiResponse.match(
        /背景[：:]\s*(.+?)(\n\n|\n[^:]|$)/s
      );
      if (backgroundMatch && backgroundMatch[1]) {
        onInputChange({
          target: { name: "background", value: backgroundMatch[1].trim() },
        } as any);
      }

      const motivationMatch = aiResponse.match(
        /動機[：:]\s*(.+?)(\n\n|\n[^:]|$)/s
      );
      if (motivationMatch && motivationMatch[1]) {
        onInputChange({
          target: { name: "motivation", value: motivationMatch[1].trim() },
        } as any);
      }
    } else if (target === "personality") {
      // 性格特性の抽出
      const traitsMatch = aiResponse.match(/特性[：:]\s*(.+?)(\n\n|\n[^:]|$)/s);
      if (traitsMatch && traitsMatch[1]) {
        const traits = traitsMatch[1]
          .split(/[,、]/)
          .map((t) => t.trim())
          .filter((t) => t && t.length > 0);

        // すでに存在する特性を除去して追加
        const existingTraits = new Set(formData.traits.map((t) => t.value));
        for (const trait of traits) {
          if (!existingTraits.has(trait)) {
            onAddTrait({ value: trait, source: "AI" });
          }
        }
      }

      // 説明の抽出
      const descriptionMatch = aiResponse.match(
        /説明[：:]\s*(.+?)(\n\n|\n[^:]|$)/s
      );
      if (descriptionMatch && descriptionMatch[1]) {
        onInputChange({
          target: { name: "description", value: descriptionMatch[1].trim() },
        } as any);
      }
    }
  };

  const handleOpenStatusEditor = (status?: CharacterStatus) => {
    setEditingStatus(status);
    setStatusEditorOpen(true);
  };

  const handleCloseStatusEditor = () => {
    setStatusEditorOpen(false);
    setEditingStatus(undefined);
  };

  const handleSaveStatusCallback = (status: CharacterStatus) => {
    onSaveStatus(status);
    handleCloseStatusEditor();
  };

  const getIconPreview = () => {
    if (tempImageUrl && !tempImageUrl.startsWith("data:text/plain")) {
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
    <Box sx={{ p: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          基本情報
        </Typography>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <AIAssistButton
            onAssist={handleOpenAIAssist("basic")}
            text="AIに基本情報を提案してもらう"
            variant="outline"
          />
        </Box>
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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          背景・動機
        </Typography>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <AIAssistButton
            onAssist={handleOpenAIAssist("background")}
            text="AIに背景・動機を提案してもらう"
            variant="outline"
          />
        </Box>
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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          性格・特性
        </Typography>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <AIAssistButton
            onAssist={handleOpenAIAssist("personality")}
            text="AIに性格・特性を提案してもらう"
            variant="outline"
          />
        </Box>
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
            onClick={() => onAddTrait({ value: newTrait, source: "manual" })}
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

      <Box sx={{ mb: 4 }}>
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
          <input type="file" hidden accept="image/*" onChange={onImageUpload} />
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
          状態管理
        </Typography>
        <CharacterStatusList
          statuses={formData.statuses || []}
          onEdit={handleOpenStatusEditor}
          onDelete={onDeleteStatus}
        />
        <Button
          variant="outlined"
          onClick={() => handleOpenStatusEditor()}
          sx={{ mt: 2 }}
          startIcon={<AddIcon />}
        >
          新しい状態を追加
        </Button>
      </Box>

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

      <AIAssistModal
        open={aiAssistModalOpen}
        onClose={() => setAiAssistModalOpen(false)}
        title={
          aiAssistTarget === "basic"
            ? "AIにキャラクターの基本情報を提案してもらう"
            : aiAssistTarget === "background"
            ? "AIにキャラクターの背景・動機を提案してもらう"
            : "AIにキャラクターの性格・特性を提案してもらう"
        }
        description={
          aiAssistTarget === "basic"
            ? "あらすじとプロットを参照して、キャラクターの基本情報（名前、役割、性別、年齢など）を生成します。"
            : aiAssistTarget === "background"
            ? "あらすじとプロットを参照して、キャラクターの背景や動機を生成します。"
            : "あらすじとプロットを参照して、キャラクターの性格や特性を生成します。"
        }
        defaultMessage={
          `あらすじとプロットを参照して、${
            aiAssistTarget === "basic"
              ? "キャラクターの基本情報（名前、役割、性別、年齢など）"
              : aiAssistTarget === "background"
              ? "キャラクターの背景や動機"
              : "キャラクターの性格や特性（長所、短所、特徴的な性格）"
          }を考えてください。\n\n` +
          `現在のあらすじ:\n${
            currentProject?.synopsis || "（あらすじがありません）"
          }\n\n` +
          `キャラクター名: ${formData.name || "（名前未設定）"}\n` +
          `役割: ${
            formData.role === "protagonist"
              ? "主人公"
              : formData.role === "antagonist"
              ? "敵役"
              : "脇役"
          }`
        }
        onAssistComplete={() => {
          // モーダルは自動的に閉じる
        }}
        requestAssist={handleAIAssist}
      />

      <CharacterStatusEditorDialog
        open={statusEditorOpen}
        editingStatus={editingStatus}
        onClose={handleCloseStatusEditor}
        onSave={handleSaveStatusCallback}
      />
    </Box>
  );
};

export default CharacterForm;
