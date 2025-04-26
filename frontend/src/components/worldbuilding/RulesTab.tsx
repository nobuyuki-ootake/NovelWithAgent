import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

interface RulesTabProps {
  rules: string[];
  newRule: string;
  setNewRule: (value: string) => void;
  onAddRule: () => void;
  onDeleteRule: (index: number) => void;
}

const RulesTab: React.FC<RulesTabProps> = ({
  rules,
  newRule,
  setNewRule,
  onAddRule,
  onDeleteRule,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        世界のルール
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        この世界で適用される特殊なルールや法則を定義します（例：魔法の仕組み、科学の法則など）
      </Typography>

      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField
          fullWidth
          label="新しいルール"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          placeholder="例：「この世界では重力が地球の半分しかない」"
        />
        <Button
          variant="contained"
          onClick={onAddRule}
          disabled={!newRule.trim()}
          sx={{ ml: 1 }}
        >
          追加
        </Button>
      </Box>

      <List>
        {rules.map((rule, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" onClick={() => onDeleteRule(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={rule} />
          </ListItem>
        ))}
        {rules.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: "center" }}>
            ルールがありません。追加してください。
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default RulesTab;
