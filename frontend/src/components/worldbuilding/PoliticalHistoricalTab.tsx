import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";

interface PoliticalHistoricalTabProps {
  governmentSystem: string;
  onGovernmentSystemChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  powerStructure: string;
  onPowerStructureChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  conflicts: string;
  onConflictsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  majorEvents: string;
  onMajorEventsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  historicalFigures: string;
  onHistoricalFiguresChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  lawsRegulations: string;
  onLawsRegulationsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const PoliticalHistoricalTab: React.FC<PoliticalHistoricalTabProps> = ({
  governmentSystem,
  onGovernmentSystemChange,
  powerStructure,
  onPowerStructureChange,
  conflicts,
  onConflictsChange,
  majorEvents,
  onMajorEventsChange,
  historicalFigures,
  onHistoricalFiguresChange,
  lawsRegulations,
  onLawsRegulationsChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        政治と歴史
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="政治体制"
        placeholder="君主制、民主制、寡頭制など、統治形態について記述してください"
        value={governmentSystem}
        onChange={onGovernmentSystemChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="権力構造"
        placeholder="指導者、政治組織、権力の分配などについて記述してください"
        value={powerStructure}
        onChange={onPowerStructureChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="紛争と対立"
        placeholder="現在または過去の戦争、紛争、内部対立などについて記述してください"
        value={conflicts}
        onChange={onConflictsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="主要な歴史的出来事"
        placeholder="社会を形作った重要な出来事や転換点について記述してください"
        value={majorEvents}
        onChange={onMajorEventsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="歴史的人物"
        placeholder="歴史に影響を与えた重要な人物やその功績について記述してください"
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
        label="法律と規制"
        placeholder="社会を統治する重要な法律、規則、タブーについて記述してください"
        value={lawsRegulations}
        onChange={onLawsRegulationsChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        政治的・歴史的背景は物語の文脈を深め、キャラクターの動機や行動に意味を与えます。
      </Typography>
    </Box>
  );
};

export default PoliticalHistoricalTab;
