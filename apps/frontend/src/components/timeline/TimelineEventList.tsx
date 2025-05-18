import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  SmartToy as SmartToyIcon,
} from "@mui/icons-material";
import TimelineEventCard from "./TimelineEventCard";
import { TimelineItem } from "../../hooks/useTimeline";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface TimelineEventListProps {
  timelineItems: TimelineItem[];
  onAddEvent: () => void;
  onAIAssist: () => void;
  onEditEvent: (id: string) => void;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onReorder?: (items: TimelineItem[]) => void;
}

const TimelineEventList: React.FC<TimelineEventListProps> = ({
  timelineItems,
  onAddEvent,
  onAIAssist,
  onEditEvent,
  hasUnsavedChanges,
  onSave,
  onReorder,
}) => {
  const [items, setItems] = React.useState<TimelineItem[]>([...timelineItems]);

  React.useEffect(() => {
    setItems([...timelineItems]);
  }, [timelineItems]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
    if (onReorder) {
      onReorder(reordered);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
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
            size="medium"
          >
            イベント追加
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SmartToyIcon />}
            onClick={onAIAssist}
            size="medium"
          >
            AIでイベント生成
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={onSave}
            disabled={!hasUnsavedChanges}
            size="medium"
          >
            保存
          </Button>
        </Box>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          bgcolor: "background.paper",
          minHeight: "100px",
        }}
      >
        {items.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", py: 2 }}
          >
            イベントはまだありません。「イベント追加」ボタンをクリックして最初のイベントを追加してください。
          </Typography>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="timeline-event-list">
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ mb: 2, opacity: snapshot.isDragging ? 0.7 : 1 }}
                        >
                          <TimelineEventCard item={item} onEdit={onEditEvent} />
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Paper>
    </Box>
  );
};

export default TimelineEventList;
