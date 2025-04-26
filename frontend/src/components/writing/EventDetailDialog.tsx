import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { TimelineEvent } from "../../types/index";

interface EventDetailDialogProps {
  open: boolean;
  event: TimelineEvent | null;
  onClose: () => void;
  onAddToChapter?: () => void;
  isAlreadyInChapter?: boolean;
  getCharacterName?: (id: string) => string;
  getPlaceName?: (id: string) => string;
}

const EventDetailDialog: React.FC<EventDetailDialogProps> = ({
  open,
  event,
  onClose,
  onAddToChapter,
  isAlreadyInChapter = false,
  getCharacterName = (id) => id,
  getPlaceName = (id) => id,
}) => {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <EventIcon color="primary" />
        <Typography variant="h6">{event.title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            <strong>日付:</strong> {event.date}
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
            >
              {event.description}
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 2 }} />

        {event.relatedCharacters && event.relatedCharacters.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>関連キャラクター</strong>
            </Typography>
            <List dense>
              {event.relatedCharacters.map((characterId) => (
                <ListItem key={characterId}>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={getCharacterName(characterId)} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {event.relatedPlaces && event.relatedPlaces.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>関連場所</strong>
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {event.relatedPlaces.map((placeId) => (
                <Chip
                  key={placeId}
                  icon={<LocationIcon />}
                  label={getPlaceName(placeId)}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {onAddToChapter && !isAlreadyInChapter && (
          <Button
            startIcon={<AddIcon />}
            onClick={onAddToChapter}
            color="primary"
          >
            この章に追加
          </Button>
        )}
        {isAlreadyInChapter && (
          <Typography variant="caption" color="text.secondary">
            この章に追加済み
          </Typography>
        )}
        <Button onClick={onClose} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailDialog;
