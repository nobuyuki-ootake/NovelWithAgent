import React from "react";
import { Box, Typography } from "@mui/material";

const MagicTechnologyTab: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        魔法と技術
      </Typography>
      <Typography paragraph>
        このページでは世界の魔法システムや技術に関する情報を記述できます。
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

export default MagicTechnologyTab;
