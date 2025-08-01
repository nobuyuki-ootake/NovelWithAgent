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
import { ProgressSnackbar } from "../components/ui/ProgressSnackbar";
import { useAIChatIntegration } from "../hooks/useAIChatIntegration";
import { Character } from "@novel-ai-assistant/types";

// CharacterPageの実装コンポーネント
const CharactersPageContent: React.FC = () => {
  const {
    characters,
    openDialog,
    formData,
    formErrors,
    tempImageUrl,
    selectedEmoji,
    newTrait,
    currentProject,
    handleOpenDialog,
    handleCloseDialog,
    handleImageUpload,
    handleEmojiSelect,
    handleInputChange,
    handleSelectChange,
    handleAddTrait,
    handleRemoveTrait,
    handleNewTraitChange,
    handleDeleteCharacter,
    handleSaveCharacter,
    handleSaveStatus,
    handleDeleteStatus,
    addCharacter,
    parseAIResponseToCharacters,
  } = useCharactersContext();

  const { openAIAssist } = useAIChatIntegration();

  // 削除確認ダイアログの状態
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);
  const [characterToDelete, setCharacterToDelete] = React.useState<
    string | null
  >(null);

  // プログレスバーの状態
  const [showProgressSnackbar, setShowProgressSnackbar] = React.useState(false);
  const [progressMessage, setProgressMessage] = React.useState("");
  const [progressValue, setProgressValue] = React.useState<number | undefined>(
    undefined
  );
  const [isAIProcessing, setIsAIProcessing] = React.useState(false);

  // AIアシスト機能の統合
  const handleOpenAIAssist = async (): Promise<void> => {
    try {
      console.log("=== CharactersPage: AIアシスト開始 ===");
      console.log("currentProject:", currentProject);
      console.log("プロット数:", currentProject?.plot?.length || 0);
      console.log(
        "既存キャラクター数:",
        currentProject?.characters?.length || 0
      );

      // プログレスバーの初期化は削除（実際の生成開始時に設定）

      await openAIAssist(
        "characters",
        {
          title: "AIにキャラクターを考えてもらう",
          description:
            "あらすじとプロットを参照して、物語に必要なキャラクターのリストを生成します。",
          defaultMessage:
            "プロットに基づいて、この物語にふさわしいキャラクターを考えてください。全てのプロット要素を考慮して、物語に必要なキャラクターを提案してください。",
          supportsBatchGeneration: true,
          onProgress: (
            current: number,
            total: number,
            currentCharacterName?: string
          ) => {
            // 初回のプログレス更新時にプログレスバーを表示開始
            if (!showProgressSnackbar) {
              setIsAIProcessing(true);
              setShowProgressSnackbar(true);
            }

            // プログレス更新
            const progress =
              total > 0 ? Math.round((current / total) * 100) : undefined;
            setProgressValue(progress);

            if (currentCharacterName) {
              setProgressMessage(
                `AIが「${currentCharacterName}」を生成中です... (${current}/${total})`
              );
            } else {
              setProgressMessage(
                `AIがキャラクターを生成中です... (${current}/${total})`
              );
            }
          },
          onComplete: (result) => {
            // バッチ処理の結果を処理
            console.log("=== CharactersPage: キャラクター生成完了 ===");
            console.log("結果:", result);

            try {
              if (result.content && typeof result.content === "string") {
                // バッチ処理の結果は既にフォーマットされた文字列として返される
                // parseAIResponseToCharactersで個別のキャラクターに分割
                const characters = parseAIResponseToCharacters(result.content);
                console.log(`生成されたキャラクター数: ${characters.length}`);

                characters.forEach((character: Character) => {
                  addCharacter(character);
                });

                // 成功メッセージを表示
                if (characters.length > 0) {
                  console.log(
                    `${characters.length}件のキャラクターを追加しました`
                  );
                  setProgressMessage(
                    `${characters.length}件のキャラクターを追加しました`
                  );
                  setProgressValue(100);
                } else {
                  setProgressMessage("キャラクターの生成が完了しました");
                  setProgressValue(100);
                }
              } else {
                setProgressMessage("キャラクターの生成が完了しました");
                setProgressValue(100);
              }
            } catch (error) {
              console.error("キャラクター処理エラー:", error);
              setProgressMessage("キャラクターの処理中にエラーが発生しました");
              setProgressValue(undefined);
            } finally {
              // プログレスバー終了
              setIsAIProcessing(false);
              setTimeout(() => {
                setShowProgressSnackbar(false);
                setProgressValue(undefined);
              }, 2000); // 2秒後に非表示
            }
          },
        },
        currentProject,
        [] // プロット選択は不要（全プロットを自動的に送信）
      );
    } catch (error) {
      console.error("AIアシスト処理中にエラーが発生しました:", error);

      // エラー時のプログレスバー処理
      setIsAIProcessing(false);
      setProgressMessage("AIアシスト処理中にエラーが発生しました");
      setProgressValue(undefined);
      setTimeout(() => {
        setShowProgressSnackbar(false);
      }, 3000); // 3秒後に非表示
    }
  };

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
      handleDeleteCharacter(characterToDelete, true); // skipConfirm = true
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
            disabled={false}
            showHelp={true}
            helpText="プロジェクトのあらすじとプロットを参考に、物語に適したキャラクターを自動生成します。複数のキャラクターを一度に作成できます。"
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

      {/* キャラクターリスト */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 3,
        }}
      >
        {characters.map((character: Character) => (
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
        open={openDialog}
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

      {/* プログレスバー */}
      <ProgressSnackbar
        open={showProgressSnackbar}
        message={progressMessage}
        severity={
          isAIProcessing ? "info" : progressValue === 100 ? "success" : "error"
        }
        progress={progressValue}
        loading={isAIProcessing}
        onClose={() => {
          if (!isAIProcessing) {
            setShowProgressSnackbar(false);
            setProgressValue(undefined);
          }
        }}
        position="bottom-right"
      />
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
