import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";

interface SocietyCultureTabProps {
  socialStructure: string;
  onSocialStructureChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  government: string;
  onGovernmentChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  economy: string;
  onEconomyChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  religion: string;
  onReligionChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  traditions: string;
  onTraditionsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  language: string;
  onLanguageChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  art: string;
  onArtChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  education: string;
  onEducationChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  technology: string;
  onTechnologyChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const SocietyCultureTab: React.FC<SocietyCultureTabProps> = ({
  socialStructure,
  onSocialStructureChange,
  government,
  onGovernmentChange,
  economy,
  onEconomyChange,
  religion,
  onReligionChange,
  traditions,
  onTraditionsChange,
  language,
  onLanguageChange,
  art,
  onArtChange,
  education,
  onEducationChange,
  technology,
  onTechnologyChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        社会と文化
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="社会構造"
        placeholder="階級制度、家族構成、コミュニティの組織など、社会の構造について記述してください"
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
        label="政治と統治"
        placeholder="統治形態、権力構造、法律、政治組織について記述してください"
        value={government}
        onChange={onGovernmentChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="経済"
        placeholder="交易システム、通貨、主要産業、資源の分配方法について記述してください"
        value={economy}
        onChange={onEconomyChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="宗教と信仰"
        placeholder="信仰体系、神話、儀式、宗教組織について記述してください"
        value={religion}
        onChange={onReligionChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="伝統と習慣"
        placeholder="祝祭、儀式、タブー、日常的な習慣について記述してください"
        value={traditions}
        onChange={onTraditionsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="言語"
        placeholder="話されている言語、方言、特殊な言語的特徴について記述してください"
        value={language}
        onChange={onLanguageChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="芸術と娯楽"
        placeholder="芸術形式、音楽、文学、娯楽活動について記述してください"
        value={art}
        onChange={onArtChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="教育"
        placeholder="教育システム、知識の伝達方法、学問について記述してください"
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
        label="技術と発明"
        placeholder="技術レベル、重要な発明、科学的理解について記述してください"
        value={technology}
        onChange={onTechnologyChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        社会と文化は登場人物の世界観、価値観、行動の動機を形成する重要な要素です。
      </Typography>
    </Box>
  );
};

export default SocietyCultureTab;
