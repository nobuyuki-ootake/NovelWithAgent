import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";

interface WorldMapTabProps {
  mapImageUrl: string;
  onMapImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const WorldMapTab: React.FC<WorldMapTabProps> = ({
  mapImageUrl,
  onMapImageUpload,
}) => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        ワールドマップ
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: 300,
          border: "1px dashed grey",
          borderRadius: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
        }}
      >
        {mapImageUrl ? (
          <Box
            component="img"
            src={mapImageUrl}
            alt="World Map"
            sx={{
              maxWidth: "100%",
              maxHeight: "500px",
              objectFit: "contain",
            }}
          />
        ) : (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <ImageIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              世界のマップ画像をアップロードしてください
            </Typography>
          </Box>
        )}
      </Box>

      <Button
        variant="outlined"
        component="label"
        startIcon={<ImageIcon />}
        sx={{ mt: 2 }}
      >
        マップ画像をアップロード
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={onMapImageUpload}
        />
      </Button>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        物語の舞台となる世界のマップを視覚化することで、世界観をより具体的に設計できます。
        <br />
        場所や領域、地形などを描いた画像をアップロードしてください。
      </Typography>
    </Box>
  );
};

export default WorldMapTab;
