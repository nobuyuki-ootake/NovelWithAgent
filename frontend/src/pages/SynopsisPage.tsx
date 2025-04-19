import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentProjectState } from "../store/atoms";
import { Save as SaveIcon } from "@mui/icons-material";

const SynopsisPage: React.FC = () => {
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [synopsis, setSynopsis] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentProject) {
      setSynopsis(currentProject.synopsis || "");
    }
  }, [currentProject]);

  const handleSynopsisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSynopsis(e.target.value);
  };

  const handleSave = () => {
    if (currentProject) {
      // 実際のアプリケーションではここでAPIリクエストを行い、バックエンドに保存する
      setCurrentProject({
        ...currentProject,
        synopsis,
        updatedAt: new Date(),
      });
      setIsEditing(false);
    }
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
          あらすじ
        </Typography>
      </Paper>

      <Card sx={{ mb: 3 }}>
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
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "キャンセル" : "編集"}
            </Button>
          </Box>

          {isEditing ? (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                minRows={8}
                maxRows={15}
                value={synopsis}
                onChange={handleSynopsisChange}
                placeholder="あなたの物語のあらすじを入力してください。主要な登場人物、設定、物語の大まかな流れを含めるとよいでしょう。"
                variant="outlined"
              />
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!synopsis.trim()}
                >
                  保存
                </Button>
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
                  まだあらすじが入力されていません。「編集」ボタンをクリックして、物語のあらすじを追加してください。
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AIアシスタントのヒント
          </Typography>
          <Typography variant="body2" color="text.secondary">
            効果的なあらすじの書き方：
          </Typography>
          <Box component="ul" sx={{ mt: 1 }}>
            <Typography component="li" variant="body2">
              主人公の目標と障害を明確にする
            </Typography>
            <Typography component="li" variant="body2">
              物語の主要な転換点を含める
            </Typography>
            <Typography component="li" variant="body2">
              物語の舞台設定と時代背景を簡潔に説明する
            </Typography>
            <Typography component="li" variant="body2">
              最終的な結末まで含める（ネタバレを気にする必要はありません）
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            必要な支援が欲しい場合は、右側のチャットパネルからAIアシスタントに質問できます。
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SynopsisPage;
