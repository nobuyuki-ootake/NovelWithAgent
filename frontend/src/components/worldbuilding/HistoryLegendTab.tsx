import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";

interface HistoryLegendTabProps {
  historicalEvents: string;
  onHistoricalEventsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  ancientCivilizations: string;
  onAncientCivilizationsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  myths: string;
  onMythsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  legends: string;
  onLegendsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  folklore: string;
  onFolkloreChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  religions: string;
  onReligionsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  historicalFigures: string;
  onHistoricalFiguresChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  conflicts: string;
  onConflictsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const HistoryLegendTab: React.FC<HistoryLegendTabProps> = ({
  historicalEvents,
  onHistoricalEventsChange,
  ancientCivilizations,
  onAncientCivilizationsChange,
  myths,
  onMythsChange,
  legends,
  onLegendsChange,
  folklore,
  onFolkloreChange,
  religions,
  onReligionsChange,
  historicalFigures,
  onHistoricalFiguresChange,
  conflicts,
  onConflictsChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        歴史と伝説
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="歴史的出来事"
        placeholder="世界に影響を与えた重要な出来事、その結果、年表などについて記述してください"
        value={historicalEvents}
        onChange={onHistoricalEventsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="古代文明"
        placeholder="過去の文明、失われた帝国、その遺跡などについて記述してください"
        value={ancientCivilizations}
        onChange={onAncientCivilizationsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="神話"
        placeholder="神々、創造神話、起源物語などについて記述してください"
        value={myths}
        onChange={onMythsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="伝説"
        placeholder="英雄、怪物、伝説的な出来事などについて記述してください"
        value={legends}
        onChange={onLegendsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="民間伝承"
        placeholder="民話、迷信、伝統的な物語などについて記述してください"
        value={folklore}
        onChange={onFolkloreChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="宗教"
        placeholder="信仰システム、宗教的習慣、儀式などについて記述してください"
        value={religions}
        onChange={onReligionsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="歴史的人物"
        placeholder="王、戦士、発明家など、歴史の流れを変えた重要人物について記述してください"
        value={historicalFigures}
        onChange={onHistoricalFiguresChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="戦争・紛争"
        placeholder="主要な戦争、争い、その原因と結果について記述してください"
        value={conflicts}
        onChange={onConflictsChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        歴史と伝説は世界に深みと信憑性を与え、物語の背景や動機付けの源泉となります。
      </Typography>
    </Box>
  );
};

export default HistoryLegendTab;
