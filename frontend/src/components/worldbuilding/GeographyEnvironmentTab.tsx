import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";

interface GeographyEnvironmentTabProps {
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
  resources: string;
  onResourcesChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  settlements: string;
  onSettlementsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  naturalDisasters: string;
  onNaturalDisastersChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  seasonalChanges: string;
  onSeasonalChangesChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const GeographyEnvironmentTab: React.FC<GeographyEnvironmentTabProps> = ({
  geography,
  onGeographyChange,
  climate,
  onClimateChange,
  flora,
  onFloraChange,
  fauna,
  onFaunaChange,
  resources,
  onResourcesChange,
  settlements,
  onSettlementsChange,
  naturalDisasters,
  onNaturalDisastersChange,
  seasonalChanges,
  onSeasonalChangesChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        地理と環境
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="地理的特徴"
        placeholder="山脈、海洋、川、湖、森林、砂漠など、主要な地理的特徴について記述してください"
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
        placeholder="温度、降水量、気象パターン、世界の異なる地域の気候について記述してください"
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
        placeholder="特徴的な植物、作物、植生について記述してください"
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
        placeholder="野生動物、家畜、特徴的な生物について記述してください"
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
        label="天然資源"
        placeholder="鉱物、金属、燃料、その他の価値ある資源について記述してください"
        value={resources}
        onChange={onResourcesChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="居住地"
        placeholder="都市、町、村、その他の居住地について記述してください"
        value={settlements}
        onChange={onSettlementsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="自然災害"
        placeholder="地震、洪水、火山活動、その他の環境的脅威について記述してください"
        value={naturalDisasters}
        onChange={onNaturalDisastersChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="季節の変化"
        placeholder="季節のサイクル、重要な季節的イベント、時間の経過について記述してください"
        value={seasonalChanges}
        onChange={onSeasonalChangesChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        地理と環境は物語の舞台を設定し、キャラクターの行動や文化に大きな影響を与えます。
      </Typography>
    </Box>
  );
};

export default GeographyEnvironmentTab;
