import React from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import CharacterCard from "../components/characters/CharacterCard";
import CharacterForm from "../components/characters/CharacterForm";
import {
  CharactersProvider,
  useCharactersContext,
} from "../contexts/CharactersContext";
import { AIAssistButton } from "../components/ui/AIAssistButton";
import {
  AIAssistModal,
  ResponseData,
} from "../components/modals/AIAssistModal";

// CharacterPageの実装コンポーネント
const CharactersPageContent: React.FC = () => {
  const {
    characters,
    formData,
    formErrors,
    selectedEmoji,
    tempImageUrl,
    newTrait,
    openDialog: isDialogOpen,
    handleOpenDialog,
    handleCloseDialog,
    handleDeleteCharacter,
    handleSaveCharacter,
    handleImageUpload,
    handleEmojiSelect,
    handleInputChange,
    handleSelectChange,
    handleAddTrait,
    handleRemoveTrait,
    handleNewTraitChange,
    handleSaveStatus,
    handleDeleteStatus,
    // AI関連の機能を追加
    aiAssistModalOpen,
    setAiAssistModalOpen,
    isLoadingAI,
    handleOpenAIAssist,
    handleAIAssist,
    handleAIAssistComplete,
    aiProgress,
    currentProject,
  } = useCharactersContext();

  // 削除確認ダイアログの状態
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);
  const [characterToDelete, setCharacterToDelete] = React.useState<
    string | null
  >(null);

  // 削除確認ダイアログを開く
  const handleOpenConfirmDelete = (characterId: string) => {
    setCharacterToDelete(characterId);
    setIsConfirmDeleteOpen(true);
  };

  // 削除確認ダイアログを閉じる
  const handleCloseConfirmDelete = () => {
    setIsConfirmDeleteOpen(false);
    setCharacterToDelete(null);
  };

  // キャラクター削除実行
  const handleConfirmDelete = () => {
    if (characterToDelete) {
      handleDeleteCharacter(characterToDelete);
      handleCloseConfirmDelete();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {currentProject?.title || "プロジェクト"}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          キャラクター
        </Typography>
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <AIAssistButton
            onAssist={handleOpenAIAssist}
            text="AIにキャラクターを考えてもらう"
            variant="default"
            disabled={isLoadingAI}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            新規キャラクター
          </Button>
        </Box>
      </Box>

      {/* 進捗状態表示 */}
      {aiProgress !== null && (
        <Box sx={{ width: "100%", mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            キャラクター生成中: {aiProgress}%
          </Typography>
          <div
            style={{
              width: "100%",
              height: "4px",
              backgroundColor: "#e0e0e0",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${aiProgress}%`,
                height: "100%",
                backgroundColor: "#1976d2",
                transition: "width 0.3s ease",
              }}
            ></div>
          </div>
        </Box>
      )}

      {/* キャラクターリスト */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 3,
        }}
      >
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onEdit={() => handleOpenDialog(character.id)}
            onDelete={() => handleOpenConfirmDelete(character.id)}
          />
        ))}
      </Box>

      {/* キャラクター編集ダイアログ */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {formData.id ? "キャラクター編集" : "新規キャラクター作成"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <CharacterForm
            formData={formData}
            formErrors={formErrors}
            selectedEmoji={selectedEmoji}
            tempImageUrl={tempImageUrl}
            newTrait={newTrait}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onImageUpload={handleImageUpload}
            onEmojiSelect={handleEmojiSelect}
            onNewTraitChange={handleNewTraitChange}
            onAddTrait={handleAddTrait}
            onRemoveTrait={handleRemoveTrait}
            onSave={handleSaveCharacter}
            onCancel={handleCloseDialog}
            onSaveStatus={handleSaveStatus}
            onDeleteStatus={handleDeleteStatus}
          />
        </DialogContent>
      </Dialog>

      {/* AI支援モーダル */}
      <AIAssistModal
        open={aiAssistModalOpen}
        onClose={() => setAiAssistModalOpen(false)}
        title="AIにキャラクターを考えてもらう"
        description="あらすじとプロットを参照して、物語に必要なキャラクターのリストを生成します。物語の要件やリクエストがあれば入力してください。"
        defaultMessage="あらすじとプロットに基づいて、この物語にふさわしいキャラクターを考えてください。"
        requestAssist={(params: { message: string; plotId?: string | null }) =>
          handleAIAssist(params) as Promise<ResponseData>
        }
        onAssistComplete={(result) => handleAIAssistComplete(result)}
        supportsBatchGeneration={true}
      />

      {/* 削除確認ダイアログ */}
      <Dialog
        open={isConfirmDeleteOpen}
        onClose={handleCloseConfirmDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>キャラクターの削除</DialogTitle>
        <DialogContent>
          <Typography>
            このキャラクターを削除してもよろしいですか？この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={handleCloseConfirmDelete}>キャンセル</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            削除
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

// メインのCharactersPageコンポーネント
const CharactersPage: React.FC = () => {
  return (
    <CharactersProvider>
      <CharactersPageContent />
    </CharactersProvider>
  );
};

export default CharactersPage;
