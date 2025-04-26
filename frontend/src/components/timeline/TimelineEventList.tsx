import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import TimelineEventCard from "./TimelineEventCard";
import { TimelineItem } from "../../hooks/useTimeline";

interface TimelineEventListProps {
  timelineItems: TimelineItem[];
  onAddEvent: () => void;
  onEditEvent: (id: string) => void;
  hasUnsavedChanges: boolean;
  onSave: () => void;
}

const TimelineEventList: React.FC<TimelineEventListProps> = ({
  timelineItems,
  onAddEvent,
  onEditEvent,
  hasUnsavedChanges,
  onSave,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">タイムラインイベント一覧</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddEvent}
          >
            イベント追加
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={onSave}
            disabled={!hasUnsavedChanges}
          >
            保存
          </Button>
        </Box>
      </Box>

      {timelineItems.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 4, textAlign: "center" }}
        >
          イベントはまだありません。「イベント追加」ボタンをクリックして最初のイベントを追加してください。
        </Typography>
      ) : (
        <Box>
          {/* 日付順に並び替え */}
          {[...timelineItems]
            .sort((a, b) => a.dateValue - b.dateValue)
            .map((item) => (
              <TimelineEventCard
                key={item.id}
                item={item}
                onEdit={onEditEvent}
              />
            ))}
        </Box>
      )}
    </Box>
  );
};

export default TimelineEventList;
