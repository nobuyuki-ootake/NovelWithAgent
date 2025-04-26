import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";

interface MagicSystemTabProps {
  magicType: string;
  onMagicTypeChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  magicRules: string;
  onMagicRulesChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  magicSources: string;
  onMagicSourcesChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  magicLimitations: string;
  onMagicLimitationsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  magicUsers: string;
  onMagicUsersChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  magicalCreatures: string;
  onMagicalCreaturesChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  magicItems: string;
  onMagicItemsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  magicHistory: string;
  onMagicHistoryChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const MagicSystemTab: React.FC<MagicSystemTabProps> = ({
  magicType,
  onMagicTypeChange,
  magicRules,
  onMagicRulesChange,
  magicSources,
  onMagicSourcesChange,
  magicLimitations,
  onMagicLimitationsChange,
  magicUsers,
  onMagicUsersChange,
  magicalCreatures,
  onMagicalCreaturesChange,
  magicItems,
  onMagicItemsChange,
  magicHistory,
  onMagicHistoryChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        魔法システム
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="魔法の種類"
        placeholder="エレメンタル魔法、精霊魔法、秘術など、魔法の種類や分類について記述してください"
        value={magicType}
        onChange={onMagicTypeChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="魔法の法則"
        placeholder="魔法がどのように機能するか、その基本原理や法則について記述してください"
        value={magicRules}
        onChange={onMagicRulesChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="魔法の源泉"
        placeholder="魔法のエネルギー源や力の由来について記述してください"
        value={magicSources}
        onChange={onMagicSourcesChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="魔法の制限"
        placeholder="魔法の限界、代償、リスクなど、使用における制約について記述してください"
        value={magicLimitations}
        onChange={onMagicLimitationsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="魔法使い"
        placeholder="魔法を使える人々、その特徴や社会的地位について記述してください"
        value={magicUsers}
        onChange={onMagicUsersChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="魔法生物"
        placeholder="魔法的な能力を持つ生物や存在について記述してください"
        value={magicalCreatures}
        onChange={onMagicalCreaturesChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="魔法アイテム"
        placeholder="魔法の道具、武器、防具など、特殊な効果を持つアイテムについて記述してください"
        value={magicItems}
        onChange={onMagicItemsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="魔法の歴史"
        placeholder="魔法の起源、発展、重要な魔法的出来事について記述してください"
        value={magicHistory}
        onChange={onMagicHistoryChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        魔法システムは物語世界の独自性を高め、ストーリー展開やキャラクターの能力に大きな影響を与えます。
      </Typography>
    </Box>
  );
};

export default MagicSystemTab;
