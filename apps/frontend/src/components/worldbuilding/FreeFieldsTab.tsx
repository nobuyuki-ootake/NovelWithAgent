import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { WorldBuildingFreeField } from "@novel-ai-assistant/types";

interface FreeFieldsTabProps {
  freeFields: WorldBuildingFreeField[];
}

const FreeFieldsTab: React.FC<FreeFieldsTabProps> = ({ freeFields }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        自由記述欄
      </Typography>
      <Typography paragraph sx={{ mb: 3 }}>
        世界観設定の他カテゴリに当てはまらない追加情報をここに記述できます。独自のカテゴリを作成して自由に内容を入力してください。
      </Typography>

      {freeFields && freeFields.length > 0 ? (
        <List sx={{ width: "100%" }}>
          {freeFields.map((field, index) => (
            <Paper
              key={field.id || index}
              elevation={1}
              sx={{
                mb: 2,
                p: 2,
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
              <ListItem disablePadding>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      {field.title || "無題のフィールド"}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                    >
                      {field.content || "内容がありません"}
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
            自由記述欄が作成されていません。「新しいフィールドを追加」ボタンから新しい項目を作成できます。
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FreeFieldsTab;
