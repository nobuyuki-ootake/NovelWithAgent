import React from "react";
import { Box, Typography } from "@mui/material";

const HistoryLegendTab: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        歴史と伝説
      </Typography>
      <Typography paragraph>
        このページでは世界の歴史や伝説に関する情報を記述できます。
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

export default HistoryLegendTab;
