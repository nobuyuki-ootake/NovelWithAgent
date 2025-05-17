import React from "react";
import { Box, Typography } from "@mui/material";

const GeographyEnvironmentTab: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        地理と環境
      </Typography>
      <Typography paragraph>
        このページでは世界の地理的特徴や環境に関する情報を記述できます。
        機能は簡略化されています。
      </Typography>

      <Box
        sx={{
          p: 3,
          border: "1px dashed #ccc",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary">
          WorldBuildingContextの対応するメソッドが実装されていないため、このタブは現在編集できません。
        </Typography>
      </Box>
    </Box>
  );
};

export default GeographyEnvironmentTab;
