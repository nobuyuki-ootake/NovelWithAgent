import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { WorldBuildingFreeField } from "../../types/index";

interface FreeFieldsTabProps {
  freeFields: WorldBuildingFreeField[];
  newFreeField: WorldBuildingFreeField;
  isEditingFreeField: boolean;
  onFreeFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onAddFreeField: () => void;
  onEditFreeField: (field: WorldBuildingFreeField) => void;
  onDeleteFreeField: (id: string) => void;
}

const FreeFieldsTab: React.FC<FreeFieldsTabProps> = ({
  freeFields,
  newFreeField,
  isEditingFreeField,
  onFreeFieldChange,
  onAddFreeField,
  onEditFreeField,
  onDeleteFreeField,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        自由入力フィールド
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        場所、文化、宗教、言語など、自由に項目を追加して世界観を豊かにしましょう
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="タイトル"
            name="title"
            value={newFreeField.title}
            onChange={onFreeFieldChange}
            placeholder="例：「主要言語」「通貨システム」「交通手段」など"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="内容"
            name="content"
            value={newFreeField.content}
            onChange={onFreeFieldChange}
            multiline
            rows={4}
            placeholder="詳細な説明を入力してください"
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={onAddFreeField}
            disabled={!newFreeField.title.trim()}
          >
            {isEditingFreeField ? "更新" : "追加"}
          </Button>
        </CardActions>
      </Card>

      {freeFields.map((field) => (
        <Accordion key={field.id} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{field.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {field.content}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEditFreeField(field)}
                sx={{ mr: 1 }}
              >
                編集
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDeleteFreeField(field.id)}
              >
                削除
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      {freeFields.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
          追加のフィールドはありません。必要に応じて追加してください。
        </Typography>
      )}
    </Box>
  );
};

export default FreeFieldsTab;
