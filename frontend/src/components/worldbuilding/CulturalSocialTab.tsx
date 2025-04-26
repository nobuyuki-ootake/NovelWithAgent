import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";

interface CulturalSocialTabProps {
  languages: string;
  onLanguagesChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  religions: string;
  onReligionsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  customs: string;
  onCustomsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  socialStructure: string;
  onSocialStructureChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  education: string;
  onEducationChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  artsEntertainment: string;
  onArtsEntertainmentChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const CulturalSocialTab: React.FC<CulturalSocialTabProps> = ({
  languages,
  onLanguagesChange,
  religions,
  onReligionsChange,
  customs,
  onCustomsChange,
  socialStructure,
  onSocialStructureChange,
  education,
  onEducationChange,
  artsEntertainment,
  onArtsEntertainmentChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        文化と社会
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="言語"
        placeholder="使用されている言語、方言、特殊な言語体系などについて記述してください"
        value={languages}
        onChange={onLanguagesChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="宗教と信仰"
        placeholder="宗教体系、神話、儀式、信仰についての詳細を記述してください"
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
        label="習慣と伝統"
        placeholder="祝祭、儀式、日常的な習慣など社会的慣行について記述してください"
        value={customs}
        onChange={onCustomsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="社会構造"
        placeholder="階級制度、家族構造、社会的地位などについて記述してください"
        value={socialStructure}
        onChange={onSocialStructureChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="教育"
        placeholder="教育システム、識字率、知識の伝達方法について記述してください"
        value={education}
        onChange={onEducationChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="芸術とエンターテイメント"
        placeholder="音楽、芸術、文学、娯楽などの文化的表現について記述してください"
        value={artsEntertainment}
        onChange={onArtsEntertainmentChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        文化的・社会的要素は世界に深みを与え、キャラクターの行動規範や価値観を形成します。
      </Typography>
    </Box>
  );
};

export default CulturalSocialTab;
