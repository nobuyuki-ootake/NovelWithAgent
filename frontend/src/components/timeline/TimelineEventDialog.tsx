import React, { useMemo } from "react";
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
  Stack,
  Divider,
  Autocomplete,
  Paper,
} from "@mui/material";
import {
  Character,
  Place,
  TimelineEvent,
  CharacterStatus,
} from "../../types/index";
import { getCharacterIcon } from "./TimelineUtils";

// デフォルトの状態を定義
const defaultStatuses: CharacterStatus[] = [
  {
    id: "default_healthy",
    name: "健康",
    type: "life",
    mobility: "normal",
    description: "心身ともに問題ない状態。",
  },
  {
    id: "default_dead",
    name: "死亡",
    type: "life",
    mobility: "impossible",
    description: "生命活動が停止した状態。",
  },
];

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
  onPostEventStatusChange: (
    characterId: string,
    newStatuses: CharacterStatus[]
  ) => void;
  definedCharacterStatuses?: CharacterStatus[];
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
  onPostEventStatusChange,
  definedCharacterStatuses = [],
}) => {
  console.log(
    "[TimelineEventDialog] definedCharacterStatuses (from props):",
    definedCharacterStatuses
  );

  const availableStatuses = useMemo(() => {
    const userDefinedIds = new Set(
      (definedCharacterStatuses || []).map((s) => s.id)
    );
    const uniqueDefaultStatuses = defaultStatuses.filter(
      (ds) => !userDefinedIds.has(ds.id)
    );
    const combined = [
      ...uniqueDefaultStatuses,
      ...(definedCharacterStatuses || []),
    ];
    console.log(
      "[TimelineEventDialog] availableStatuses (combined):",
      combined
    );
    return combined;
  }, [definedCharacterStatuses]);

  // キャラクターの状態をチップで表示するヘルパーコンポーネント (ローカルで定義)
  const CharacterStatusChips: React.FC<{ statuses?: CharacterStatus[] }> = ({
    statuses,
  }) => {
    if (!statuses || statuses.length === 0) {
      return (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ lineHeight: "normal" }}
        >
          状態なし
        </Typography>
      );
    }
    return (
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
        {statuses.map((status) => (
          <Chip
            key={status.id}
            label={status.name}
            size="small"
            variant="outlined"
            color={
              status.mobility === "normal"
                ? "success"
                : status.mobility === "slow"
                ? "warning"
                : status.mobility === "impossible"
                ? "error"
                : "default"
            }
            sx={{ mb: 0.5 }}
          />
        ))}
      </Stack>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? "イベントを編集" : "新しいイベントを追加"}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 1 }}>
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
            rows={3}
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
                        avatar={
                          character?.imageUrl ? (
                            <Avatar
                              src={character.imageUrl}
                              sx={{ width: 20, height: 20 }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                bgcolor: color,
                                color: "white",
                                width: 20,
                                height: 20,
                                fontSize: "0.8rem",
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
                    />
                  ))}
                </Box>
              )}
              label="関連地名"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 250,
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

          {newEvent.relatedCharacters &&
            newEvent.relatedCharacters.length > 0 && (
              <Box component={Paper} variant="outlined" sx={{ p: 2, mt: 1 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}>
                  キャラクターの状態変更
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2.5}>
                  {newEvent.relatedCharacters.map((charId) => {
                    const character = characters.find((c) => c.id === charId);
                    if (!character) return null;

                    const currentStatuses = character.statuses || [];
                    const postEventStatusesForChar =
                      newEvent.postEventCharacterStatuses?.[charId] || [];

                    return (
                      <Box
                        key={charId}
                        sx={{
                          borderBottom: 1,
                          borderColor: "divider",
                          pb: 2,
                          "&:last-child": { borderBottom: 0, pb: 0 },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          component="div"
                          sx={{ fontWeight: "medium" }}
                        >
                          {character.name}
                        </Typography>
                        <Stack spacing={1.5} sx={{ pl: 1 }}>
                          <Box>
                            <Typography
                              variant="caption"
                              display="block"
                              color="text.secondary"
                              gutterBottom
                              sx={{ mb: 0.2 }}
                            >
                              イベント前の状態:
                            </Typography>
                            <CharacterStatusChips statuses={currentStatuses} />
                          </Box>
                          <Autocomplete
                            multiple
                            size="small"
                            id={`post-status-${charId}`}
                            options={availableStatuses}
                            getOptionLabel={(option) => option?.name || ""}
                            value={availableStatuses.filter((opt) =>
                              postEventStatusesForChar.some(
                                (s) => s.id === opt?.id
                              )
                            )}
                            onChange={(_, selectedOptions) => {
                              onPostEventStatusChange(
                                charId,
                                selectedOptions || []
                              );
                            }}
                            isOptionEqualToValue={(option, value) =>
                              option?.id === value?.id
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                label="イベント後の状態"
                                placeholder="状態を選択"
                              />
                            )}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) =>
                                option && option.id && option.name ? (
                                  <Chip
                                    {...getTagProps({ index })}
                                    key={option.id}
                                    label={option.name}
                                    size="small"
                                    color={
                                      option.mobility === "normal"
                                        ? "success"
                                        : option.mobility === "slow"
                                        ? "warning"
                                        : option.mobility === "impossible"
                                        ? "error"
                                        : "default"
                                    }
                                  />
                                ) : null
                              )
                            }
                          />
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!newEvent.title.trim() || !newEvent.date}
        >
          {isEditing ? "更新" : "作成"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimelineEventDialog;
