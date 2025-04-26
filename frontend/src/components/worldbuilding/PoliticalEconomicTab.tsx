import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";

interface PoliticalEconomicTabProps {
  governmentSystem: string;
  onGovernmentSystemChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  powerStructure: string;
  onPowerStructureChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  lawsAndJustice: string;
  onLawsAndJusticeChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  economicSystem: string;
  onEconomicSystemChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  tradeAndCommerce: string;
  onTradeAndCommerceChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const PoliticalEconomicTab: React.FC<PoliticalEconomicTabProps> = ({
  governmentSystem,
  onGovernmentSystemChange,
  powerStructure,
  onPowerStructureChange,
  lawsAndJustice,
  onLawsAndJusticeChange,
  economicSystem,
  onEconomicSystemChange,
  tradeAndCommerce,
  onTradeAndCommerceChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        政治と経済
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="政治体制"
        placeholder="君主制、民主制、寡頭制など政治形態について記述してください"
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
        placeholder="支配階級、権力闘争、政治的派閥などについて記述してください"
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
        label="法律と司法"
        placeholder="法体系、裁判制度、刑罰などについて記述してください"
        value={lawsAndJustice}
        onChange={onLawsAndJusticeChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="経済システム"
        placeholder="資本主義、封建制、通貨システムなどについて記述してください"
        value={economicSystem}
        onChange={onEconomicSystemChange}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="貿易と商業"
        placeholder="交易路、主要産業、貿易品などについて記述してください"
        value={tradeAndCommerce}
        onChange={onTradeAndCommerceChange}
        variant="outlined"
        margin="normal"
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        政治・経済システムは物語の背景となる社会構造を決定し、キャラクターの動機や行動に影響を与えます。
      </Typography>
    </Box>
  );
};

export default PoliticalEconomicTab;
