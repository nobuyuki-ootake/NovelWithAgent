import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";

interface NaturalEnvironmentTabProps {
  geography: string;
  onGeographyChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  climate: string;
  onClimateChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  flora: string;
  onFloraChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  fauna: string;
  onFaunaChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  seasons: string;
  onSeasonsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  naturalResources: string;
  onNaturalResourcesChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  naturalHazards: string;
  onNaturalHazardsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const NaturalEnvironmentTab: React.FC<NaturalEnvironmentTabProps> = ({
  geography,
  onGeographyChange,
  climate,
  onClimateChange,
  flora,
  onFloraChange,
  fauna,
  onFaunaChange,
  seasons,
  onSeasonsChange,
  naturalResources,
  onNaturalResourcesChange,
  naturalHazards,
  onNaturalHazardsChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        自然環境
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="地理"
        placeholder="山、川、海、平原など地形の特徴について記述してください"
        value={geography}
        onChange={onGeographyChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="気候"
        placeholder="気温、降水量、一般的な天候状態について記述してください"
        value={climate}
        onChange={onClimateChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="植物"
        placeholder="一般的な植物、特徴的な植生、重要な植物について記述してください"
        value={flora}
        onChange={onFloraChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="動物"
        placeholder="一般的な動物、特徴的な生物、重要な生物について記述してください"
        value={fauna}
        onChange={onFaunaChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="季節と時間"
        placeholder="季節の変化、日照時間、月や太陽の影響について記述してください"
        value={seasons}
        onChange={onSeasonsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="天然資源"
        placeholder="鉱物、水、森林など利用可能な自然資源について記述してください"
        value={naturalResources}
        onChange={onNaturalResourcesChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="自然災害と危険"
        placeholder="嵐、地震、火山など自然災害や環境上の危険について記述してください"
        value={naturalHazards}
        onChange={onNaturalHazardsChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        自然環境は登場人物の暮らしや行動に影響を与え、物語の背景として重要な役割を果たします。
      </Typography>
    </Box>
  );
};

export default NaturalEnvironmentTab;
