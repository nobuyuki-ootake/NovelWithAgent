import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";

interface MagicTechnologyTabProps {
  magicSystem: string;
  onMagicSystemChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  magicRules: string;
  onMagicRulesChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  magicUsers: string;
  onMagicUsersChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  artifacts: string;
  onArtifactsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  technologyLevel: string;
  onTechnologyLevelChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  inventions: string;
  onInventionsChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  energySources: string;
  onEnergySourcesChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  transportation: string;
  onTransportationChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const MagicTechnologyTab: React.FC<MagicTechnologyTabProps> = ({
  magicSystem,
  onMagicSystemChange,
  magicRules,
  onMagicRulesChange,
  magicUsers,
  onMagicUsersChange,
  artifacts,
  onArtifactsChange,
  technologyLevel,
  onTechnologyLevelChange,
  inventions,
  onInventionsChange,
  energySources,
  onEnergySourcesChange,
  transportation,
  onTransportationChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        魔法と技術
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="魔法システム"
        placeholder="魔法の源泉、種類、分類などの基本的な仕組みについて記述してください"
        value={magicSystem}
        onChange={onMagicSystemChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="魔法のルール"
        placeholder="魔法の限界、制約、代償、禁忌などについて記述してください"
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
        label="魔法使い"
        placeholder="魔法を使う人々、学習方法、組織や学校などについて記述してください"
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
        label="魔法のアーティファクト"
        placeholder="魔法の道具、武器、防具、アイテムなどについて記述してください"
        value={artifacts}
        onChange={onArtifactsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="技術レベル"
        placeholder="世界の技術発展の段階、地域による違いなどについて記述してください"
        value={technologyLevel}
        onChange={onTechnologyLevelChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="発明品"
        placeholder="重要な発明、機械、装置などについて記述してください"
        value={inventions}
        onChange={onInventionsChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="エネルギー源"
        placeholder="動力源、エネルギーの生産と使用方法などについて記述してください"
        value={energySources}
        onChange={onEnergySourcesChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="交通手段"
        placeholder="移動方法、乗り物、旅行時間などについて記述してください"
        value={transportation}
        onChange={onTransportationChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        魔法と技術は物語の世界観を特徴付け、プロットやキャラクターの可能性に大きく影響します。
      </Typography>
    </Box>
  );
};

export default MagicTechnologyTab;
