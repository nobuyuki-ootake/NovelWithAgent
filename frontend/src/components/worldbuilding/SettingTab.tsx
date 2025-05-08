import React, { useState } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import { AIAssistButton } from "../ui/AIAssistButton";
import { AIAssistModal } from "../modals/AIAssistModal";
import { useAIAssist } from "../../hooks/useAIAssist";
import { useRecoilValue } from "recoil";
import { currentProjectState } from "../../store/atoms";

interface SettingTabProps {
  description: string;
  onDescriptionChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  history: string;
  onHistoryChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const SettingTab: React.FC<SettingTabProps> = ({
  description,
  onDescriptionChange,
  history,
  onHistoryChange,
}) => {
  const [aiAssistModalOpen, setAiAssistModalOpen] = useState(false);
  const [aiAssistTarget, setAiAssistTarget] = useState<
    "description" | "history"
  >("description");
  const currentProject = useRecoilValue(currentProjectState);

  // AIアシスト機能
  const { assistWorldBuilding, isLoading } = useAIAssist({
    onSuccess: (result) => {
      if (result && result.response) {
        applyAIResponse(result.response, aiAssistTarget);
      }
    },
  });

  // AIアシストモーダルを開く
  const handleOpenAIAssist =
    (target: "description" | "history") => async () => {
      setAiAssistTarget(target);
      setAiAssistModalOpen(true);
      return Promise.resolve();
    };

  // AIアシストリクエスト実行
  const handleAIAssist = async (message: string) => {
    // あらすじとキャラクター情報を参照して世界観設定を生成
    const synopsis = currentProject?.synopsis || "";
    const characters = currentProject?.characters || [];

    return await assistWorldBuilding(message, [
      { type: "synopsis", content: synopsis },
      ...characters.map((char) => ({ type: "character", content: char })),
    ]);
  };

  // AIの応答を適用する関数
  const applyAIResponse = (
    aiResponse: string,
    target: "description" | "history"
  ) => {
    // テキストフィールドの変更をシミュレートするためイベントオブジェクトを作成
    const event = {
      target: { value: aiResponse.trim() },
    } as React.ChangeEvent<HTMLInputElement>;

    if (target === "description") {
      onDescriptionChange(event);
    } else {
      onHistoryChange(event);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        世界観の設定
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <AIAssistButton
          onAssist={handleOpenAIAssist("description")}
          text="AIに世界の説明を提案してもらう"
          variant="outline"
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={5}
        label="世界の説明"
        placeholder="この物語の世界について説明してください"
        value={description}
        onChange={onDescriptionChange}
        variant="outlined"
        margin="normal"
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1, mt: 2 }}>
        <AIAssistButton
          onAssist={handleOpenAIAssist("history")}
          text="AIに世界の歴史を提案してもらう"
          variant="outline"
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={8}
        label="世界の歴史"
        placeholder="この世界の歴史的背景について記述してください"
        value={history}
        onChange={onHistoryChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        世界観の特徴や歴史的な背景を詳細に設定することで、
        物語に深みと一貫性を与えることができます。
      </Typography>

      {/* AIアシストモーダル */}
      <AIAssistModal
        open={aiAssistModalOpen}
        onClose={() => setAiAssistModalOpen(false)}
        title={
          aiAssistTarget === "description"
            ? "AIに世界の説明を提案してもらう"
            : "AIに世界の歴史を提案してもらう"
        }
        description={
          aiAssistTarget === "description"
            ? "あらすじやキャラクター情報を参照して、物語の世界設定を生成します。"
            : "あらすじやキャラクター情報を参照して、物語の世界の歴史を生成します。"
        }
        defaultMessage={
          `あらすじとキャラクター情報を参照して、${
            aiAssistTarget === "description"
              ? "物語の世界設定（場所、環境、独自の要素など）"
              : "物語の世界の歴史（過去の出来事、文明の発展、重要な転換点など）"
          }を考えてください。\n\n` +
          `現在のあらすじ:\n${
            currentProject?.synopsis || "（あらすじがありません）"
          }`
        }
        onAssistComplete={() => {
          // モーダルは自動的に閉じる
        }}
        requestAssist={handleAIAssist}
      />
    </Box>
  );
};

export default SettingTab;
