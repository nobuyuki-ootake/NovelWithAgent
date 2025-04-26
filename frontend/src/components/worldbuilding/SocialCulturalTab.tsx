import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";

interface SocialCulturalTabProps {
  socialStructure: string;
  onSocialStructureChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  customs: string;
  onCustomsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  religions: string;
  onReligionsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  languages: string;
  onLanguagesChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  arts: string;
  onArtsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const SocialCulturalTab: React.FC<SocialCulturalTabProps> = ({
  socialStructure,
  onSocialStructureChange,
  customs,
  onCustomsChange,
  religions,
  onReligionsChange,
  languages,
  onLanguagesChange,
  arts,
  onArtsChange,
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
        placeholder="階級制度、家族構成、コミュニティの組織などについて記述してください"
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
        label="風習と伝統"
        placeholder="祭り、儀式、日常の習慣、タブーなどについて記述してください"
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
        label="宗教と信仰"
        placeholder="神話、信仰体系、宗教的実践などについて記述してください"
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
        label="言語"
        placeholder="話されている言語、方言、独特の表現などについて記述してください"
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
        label="芸術と娯楽"
        placeholder="音楽、文学、視覚芸術、スポーツ、遊びなどについて記述してください"
        value={arts}
        onChange={onArtsChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        社会・文化的要素はキャラクターのアイデンティティと世界観の信憑性に深みを与えます。
      </Typography>
    </Box>
  );
};

export default SocialCulturalTab;
