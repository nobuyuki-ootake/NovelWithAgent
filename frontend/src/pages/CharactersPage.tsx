import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useCharacters } from "../hooks/useCharacters";
import CharacterList from "../features/characters/CharacterList";
import CharacterForm from "../components/characters/CharacterForm";
import { AIAssistButton } from "../components/ui/AIAssistButton";
import { AIAssistModal } from "../components/modals/AIAssistModal";
import { useAIAssist } from "../hooks/useAIAssist";
import { useRecoilValue } from "recoil";
import { currentProjectState } from "../store/atoms";
import { v4 as uuidv4 } from "uuid";
import { Character, CharacterTrait } from "../types";

const CharactersPage: React.FC = () => {
  const [aiAssistModalOpen, setAiAssistModalOpen] = useState(false);
  const currentProject = useRecoilValue(currentProjectState);

  const {
    characters,
    viewMode,
    openDialog,
    editMode,
    formData,
    formErrors,
    tempImageUrl,
    selectedEmoji,
    newTrait,
    newCustomField,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleViewModeChange,
    handleOpenDialog,
    handleEditCharacter,
    handleCloseDialog,
    handleImageUpload,
    handleEmojiSelect,
    handleInputChange,
    handleSelectChange,
    handleAddTrait,
    handleRemoveTrait,
    handleNewTraitChange,
    handleCustomFieldChange,
    handleAddCustomField,
    handleRemoveCustomField,
    handleDeleteCharacter,
    handleSaveCharacter,
    handleCloseSnackbar,
    handleSaveStatus,
    handleDeleteStatus,
    setFormData,
  } = useCharacters();

  // AIアシスト機能を使用
  const { generateCharacter, isLoading } = useAIAssist({
    onSuccess: (result) => {
      if (result && result.response) {
        // AIの応答をパースしてキャラクターデータに変換
        const character = parseAIResponseToCharacter(result.response);
        if (character) {
          // 新規キャラクターとしてフォームにセット
          setFormData({
            ...character,
            id: uuidv4(), // 新しいIDを生成
          });
          // 編集ダイアログを開く
          handleOpenDialog();
        }
      }
    },
  });

  // AIアシスタントを開く
  const handleOpenAIAssist = async () => {
    setAiAssistModalOpen(true);
    return Promise.resolve();
  };

  // AIアシストリクエスト実行
  const handleAIAssist = async (message: string) => {
    // あらすじとプロットを参照してキャラクター生成をリクエスト
    const synopsis = currentProject?.synopsis || "";
    const plotElements = currentProject?.plot || [];
    const existingCharacters = currentProject?.characters || [];

    return await generateCharacter(
      message,
      [
        ...plotElements.map((item) => ({ type: "plotItem", content: item })),
        { type: "synopsis", content: synopsis },
      ],
      existingCharacters.map((char) => ({ type: "character", content: char }))
    );
  };

  // AIのレスポンスをキャラクターデータに変換する関数
  const parseAIResponseToCharacter = (aiResponse: string): Character | null => {
    try {
      // 名前の抽出
      const nameMatch = aiResponse.match(/名前[：:]\s*(.+?)($|\n)/);
      if (!nameMatch || !nameMatch[1]?.trim()) return null;

      // 役割の抽出と変換
      const roleMatch = aiResponse.match(/役割[：:]\s*(.+?)($|\n)/);
      let role: "protagonist" | "antagonist" | "supporting" = "supporting";
      if (roleMatch && roleMatch[1]) {
        const roleName = roleMatch[1].trim();
        if (roleName.includes("主人公")) role = "protagonist";
        else if (roleName.includes("敵役")) role = "antagonist";
      }

      // 性別の抽出
      const genderMatch = aiResponse.match(/性別[：:]\s*(.+?)($|\n)/);
      const gender = genderMatch && genderMatch[1] ? genderMatch[1].trim() : "";

      // 年齢の抽出
      const ageMatch = aiResponse.match(/年齢[：:]\s*(.+?)($|\n)/);

      // 説明の抽出
      const descriptionMatch = aiResponse.match(/説明[：:]\s*(.+?)($|\n)/);
      const description =
        descriptionMatch && descriptionMatch[1]
          ? descriptionMatch[1].trim()
          : "";

      // 背景の抽出
      const backgroundMatch = aiResponse.match(/背景[：:]\s*(.+?)($|\n|\n\n)/s);
      const background =
        backgroundMatch && backgroundMatch[1] ? backgroundMatch[1].trim() : "";

      // 動機の抽出
      const motivationMatch = aiResponse.match(/動機[：:]\s*(.+?)($|\n|\n\n)/s);
      const motivation =
        motivationMatch && motivationMatch[1] ? motivationMatch[1].trim() : "";

      // 特性の抽出
      const traitsMatch = aiResponse.match(/特性[：:]\s*(.+?)($|\n)/);
      const traits: CharacterTrait[] = [];
      if (traitsMatch && traitsMatch[1]) {
        const traitStrings = traitsMatch[1].split(/[,、]/);
        traitStrings.forEach((trait) => {
          if (trait.trim()) {
            traits.push({
              id: uuidv4(),
              name: trait.trim(),
              value: "",
            });
          }
        });
      }

      // アイコンの抽出
      const iconMatch = aiResponse.match(/アイコン[：:]\s*(.+?)($|\n)/);
      let imageUrl = "";
      if (iconMatch && iconMatch[1]) {
        const emoji = iconMatch[1].trim().match(/[^\s]+/)?.[0] || "";
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

        // 有効な絵文字かチェック
        if (emoji && availableEmojis.includes(emoji)) {
          // 絵文字をデータURLに変換
          imageUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(
            emoji
          )}`;
        } else {
          // 役割に基づいたデフォルトのアイコンを使用
          const defaultEmoji =
            role === "protagonist" ? "👑" : role === "antagonist" ? "😈" : "🙂";
          imageUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(
            defaultEmoji
          )}`;
        }
      } else {
        // デフォルトのアイコン（役割に基づく）
        const defaultEmoji =
          role === "protagonist" ? "👑" : role === "antagonist" ? "😈" : "🙂";
        imageUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(
          defaultEmoji
        )}`;
      }

      // 新しいキャラクターオブジェクトを作成
      const newCharacter: Character = {
        id: "", // 呼び出し側で設定
        name: nameMatch[1].trim(),
        role,
        gender,
        birthDate: ageMatch && ageMatch[1] ? ageMatch[1].trim() : "",
        description,
        background,
        motivation,
        traits,
        relationships: [],
        imageUrl,
        customFields: [],
        statuses: [],
      };

      return newCharacter;
    } catch (error) {
      console.error("AIレスポンスのパースエラー:", error);
      return null;
    }
  };

  // AIアシスト完了時の処理
  const handleAIAssistComplete = (result: {
    response?: string;
    agentUsed?: string;
    steps?: unknown[];
  }) => {
    if (result && result.response) {
      // AIの応答をパースしてキャラクターデータに変換
      const character = parseAIResponseToCharacter(result.response);
      if (character) {
        // 新しいIDを持つキャラクターを作成
        const newCharacter = {
          ...character,
          id: uuidv4(), // 新しいIDを生成
        };

        // 現在のキャラクターリストに追加
        const updatedCharacters = [...characters, newCharacter];

        // Recoilの状態を更新（currentProjectStateを更新するとcharactersも自動的に更新される）
        if (currentProject) {
          const updatedProject = {
            ...currentProject,
            characters: updatedCharacters,
            updatedAt: new Date(),
          };

          // ローカルストレージも更新
          const projectsStr = localStorage.getItem("novelProjects");
          if (projectsStr) {
            try {
              const projects = JSON.parse(projectsStr) as Array<{
                id: string;
                [key: string]: any;
              }>;
              const projectIndex = projects.findIndex(
                (p) => p.id === currentProject.id
              );
              if (projectIndex !== -1) {
                projects[projectIndex] = updatedProject;
                localStorage.setItem("novelProjects", JSON.stringify(projects));
              }
            } catch (e) {
              console.error("Failed to update local storage projects", e);
            }
          }

          // 成功メッセージを表示
          setSnackbarMessage("AIがキャラクターを作成しました");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* ヘッダー部分 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          キャラクター
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AIAssistButton
            onAssist={handleOpenAIAssist}
            text="AIにキャラクターを考えてもらう"
            variant="outline"
            disabled={isLoading}
            className="mr-2"
          />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="表示モード"
            size="small"
            sx={{ mr: 2 }}
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
            新規キャラクター
          </Button>
        </Box>
      </Box>

      {/* キャラクター一覧 */}
      <CharacterList
        characters={characters.map((character) => ({
          ...character,
          description: character.description || "",
          background: character.background || "",
          motivation: character.motivation || "",
          traits: character.traits ?? [],
          relationships: (character.relationships ?? []).map((rel) => ({
            ...rel,
            description: rel.description || "",
          })),
          customFields: character.customFields ?? [],
          statuses: character.statuses || [],
        }))}
        viewMode={viewMode}
        onAddCharacter={handleOpenDialog}
        onEditCharacter={(character) =>
          handleEditCharacter({
            ...character,
            description: character.description || "",
            background: character.background || "",
            motivation: character.motivation || "",
            traits: character.traits ?? [],
            relationships: (character.relationships ?? []).map((rel) => ({
              ...rel,
              description: rel.description || "",
            })),
            customFields: character.customFields ?? [],
            statuses: character.statuses || [],
          })
        }
        onDeleteCharacter={handleDeleteCharacter}
      />

      {/* キャラクター編集ダイアログ */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "キャラクターを編集" : "新規キャラクター作成"}
        </DialogTitle>
        <DialogContent dividers>
          <CharacterForm
            formData={{
              ...formData,
            }}
            formErrors={formErrors}
            selectedEmoji={selectedEmoji}
            tempImageUrl={tempImageUrl}
            newTrait={newTrait}
            newCustomField={newCustomField}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onImageUpload={handleImageUpload}
            onEmojiSelect={handleEmojiSelect}
            onNewTraitChange={handleNewTraitChange}
            onAddTrait={handleAddTrait}
            onRemoveTrait={handleRemoveTrait}
            onCustomFieldChange={handleCustomFieldChange}
            onAddCustomField={handleAddCustomField}
            onRemoveCustomField={handleRemoveCustomField}
            onSave={handleSaveCharacter}
            onCancel={handleCloseDialog}
            onSaveStatus={handleSaveStatus}
            onDeleteStatus={handleDeleteStatus}
          />
        </DialogContent>
      </Dialog>

      {/* AIアシストモーダル */}
      <AIAssistModal
        open={aiAssistModalOpen}
        onClose={() => setAiAssistModalOpen(false)}
        title="AIにキャラクターを作成してもらう"
        description="あらすじとプロットを参照して、物語に登場するキャラクターを作成します。"
        defaultMessage={`プロットとあらすじを参照して、物語に登場する重要なキャラクターを作成してください。
キャラクターは物語の中で魅力的で重要な役割を持つべきです。
既存のキャラクターとも関係性を持たせるとよいでしょう。`}
        onAssistComplete={handleAIAssistComplete}
        requestAssist={handleAIAssist}
      />

      {/* スナックバー通知 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CharactersPage;
