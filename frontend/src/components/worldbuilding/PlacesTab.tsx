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
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          地名
        </Typography>
        <Typography variant="body2" color="text.secondary">
          物語の舞台となる重要な場所を追加しましょう
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }} id="place-form">
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="地名"
              name="name"
              value={newPlace.name}
              onChange={onPlaceChange}
              placeholder="例：「エルフの森」「魔法学院」「古代遺跡」など"
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
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="説明"
              name="description"
              value={newPlace.description}
              onChange={onPlaceChange}
              multiline
              rows={3}
              placeholder="場所の詳細な説明を入力してください"
            />
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={onAddPlace}
            disabled={!newPlace.name.trim()}
            size="large"
            sx={{
              minWidth: "120px",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {isEditingPlace ? "更新" : "追加"}
          </Button>
        </CardActions>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        {places.map((place) => (
          <Accordion
            key={place.id}
            sx={{
              mb: 0,
              borderRadius: "6px",
              overflow: "hidden",
              "&:before": {
                display: "none",
              },
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
              height: "fit-content",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
                "&:hover": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.06)",
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                {place.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2">説明:</Typography>
              <Typography paragraph>{place.description}</Typography>

              <Typography variant="subtitle2">重要性:</Typography>
              <Typography paragraph>{place.significance}</Typography>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  size="medium"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => onEditPlace(place)}
                  sx={{
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                    },
                  }}
                >
                  編集
                </Button>
                <Button
                  size="medium"
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDeletePlace(place.id)}
                  sx={{
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.08)",
                    },
                  }}
                >
                  削除
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {places.length === 0 && (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(0, 0, 0, 0.02)",
            borderRadius: "8px",
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography
            color="text.secondary"
            sx={{
              fontSize: "1.1rem",
              fontWeight: "medium",
            }}
          >
            地名がありません。上記フォームから追加してください。
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PlacesTab;
