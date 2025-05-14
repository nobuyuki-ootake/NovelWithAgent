import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";
import { useWorldBuildingContext } from "../../contexts/WorldBuildingContext";
import { WorldBuilding } from "../../types";

const SocietyCultureTab: React.FC = () => {
  // WorldBuildingContextから値を取得
  const { getCurrentProjectState, updateProjectState, markTabAsUpdated } =
    useWorldBuildingContext();

  // 現在のプロジェクト情報から社会と文化の設定を取得
  const currentProject = getCurrentProjectState();
  const worldBuilding = (currentProject?.worldBuilding || {}) as WorldBuilding;

  // 変更ハンドラーを作成
  const handleFieldChange =
    (fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // プロジェクト状態を更新
      updateProjectState((project) => {
        if (!project || !project.worldBuilding) return project;

        return {
          ...project,
          worldBuilding: {
            ...project.worldBuilding,
            [fieldName]: e.target.value,
          },
        };
      });

      // タブを更新済みとしてマーク
      markTabAsUpdated(4); // 社会と文化タブのインデックス
    };

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
        value={worldBuilding.socialStructure || ""}
        onChange={handleFieldChange("socialStructure")}
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
        value={worldBuilding.government || ""}
        onChange={handleFieldChange("government")}
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
        value={worldBuilding.economy || ""}
        onChange={handleFieldChange("economy")}
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
        value={worldBuilding.religion || ""}
        onChange={handleFieldChange("religion")}
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
        value={worldBuilding.traditions || ""}
        onChange={handleFieldChange("traditions")}
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
        value={worldBuilding.language || ""}
        onChange={handleFieldChange("language")}
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
        value={worldBuilding.art || ""}
        onChange={handleFieldChange("art")}
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
        value={worldBuilding.education || ""}
        onChange={handleFieldChange("education")}
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
        value={worldBuilding.technology || ""}
        onChange={handleFieldChange("technology")}
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
