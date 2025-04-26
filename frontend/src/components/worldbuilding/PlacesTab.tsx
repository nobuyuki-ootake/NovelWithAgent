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
import { Place } from "../../types/index";

// 既存のPlace型を拡張してsignificanceを含むようにします
export interface ExtendedPlace extends Place {
  significance: string;
}

interface PlacesTabProps {
  places: ExtendedPlace[];
  newPlace: ExtendedPlace;
  isEditingPlace: boolean;
  onPlaceChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onAddPlace: () => void;
  onEditPlace: (place: ExtendedPlace) => void;
  onDeletePlace: (id: string) => void;
}

const PlacesTab: React.FC<PlacesTabProps> = ({
  places,
  newPlace,
  isEditingPlace,
  onPlaceChange,
  onAddPlace,
  onEditPlace,
  onDeletePlace,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        地名
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        物語の舞台となる重要な場所を追加しましょう
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="地名"
            name="name"
            value={newPlace.name}
            onChange={onPlaceChange}
            placeholder="例：「エルフの森」「魔法学院」「古代遺跡」など"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="説明"
            name="description"
            value={newPlace.description}
            onChange={onPlaceChange}
            multiline
            rows={3}
            placeholder="場所の詳細な説明を入力してください"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="物語における重要性"
            name="significance"
            value={newPlace.significance}
            onChange={onPlaceChange}
            multiline
            rows={2}
            placeholder="この場所が物語においてどのような役割を果たすか説明してください"
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={onAddPlace}
            disabled={!newPlace.name.trim()}
          >
            {isEditingPlace ? "更新" : "追加"}
          </Button>
        </CardActions>
      </Card>

      {places.map((place) => (
        <Accordion key={place.id} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{place.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2">説明:</Typography>
            <Typography paragraph>{place.description}</Typography>

            <Typography variant="subtitle2">重要性:</Typography>
            <Typography paragraph>{place.significance}</Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEditPlace(place)}
                sx={{ mr: 1 }}
              >
                編集
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDeletePlace(place.id)}
              >
                削除
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      {places.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
          地名がありません。追加してください。
        </Typography>
      )}
    </Box>
  );
};

export default PlacesTab;
