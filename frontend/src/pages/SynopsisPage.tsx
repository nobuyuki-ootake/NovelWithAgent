import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { currentProjectState, appModeState } from "../store/atoms";
import { Save as SaveIcon, Edit as EditIcon } from "@mui/icons-material";

const SynopsisPage: React.FC = () => {
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [, setAppMode] = useRecoilState(appModeState);
  const [synopsis, setSynopsis] = useState("");
  const [originalSynopsis, setOriginalSynopsis] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [navigationIntent, setNavigationIntent] = useState<{
    type: string;
    destination?: string;
  } | null>(null);

  // 初期データのロード
  useEffect(() => {
    if (currentProject) {
      setSynopsis(currentProject.synopsis || "");
      setOriginalSynopsis(currentProject.synopsis || "");
    }
  }, [currentProject]);

  // 編集開始時の処理
  const handleStartEditing = () => {
    setIsEditing(true);
    setOriginalSynopsis(synopsis); // 編集前の状態を保存
  };

  // 変更検知
  const hasUnsavedChanges = isEditing && synopsis !== originalSynopsis;

  // シノプシスの変更ハンドラ
  const handleSynopsisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSynopsis(e.target.value);
  };

  // 保存ハンドラ
  const handleSave = () => {
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        synopsis,
        updatedAt: new Date(),
      });
      setIsEditing(false);
      setOriginalSynopsis(synopsis); // 保存後は元の状態を更新
    }
  };

  // キャンセルハンドラ
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowAlertDialog(true);
      setNavigationIntent({ type: "cancel" });
    } else {
      setSynopsis(originalSynopsis);
      setIsEditing(false);
    }
  };

  // ナビゲーションハンドラ（サイドメニュー切替時）
  const handleNavigation = useCallback(
    (destination: string) => {
      if (hasUnsavedChanges) {
        setShowAlertDialog(true);
        setNavigationIntent({ type: "navigation", destination });
      } else {
        setAppMode(destination as any);
      }
    },
    [hasUnsavedChanges, setAppMode]
  );

  // アラートダイアログのキャンセル
  const handleDialogCancel = () => {
    setShowAlertDialog(false);
    setNavigationIntent(null);
  };

  // アラートダイアログの続行（保存せずに移動）
  const handleDialogContinue = () => {
    setShowAlertDialog(false);

    if (!navigationIntent) return;

    if (navigationIntent.type === "cancel") {
      setSynopsis(originalSynopsis);
      setIsEditing(false);
    } else if (
      navigationIntent.type === "navigation" &&
      navigationIntent.destination
    ) {
      setIsEditing(false);
      setAppMode(navigationIntent.destination as any);
    }

    setNavigationIntent(null);
  };

  // ページ離脱時の警告
  useEffect(() => {
    // F5更新や戻るボタン押下時の処理
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    // サイドメニュークリック時のカスタムイベント
    const handleModeChangeAttempt = (e: CustomEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        handleNavigation(e.detail.mode);
      }
    };

    // イベントリスナーの登録
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener(
      "modeChangeAttempt",
      handleModeChangeAttempt as EventListener
    );

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener(
        "modeChangeAttempt",
        handleModeChangeAttempt as EventListener
      );
    };
  }, [hasUnsavedChanges, handleNavigation]);

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
            {isEditing ? (
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={handleCancel}
                >
                  キャンセル
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!synopsis.trim()}
                >
                  保存
                </Button>
              </Box>
            ) : (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={handleStartEditing}
              >
                編集
              </Button>
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
                onChange={handleSynopsisChange}
                placeholder="あなたの物語のあらすじを入力してください。主要な登場人物、設定、物語の大まかな流れを含めるとよいでしょう。"
                variant="outlined"
                autoFocus
              />
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

      {/* 未保存警告ダイアログ */}
      <Dialog
        open={showAlertDialog}
        onClose={handleDialogCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          変更が保存されていません
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            あらすじに加えた変更が保存されていません。保存せずに移動すると、変更内容は失われます。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleDialogContinue} color="error" autoFocus>
            保存せずに続行
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SynopsisPage;
