import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useWorldBuildingContext } from "../../contexts/WorldBuildingContext";
import { v4 as uuidv4 } from "uuid";
import { Rule } from "../../types"; // Ruleはindex.tsでRuleElementのエイリアス

// ルールアイテムの最小限の型定義
interface RuleItem {
  id: string;
  name?: string;
  description?: string;
  limitations?: string;
  exceptions?: string;
  [key: string]: unknown;
}

const RulesTab: React.FC = () => {
  // コンテキストから必要な機能を取得
  const {
    getCurrentProjectState,
    updateProjectState,
    addPendingRule,
    pendingRules,
    saveAllPendingElements,
    markTabAsUpdated,
    rules,
  } = useWorldBuildingContext();

  // unknown[]型を安全に扱うためのキャスト
  const rulesList = Array.isArray(rules) ? (rules as RuleItem[]) : [];

  // 状態管理
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // プロジェクトからルールを読み込む
  useEffect(() => {
    const currentProject = getCurrentProjectState();
    if (currentProject?.worldBuilding?.rules) {
      // 既存のルールを保持
      if (currentProject.worldBuilding.rules.length > 0) {
        const firstRule = currentProject.worldBuilding.rules[0];
        setCurrentRule(firstRule as unknown as Rule);
      }
    }
  }, [getCurrentProjectState]);

  // 未保存のルールをUIに反映
  useEffect(() => {
    if (pendingRules.length > 0 && rulesList.length > 0) {
      // 既存のルールとペンディング中のルールを結合
      const allRules = [...rulesList].map((rule) => rule as unknown) as Rule[];

      // ペンディングルールを追加（既存のものは上書き）
      pendingRules.forEach((pendingRule) => {
        const existingIndex = allRules.findIndex(
          (r) => r.id === pendingRule.id
        );
        if (existingIndex >= 0) {
          allRules[existingIndex] = pendingRule;
        } else {
          allRules.push(pendingRule);
        }
      });

      if (allRules.length > 0) {
        setCurrentRule(allRules[0]);
      }
    }
  }, [pendingRules, rulesList]);

  // 新規ルール作成ダイアログを開く
  const handleOpenNewDialog = () => {
    setCurrentRule({
      id: uuidv4(),
      name: "",
      description: "",
      limitations: "",
      exceptions: "",
      impact: "",
      origin: "",
      type: "",
      originalType: "",
      features: "",
      importance: "",
      relations: "",
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  // ルール削除
  const handleDelete = (id: string) => {
    if (!Array.isArray(rules)) return;

    const updatedRules = rulesList.filter((rule) => rule.id !== id);

    if (updatedRules.length > 0) {
      setCurrentRule(updatedRules[0] as unknown as Rule);
    } else {
      setCurrentRule(null);
    }

    // 世界観データを更新
    updateProjectState((project) => {
      if (!project || !project.worldBuilding) return project;

      // プロジェクトを直接変更せず、新しいオブジェクトを返す
      return {
        ...project,
        worldBuilding: {
          ...project.worldBuilding,
          rules: updatedRules,
        },
      };
    });

    // タブを更新済みとマーク
    markTabAsUpdated(2); // ルールタブのインデックス
  };

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentRule(null);
  };

  // ルールの保存
  const handleSaveRule = () => {
    if (!currentRule) return;

    // ルールを保存（編集または新規追加）
    if (isEditing && Array.isArray(rules)) {
      const updatedRules = rulesList.map((rule) =>
        rule.id === currentRule.id ? (currentRule as unknown as RuleItem) : rule
      );

      if (updatedRules.length > 0) {
        setCurrentRule(updatedRules[0] as unknown as Rule);
      }

      // 世界観データを更新
      updateProjectState((project) => {
        if (!project || !project.worldBuilding) return project;

        // プロジェクトを直接変更せず、新しいオブジェクトを返す
        return {
          ...project,
          worldBuilding: {
            ...project.worldBuilding,
            rules: updatedRules,
          },
        };
      });
    } else {
      // 新しいルールを保存
      addPendingRule(currentRule);

      // すぐに保存
      saveAllPendingElements();
    }

    // タブを更新済みとマーク
    markTabAsUpdated(2); // ルールタブのインデックス

    // ダイアログを閉じる
    handleCloseDialog();
  };

  // 入力フィールドの変更を処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!currentRule) return;

    setCurrentRule({
      ...currentRule,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">ルールと法則</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewDialog}
        >
          新しいルールを追加
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mb: 3 }}>
        この世界の物理法則、魔法のルール、特殊能力の制限などを定義します。ルールは物語の整合性を保ち、キャラクターの行動に制約を与えます。
      </Typography>

      {rulesList && rulesList.length > 0 ? (
        <List sx={{ width: "100%" }}>
          {rulesList.map((rule, index) => (
            <Paper
              key={rule.id || index}
              elevation={1}
              sx={{
                mb: 2,
                p: 2,
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(rule.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
                sx={{ pt: 1 }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      {rule.name || "名称未設定のルール"}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                    >
                      {rule.description || "説明がありません"}
                    </Typography>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      ) : (
        <Box
          sx={{
            p: 3,
            border: "1px dashed #ccc",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography color="text.secondary">
            まだルールが定義されていません。AIアシスト機能を使って世界のルールを生成できます。
          </Typography>
        </Box>
      )}

      {/* ルール編集/追加ダイアログ */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="rule-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="rule-dialog-title">
          {isEditing ? "ルールを編集" : "新しいルールを追加"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="ルール名"
            type="text"
            fullWidth
            variant="outlined"
            value={currentRule?.name || ""}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="ルールの説明"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={currentRule?.description || ""}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="limitations"
            label="制限（オプション）"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={currentRule?.limitations || ""}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="exceptions"
            label="例外（オプション）"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={currentRule?.exceptions || ""}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button
            onClick={handleSaveRule}
            variant="contained"
            color="primary"
            disabled={!currentRule?.name || !currentRule?.description}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RulesTab;
