import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { Event as EventIcon, Add as AddIcon } from "@mui/icons-material";
import { TimelineEvent } from "../../types/index";

interface RelatedEventsListProps {
  events: TimelineEvent[];
  relatedEventIds: string[];
  onViewEvent: (eventId: string) => void;
  onAssignEvents: () => void;
}

const RelatedEventsList: React.FC<RelatedEventsListProps> = ({
  events,
  relatedEventIds,
  onViewEvent,
  onAssignEvents,
}) => {
  // 選択された章に関連するイベントだけをフィルタリング
  const relatedEvents = events.filter((event) =>
    relatedEventIds.includes(event.id)
  );

  return (
    <Paper elevation={1} sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6">関連イベント</Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={onAssignEvents}
          variant="outlined"
        >
          イベントを割り当て
        </Button>
      </Box>

      {relatedEvents.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            関連するイベントがありません。「イベントを割り当て」ボタンから、この章に関連するイベントを選択してください。
          </Typography>
        </Box>
      ) : (
        <List dense>
          {relatedEvents.map((event) => (
            <ListItem key={event.id} disablePadding>
              <ListItemButton onClick={() => onViewEvent(event.id)}>
                <ListItemIcon>
                  <EventIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Tooltip title={event.description}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: {
                            xs: "200px",
                            sm: "300px",
                            md: "400px",
                          },
                        }}
                      >
                        {event.date}: {event.description.substring(0, 60)}
                        {event.description.length > 60 ? "..." : ""}
                      </Typography>
                    </Tooltip>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default RelatedEventsList;
