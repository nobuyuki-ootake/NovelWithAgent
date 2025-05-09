import React, { useState } from "react";
import { Box, TextField, Button, Typography, CardContent } from "@mui/material";
import { Save as SaveIcon, Edit as EditIcon } from "@mui/icons-material";
import { AIAssistButton } from "../ui/AIAssistButton";
import { AIAssistModal } from "../modals/AIAssistModal";
import { useAIAssist } from "../../hooks/useAIAssist";
import { useRecoilValue } from "recoil";
import { currentProjectState } from "../../store/atoms";

interface SynopsisEditorProps {
  synopsis: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SynopsisEditor: React.FC<SynopsisEditorProps> = ({
  synopsis,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onChange,
}) => {
  const [aiAssistModalOpen, setAiAssistModalOpen] = useState(false);
  const currentProject = useRecoilValue(currentProjectState);
  const projectTitle = currentProject?.title || "";

  // AIアシスト機能
  const { assistSynopsis, isLoading } = useAIAssist({
    onSuccess: (result) => {
      // AIの応答を処理してシノプシスに設定
      if (result && result.response) {
        // テキストフィールドの変更をシミュレートするためイベントオブジェクトを作成
        const event = {
          target: { value: result.response },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    },
  });

  // AIアシストモーダルを開く
  const handleOpenAIAssist = async () => {
    // 編集モードでない場合は編集モードに切り替える
    if (!isEditing) {
      onEdit();
    }
    setAiAssistModalOpen(true);
    return Promise.resolve();
  };

  // AIアシストリクエスト実行（タイトル情報も含める）
  const handleAIAssist = async (message: string) => {
    // タイトル情報を含むコンテキスト要素を作成
    const titleContext = [
      {
        type: "title",
        id: "project-title",
        name: "作品タイトル",
        content: projectTitle,
      },
    ];

    // タイトル情報が存在する場合、それを考慮したメッセージを作成
    const enhancedMessage = projectTitle
      ? `タイトル「${projectTitle}」の小説について、${message}`
      : message;

    return await assistSynopsis(enhancedMessage, titleContext);
  };

  return (
    <CardContent>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">物語の概要</Typography>
        {isEditing ? (
          <Box>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
              onClick={onCancel}
            >
              キャンセル
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SaveIcon />}
              onClick={onSave}
              disabled={!synopsis.trim()}
            >
              保存
            </Button>
          </Box>
        ) : (
          <Box>
            <AIAssistButton
              onAssist={handleOpenAIAssist}
              text="AIに項目を埋めてもらう"
              variant="outline"
              className="mr-2"
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={onEdit}
            >
              編集
            </Button>
          </Box>
        )}
      </Box>

      {isEditing ? (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            minRows={8}
            maxRows={15}
            value={synopsis}
            onChange={onChange}
            placeholder="あなたの物語のあらすじを入力してください。主要な登場人物、設定、物語の大まかな流れを含めるとよいでしょう。"
            variant="outlined"
            autoFocus
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <AIAssistButton
              onAssist={handleOpenAIAssist}
              text="AIに項目を埋めてもらう"
              variant="outline"
              disabled={isLoading}
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          {synopsis ? (
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
            >
              {synopsis}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              まだあらすじが入力されていません。「編集」ボタンをクリックして、物語のあらすじを追加してください。または「AIに項目を埋めてもらう」ボタンを使用することもできます。
            </Typography>
          )}
        </Box>
      )}

      {/* AIアシストモーダル */}
      <AIAssistModal
        open={aiAssistModalOpen}
        onClose={() => setAiAssistModalOpen(false)}
        title="AIにあらすじを作成してもらう"
        description={`${
          projectTitle ? `「${projectTitle}」という` : ""
        }物語のあらすじを作成します。ジャンルや主人公、設定などのアイデアを入力してください。`}
        defaultMessage={`${
          projectTitle ? `「${projectTitle}」` : "次のような物語"
        }のあらすじを考えてください：`}
        onAssistComplete={() => {
          // モーダルは自動的に閉じる
        }}
        requestAssist={handleAIAssist}
      />
    </CardContent>
  );
};
