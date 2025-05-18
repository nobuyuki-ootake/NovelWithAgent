import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Event as EventIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { TimelineItem } from "../../hooks/useTimeline";
import moment from "moment";
import { getEventTypeIconComponent } from "./TimelineUtils";

interface TimelineEventCardProps {
  item: TimelineItem;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TimelineEventCard: React.FC<TimelineEventCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        position: "relative",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {item.eventType && (
            <Tooltip title={item.eventType}>
              {React.createElement(getEventTypeIconComponent(item.eventType), {
                sx: { mr: 1, color: "action.active" },
                fontSize: "medium",
              })}
            </Tooltip>
          )}
          <Typography variant="h6" component="div">
            {item.title}
          </Typography>
        </Box>
        <Box>
          <Tooltip title="編集">
            <IconButton
              size="small"
              onClick={() => onEdit(item.id)}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {onDelete && (
            <Tooltip title="削除">
              <IconButton
                size="small"
                onClick={() => onDelete(item.id)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 0.5 }}>
        <EventIcon fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          {moment(item.date).format("YYYY年MM月DD日")}
        </Typography>
      </Box>

      {item.placeName && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 0.5 }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {item.placeName}
          </Typography>
        </Box>
      )}

      {item.description && (
        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
          {item.description}
        </Typography>
      )}

      {item.relatedCharacterNames && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <PersonIcon fontSize="small" color="action" />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {item.relatedCharacterData &&
              item.relatedCharacterData.map((character) => (
                <Chip
                  key={character.id}
                  label={character.name}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default TimelineEventCard;
