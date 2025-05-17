import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
  Box,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { Event as EventIcon, Add as AddIcon } from "@mui/icons-material";
import { TimelineEvent, Character, Place } from "@novel-ai-assistant/types";
import TimelineEventDialog from "../timeline/TimelineEventDialog";
import { v4 as uuidv4 } from "uuid";
// import { useWritingContext } from "../../contexts/WritingContext"; // 未使用のためコメントアウト

interface AssignEventsDialogProps {
  open: boolean;
  events: TimelineEvent[];
  selectedEvents: string[];
  characters: Character[];
  places: Place[];
  onClose: () => void;
  onToggle: (eventId: string) => void;
  onSave: () => void;
  onViewEventDetails: (eventId: string) => void;
  onAddNewEvent: (event: TimelineEvent) => void;
  getCharacterName: (id: string) => string;
  getPlaceName: (id: string) => string;
}

const AssignEventsDialog: React.FC<AssignEventsDialogProps> = ({
  open,
  events,
  selectedEvents,
  characters,
  places,
  onClose,
  onToggle,
  onSave,
  onViewEventDetails,
  onAddNewEvent,
  getCharacterName,
  getPlaceName,
}) => {
  // イベント作成ダイアログの状態
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEvent, setNewEvent] = useState<TimelineEvent>({
    id: "",
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    relatedCharacters: [],
    relatedPlaces: [],
    order: 0,
  });

  // イベント作成ダイアログを開く
  const handleOpenEventDialog = useCallback(() => {
    setNewEvent({
      id: "",
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      relatedCharacters: [],
      relatedPlaces: [],
      order: 0,
    });
    setIsEditing(false);
    setEventDialogOpen(true);
  }, []);

  // イベント作成ダイアログを閉じる
  const handleCloseEventDialog = useCallback(() => {
    setEventDialogOpen(false);
  }, []);

  // イベントの変更を処理
  const handleEventChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewEvent({
        ...newEvent,
        [name]: value,
      });
    },
    [newEvent]
  );

  // 関連キャラクターの変更を処理
  const handleCharactersChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;
      setNewEvent({
        ...newEvent,
        relatedCharacters: typeof value === "string" ? value.split(",") : value,
      });
    },
    [newEvent]
  );

  // 関連場所の変更を処理
  const handlePlacesChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;
      setNewEvent({
        ...newEvent,
        relatedPlaces: typeof value === "string" ? value.split(",") : value,
      });
    },
    [newEvent]
  );

  // 新しいイベントを保存
  const handleSaveEvent = useCallback(() => {
    if (!newEvent.title.trim() || !newEvent.date) {
      return;
    }

    const eventWithId = {
      ...newEvent,
      id: uuidv4(),
    };

    // 親コンポーネントに新しいイベントを通知
    onAddNewEvent(eventWithId);

    // ダイアログを閉じる
    setEventDialogOpen(false);
  }, [newEvent, onAddNewEvent]);

  if (events.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>イベントの割り当て</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            プロジェクトにタイムラインイベントがありません。
            <br />
            新しいイベントを作成して、章に割り当てることができます。
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenEventDialog}
            fullWidth
          >
            新規イベント作成
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            閉じる
          </Button>
        </DialogActions>

        {/* イベント作成ダイアログ */}
        <TimelineEventDialog
          open={eventDialogOpen}
          isEditing={isEditing}
          newEvent={newEvent}
          characters={characters}
          places={places}
          onClose={handleCloseEventDialog}
          onSave={handleSaveEvent}
          onEventChange={handleEventChange}
          onCharactersChange={handleCharactersChange}
          onPlacesChange={handlePlacesChange}
          getCharacterName={getCharacterName}
          getPlaceName={getPlaceName}
          onPostEventStatusChange={() => {}}
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>章に関連するイベントを選択</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          この章に関連するイベントを選択してください。選択したイベントは章の執筆中に参照できます。
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenEventDialog}
          sx={{ mb: 2 }}
        >
          新規イベント作成
        </Button>

        <Divider sx={{ mb: 2 }} />

        <List sx={{ width: "100%" }}>
          {events.map((event) => {
            const isSelected = selectedEvents.includes(event.id);
            return (
              <ListItem
                key={event.id}
                disablePadding
                secondaryAction={
                  <Button
                    size="small"
                    onClick={() => onViewEventDetails(event.id)}
                  >
                    詳細
                  </Button>
                }
              >
                <ListItemButton
                  role={undefined}
                  onClick={() => onToggle(event.id)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EventIcon fontSize="small" color="primary" />
                        <Typography variant="body1">{event.title}</Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          日付: {event.date}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {event.description.substring(0, 100)}
                          {event.description.length > 100 ? "..." : ""}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          キャンセル
        </Button>
        <Button onClick={onSave} color="primary" variant="contained">
          保存
        </Button>
      </DialogActions>

      {/* イベント作成ダイアログ */}
      <TimelineEventDialog
        open={eventDialogOpen}
        isEditing={isEditing}
        newEvent={newEvent}
        characters={characters}
        places={places}
        onClose={handleCloseEventDialog}
        onSave={handleSaveEvent}
        onEventChange={handleEventChange}
        onCharactersChange={handleCharactersChange}
        onPlacesChange={handlePlacesChange}
        getCharacterName={getCharacterName}
        getPlaceName={getPlaceName}
        onPostEventStatusChange={() => {}}
      />
    </Dialog>
  );
};

export default AssignEventsDialog;
