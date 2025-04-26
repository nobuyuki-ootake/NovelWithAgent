import React from "react";
import {
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  Tooltip,
  useTheme,
} from "@mui/material";
import { FiberManualRecord as DotIcon } from "@mui/icons-material";
import { TimelineItem, TimelineGroup } from "../../hooks/useTimeline";
import { getCharacterIcon } from "./TimelineUtils";

interface TimelineChartProps {
  timelineItems: TimelineItem[];
  timelineGroups: TimelineGroup[];
  dateArray: Array<{ date: number; label: string }>;
  calculateEventPosition: (
    placeId: string,
    dateValue: number
  ) => { xPos: number; yPos: number };
  onEventClick: (id: string) => void;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  timelineItems,
  timelineGroups,
  dateArray,
  calculateEventPosition,
  onEventClick,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: 600,
        position: "relative",
        my: 2,
        bgcolor: "background.paper",
        borderRadius: 1,
        boxShadow: 1,
        overflow: "hidden",
      }}
    >
      {/* タイムライングリッド */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* X軸（場所）ラベル */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: 40,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          {timelineGroups.map((group, index) => (
            <Box
              key={group.id}
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: 1,
                borderRight: index < timelineGroups.length - 1 ? 1 : 0,
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle2" noWrap>
                {group.title}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Y軸（時間）ラベルと水平線 */}
        <Box
          sx={{
            position: "relative",
            height: "calc(100% - 40px)",
            width: "100%",
          }}
        >
          {dateArray.map((dateInfo, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: `${(index / (dateArray.length - 1)) * 100}%`,
                width: "100%",
                borderTop: 1,
                borderColor: "divider",
                zIndex: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  left: 8,
                  top: -10,
                  bgcolor: "background.paper",
                  px: 0.5,
                  color: "text.secondary",
                }}
              >
                {dateInfo.label}
              </Typography>
            </Box>
          ))}

          {/* 縦線（場所の区切り） */}
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
            }}
          >
            {timelineGroups.map((group, index) => (
              <Box
                key={group.id}
                sx={{
                  flex: 1,
                  height: "100%",
                  borderRight: index < timelineGroups.length - 1 ? 1 : 0,
                  borderColor: "divider",
                }}
              />
            ))}
          </Box>

          {/* イベントドット */}
          {timelineItems.map((item) => {
            const { xPos, yPos } = calculateEventPosition(
              item.placeId,
              item.dateValue
            );
            const left = `${(xPos / timelineGroups.length) * 100}%`;
            const top = `${yPos * 100}%`;

            return (
              <Tooltip
                key={item.id}
                title={
                  <Box sx={{ p: 0.5 }}>
                    <Typography variant="subtitle2">{item.title}</Typography>
                    <Typography variant="body2">{item.date}</Typography>
                    {item.description && (
                      <Typography variant="body2">
                        {item.description}
                      </Typography>
                    )}
                    {item.relatedCharacterNames && (
                      <Typography variant="caption">
                        登場人物: {item.relatedCharacterNames}
                      </Typography>
                    )}
                  </Box>
                }
              >
                <Box
                  sx={{
                    position: "absolute",
                    left,
                    top,
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    "&:hover": {
                      transform: "translate(-50%, -50%) scale(1.1)",
                    },
                    transition: "transform 0.2s",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(item.id);
                  }}
                >
                  <DotIcon color="secondary" fontSize="small" />

                  {/* キャラクターアイコン */}
                  {item.relatedCharacterData &&
                    item.relatedCharacterData.length > 0 && (
                      <AvatarGroup
                        max={3}
                        sx={{
                          mt: 0.5,
                          "& .MuiAvatar-root": {
                            width: 24,
                            height: 24,
                            fontSize: "0.75rem",
                            border: `1px solid ${theme.palette.background.paper}`,
                          },
                        }}
                      >
                        {item.relatedCharacterData.map((character) => {
                          const { color, emoji } = getCharacterIcon(character);
                          return character.imageUrl ? (
                            <Avatar
                              key={character.id}
                              src={character.imageUrl}
                              alt={character.name}
                            />
                          ) : (
                            <Avatar
                              key={character.id}
                              alt={character.name}
                              sx={{
                                bgcolor: color,
                                color: "white",
                              }}
                            >
                              {emoji}
                            </Avatar>
                          );
                        })}
                      </AvatarGroup>
                    )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default TimelineChart;
