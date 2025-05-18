import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { TimelineEventSeed } from "@novel-ai-assistant/types";

export interface EventSeedReviewDialogProps {
  open: boolean;
  onClose: () => void;
  eventSeeds: TimelineEventSeed[];
  onConfirm: (selectedSeeds: TimelineEventSeed[]) => void;
  // 将来的にキャラクター名や場所名を表示するために必要になる可能性があります
  // getCharacterName?: (id: string) => string;
  // getPlaceName?: (id: string) => string;
}

const EventSeedReviewDialog: React.FC<EventSeedReviewDialogProps> = ({
  open,
  onClose,
  eventSeeds,
  onConfirm,
}) => {
  const [selectedSeeds, setSelectedSeeds] = useState<TimelineEventSeed[]>([]);

  useEffect(() => {
    // ダイアログが開くたびに選択状態をリセット
    if (open) {
      setSelectedSeeds([]);
    }
  }, [open]);

  const handleToggle = (seed: TimelineEventSeed) => () => {
    const currentIndex = selectedSeeds.findIndex((s) => s.id === seed.id);
    const newSelectedSeeds = [...selectedSeeds];

    if (currentIndex === -1) {
      newSelectedSeeds.push(seed);
    } else {
      newSelectedSeeds.splice(currentIndex, 1);
    }
    setSelectedSeeds(newSelectedSeeds);
  };

  const handleConfirm = () => {
    onConfirm(selectedSeeds);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>AIが生成したイベント候補</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" gutterBottom>
          以下のイベント候補からタイムラインに追加したいものを選択してください。
        </Typography>
        {eventSeeds.length === 0 ? (
          <Typography
            sx={{ textAlign: "center", color: "text.secondary", mt: 2 }}
          >
            表示できるイベント候補はありません。
          </Typography>
        ) : (
          <List sx={{ maxHeight: "60vh", overflow: "auto" }}>
            {eventSeeds.map((seed) => (
              <Paper key={seed.id} elevation={1} sx={{ mb: 2 }}>
                <ListItem
                  role={undefined}
                  dense
                  onClick={handleToggle(seed)}
                  sx={{ cursor: "pointer", alignItems: "flex-start" }}
                >
                  <ListItemIcon sx={{ mt: 1 }}>
                    <Checkbox
                      edge="start"
                      checked={selectedSeeds.some((s) => s.id === seed.id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": `checkbox-list-label-${seed.id}`,
                      }}
                    />
                  </ListItemIcon>
                  <Box>
                    <Typography
                      variant="h6"
                      component="div"
                      id={`checkbox-list-label-${seed.id}`}
                    >
                      {seed.eventName}
                    </Typography>
                    {seed.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        説明: {seed.description}
                      </Typography>
                    )}
                    {seed.estimatedTime && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        時期(目安): {seed.estimatedTime}
                      </Typography>
                    )}
                    {seed.characterIds && seed.characterIds.length > 0 && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        関連キャラ: {seed.characterIds.join(", ")}
                      </Typography>
                    )}
                    {seed.relatedPlaceIds &&
                      seed.relatedPlaceIds.length > 0 && (
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          関連場所: {seed.relatedPlaceIds.join(", ")}
                        </Typography>
                      )}
                    {(seed.relatedPlotTitles &&
                      seed.relatedPlotTitles.length > 0) ||
                    (seed.relatedPlotIds && seed.relatedPlotIds.length > 0) ? (
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        関連プロット:{" "}
                        {(seed.relatedPlotTitles &&
                        seed.relatedPlotTitles.length > 0
                          ? seed.relatedPlotTitles
                          : seed.relatedPlotIds!
                        ).join(", ")}
                      </Typography>
                    ) : null}
                  </Box>
                </ListItem>
                <Divider />
              </Paper>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedSeeds.length === 0}
        >
          選択した {selectedSeeds.length} 件をタイムラインに追加
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventSeedReviewDialog;
