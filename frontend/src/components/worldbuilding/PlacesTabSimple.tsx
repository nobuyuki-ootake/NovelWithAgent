import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useWorldBuildingContext } from "../../contexts/WorldBuildingContext";

// 場所オブジェクトの最小限の型定義
interface PlaceItem {
  id?: string;
  name?: string;
  type?: string;
  description?: string;
}

const PlacesTabSimple: React.FC = () => {
  const { places } = useWorldBuildingContext();
  // unknown[]型を安全に扱うためのキャスト
  const placesList = Array.isArray(places) ? (places as PlaceItem[]) : [];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        地名と場所
      </Typography>
      <Typography paragraph sx={{ mb: 3 }}>
        物語の舞台となる重要な場所や地域を定義します。都市、国、特別な場所などを記述してください。
      </Typography>

      {placesList.length > 0 ? (
        <List sx={{ width: "100%" }}>
          {placesList.map((place, index) => (
            <Paper
              key={place.id || index}
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
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
                sx={{ pt: 1 }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      {place.name || "名称未設定の場所"}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: "text.secondary" }}
                      >
                        <strong>種類:</strong> {place.type || "未指定"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                      >
                        {place.description || "説明がありません"}
                      </Typography>
                    </Box>
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
            まだ場所が定義されていません。AIアシスト機能を使って世界の場所を生成できます。
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PlacesTabSimple;
