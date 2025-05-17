import React from "react";
import { Box, TextField, Typography, Divider } from "@mui/material";
import { useWorldBuildingContext } from "../../contexts/WorldBuildingContext";
import {
  getCategoryTabIndex,
  WorldBuildingElementType,
  NovelProject,
  CultureElement,
} from "@novel-ai-assistant/types";

const SocietyCultureTab: React.FC = () => {
  const { getCurrentProjectState, updateProjectState, markTabAsUpdated } =
    useWorldBuildingContext();

  const currentProject = getCurrentProjectState();

  const societyCulture = currentProject?.worldBuilding?.societyCulture as
    | CultureElement
    | undefined;

  const handleFieldChange =
    (
      fieldName: keyof Omit<
        CultureElement,
        "id" | "type" | "originalType" | "values" | "customs"
      >
    ) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const currentPrj = getCurrentProjectState();
      if (
        !currentPrj ||
        !currentPrj.worldBuilding ||
        !currentPrj.worldBuilding.societyCulture
      )
        return;

      const baseSocietyCulture = currentPrj.worldBuilding.societyCulture;

      const updatedSocietyCulture: CultureElement = {
        ...baseSocietyCulture,
        [fieldName]: e.target.value,
      };

      const updatedWorldBuilding: NovelProject["worldBuilding"] = {
        ...currentPrj.worldBuilding,
        societyCulture: updatedSocietyCulture,
      };

      const updatedProject: NovelProject = {
        ...currentPrj,
        worldBuilding: updatedWorldBuilding,
      };

      updateProjectState(updatedProject);

      markTabAsUpdated(getCategoryTabIndex(WorldBuildingElementType.CULTURE));
    };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        社会と文化 (CultureElement ベース)
      </Typography>

      <TextField
        fullWidth
        label="名前 (Name)"
        value={societyCulture?.name || ""}
        onChange={handleFieldChange("name")}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="説明 (Description)"
        value={societyCulture?.description || ""}
        onChange={handleFieldChange("description")}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="特徴 (Features)"
        value={societyCulture?.features || ""}
        onChange={handleFieldChange("features")}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        label="重要性 (Importance)"
        value={societyCulture?.importance || ""}
        onChange={handleFieldChange("importance")}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="関連 (Relations)"
        value={societyCulture?.relations || ""}
        onChange={handleFieldChange("relations")}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="社会構造 (Social Structure)"
        placeholder="階級制度、家族構成、コミュニティの組織など、社会の構造について記述してください"
        value={societyCulture?.socialStructure || ""}
        onChange={handleFieldChange("socialStructure")}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="政治と統治 (Government)"
        placeholder="統治形態、権力構造、法律、政治組織について記述してください"
        value={societyCulture?.government || ""}
        onChange={handleFieldChange("government")}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="宗教と信仰 (Religion)"
        placeholder="信仰体系、神話、儀式、宗教組織について記述してください"
        value={societyCulture?.religion || ""}
        onChange={handleFieldChange("religion")}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="言語 (Language)"
        placeholder="話されている言語、方言、特殊な言語的特徴について記述してください"
        value={societyCulture?.language || ""}
        onChange={handleFieldChange("language")}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="芸術と娯楽 (Art)"
        placeholder="芸術形式、音楽、文学、娯楽活動について記述してください"
        value={societyCulture?.art || ""}
        onChange={handleFieldChange("art")}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="技術と発明 (Technology)"
        placeholder="技術レベル、重要な発明、科学的理解について記述してください"
        value={societyCulture?.technology || ""}
        onChange={handleFieldChange("technology")}
        variant="outlined"
        margin="normal"
      />

      <Divider sx={{ my: 2 }} />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="カスタムテキスト (Custom Text)"
        value={societyCulture?.customText || ""}
        onChange={handleFieldChange("customText")}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="信仰・信念 (Beliefs)"
        value={societyCulture?.beliefs || ""}
        onChange={handleFieldChange("beliefs")}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="歴史 (History)"
        value={societyCulture?.history || ""}
        onChange={handleFieldChange("history")}
        variant="outlined"
        margin="normal"
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="メモ (Notes)"
        value={societyCulture?.notes || ""}
        onChange={handleFieldChange("notes")}
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
