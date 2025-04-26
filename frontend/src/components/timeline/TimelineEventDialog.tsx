import React from "react";
import {
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  SelectChangeEvent,
} from "@mui/material";
import { Character, Place } from "../../types";
import { getCharacterIcon } from "./TimelineUtils";
import { TimelineEvent } from "../../types/index";

interface TimelineEventDialogProps {
  open: boolean;
  isEditing: boolean;
  newEvent: TimelineEvent;
  characters: Character[];
  places: Place[];
  onClose: () => void;
  onSave: () => void;
  onEventChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCharactersChange: (event: SelectChangeEvent<string[]>) => void;
  onPlacesChange: (event: SelectChangeEvent<string[]>) => void;
  getCharacterName: (id: string) => string;
  getPlaceName: (id: string) => string;
}

const TimelineEventDialog: React.FC<TimelineEventDialogProps> = ({
  open,
  isEditing,
  newEvent,
  characters,
  places,
  onClose,
  onSave,
  onEventChange,
  onCharactersChange,
  onPlacesChange,
  getCharacterName,
  getPlaceName,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? "イベントを編集" : "新しいイベントを追加"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            name="title"
            label="イベントタイトル"
            fullWidth
            value={newEvent.title}
            onChange={onEventChange}
            placeholder="例：「主人公の故郷が襲撃される」「重要な手がかりを発見」など"
          />

          <TextField
            name="date"
            label="日付"
            type="date"
            fullWidth
            value={newEvent.date}
            onChange={onEventChange}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            name="description"
            label="説明"
            multiline
            rows={4}
            fullWidth
            value={newEvent.description}
            onChange={onEventChange}
            placeholder="イベントの詳細を入力してください"
          />

          <FormControl fullWidth>
            <InputLabel id="characters-select-label">
              関連キャラクター
            </InputLabel>
            <Select
              labelId="characters-select-label"
              multiple
              value={newEvent.relatedCharacters}
              onChange={onCharactersChange}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const character = characters.find((c) => c.id === value);
                    const { color, emoji } = character
                      ? getCharacterIcon(character)
                      : { color: "#808080", emoji: "👤" };

                    return (
                      <Chip
                        key={value}
                        label={getCharacterName(value)}
                        size="small"
                        color="secondary"
                        avatar={
                          character?.imageUrl ? (
                            <Avatar src={character.imageUrl} />
                          ) : (
                            <Avatar
                              sx={{
                                bgcolor: color,
                                color: "white",
                              }}
                            >
                              {emoji}
                            </Avatar>
                          )
                        }
                      />
                    );
                  })}
                </Box>
              )}
              label="関連キャラクター"
            >
              {characters.map((character) => {
                const { color, emoji } = getCharacterIcon(character);
                return (
                  <MenuItem key={character.id} value={character.id}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={character.imageUrl}
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          fontSize: "0.75rem",
                          bgcolor: !character.imageUrl ? color : undefined,
                          color: !character.imageUrl ? "white" : undefined,
                        }}
                      >
                        {!character.imageUrl && emoji}
                      </Avatar>
                      {character.name}
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="places-select-label">関連地名</InputLabel>
            <Select
              labelId="places-select-label"
              multiple
              value={newEvent.relatedPlaces}
              onChange={onPlacesChange}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={getPlaceName(value)}
                      size="small"
                      color="primary"
                    />
                  ))}
                </Box>
              )}
              label="関連地名"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {places.length === 0 ? (
                <MenuItem disabled>
                  <Box sx={{ textAlign: "center", width: "100%", py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      地名が登録されていません。世界観構築ページで地名を追加してください。
                    </Typography>
                  </Box>
                </MenuItem>
              ) : (
                places.map((place) => (
                  <MenuItem key={place.id} value={place.id}>
                    {place.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button
          onClick={onSave}
          color="primary"
          variant="contained"
          disabled={!newEvent.title.trim() || !newEvent.date}
        >
          {isEditing ? "更新" : "追加"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimelineEventDialog;
