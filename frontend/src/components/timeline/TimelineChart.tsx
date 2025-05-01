import React from "react";
import {
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  Tooltip,
  useTheme,
  Paper,
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
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        タイムラインチャート
      </Typography>
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          height: 600,
          position: "relative",
          borderRadius: 1,
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

            {/* イベント発生時間の縦線（グリッド全体に表示） */}
            {timelineItems.map((item) => {
              const { xPos } = calculateEventPosition(
                item.placeId,
                item.dateValue
              );
              const groupWidth = 100 / timelineGroups.length;
              const leftPosition = xPos * groupWidth + groupWidth / 2;

              return (
                <Box
                  key={`timeline-vline-${item.id}`}
                  sx={{
                    position: "absolute",
                    left: `${leftPosition}%`,
                    top: "40px", // ラベル部分（40px）の下から始める
                    height: "calc(100% - 40px)", // ラベル部分を除いた高さ
                    width: "1px",
                    backgroundColor: theme.palette.secondary.main,
                    opacity: 0.3,
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                />
              );
            })}

            {/* イベントドット */}
            {timelineItems.map((item) => {
              const { xPos, yPos } = calculateEventPosition(
                item.placeId,
                item.dateValue
              );

              // 各グループの中央に配置するための計算
              const groupWidth = 100 / timelineGroups.length;
              const leftPosition = xPos * groupWidth + groupWidth / 2;

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
                      left: `${leftPosition}%`,
                      top: `${yPos * 100}%`,
                      transform: "translate(-50%, 0)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      zIndex: 10,
                      "&:hover": {
                        transform: "translate(-50%, 0) scale(1.1)",
                      },
                      transition: "transform 0.2s",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(item.id);
                    }}
                  >
                    {/* イベントドット */}
                    <DotIcon
                      color="secondary"
                      fontSize="small"
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: "50%",
                        zIndex: 3,
                        marginTop: "-9px",
                        position: "relative",
                      }}
                    />

                    {/* キャラクターアイコン */}
                    {item.relatedCharacterData &&
                      item.relatedCharacterData.length > 0 && (
                        <AvatarGroup
                          max={3}
                          sx={{
                            mt: 0,
                            "& .MuiAvatar-root": {
                              width: 24,
                              height: 24,
                              fontSize: "0.75rem",
                              border: `1px solid ${theme.palette.background.paper}`,
                            },
                          }}
                        >
                          {item.relatedCharacterData.map((character) => {
                            const { color, emoji } =
                              getCharacterIcon(character);
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
      </Paper>
    </Box>
  );
};

export default TimelineChart;
