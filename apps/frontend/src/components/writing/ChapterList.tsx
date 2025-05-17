import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Chapter } from "@novel-ai-assistant/types";
// import { useWritingContext } from "../../contexts/WritingContext"; // 未使用のためコメントアウト

interface ChapterListProps {
  chapters: Chapter[];
  currentChapterId: string | null;
  onSelectChapter: (chapterId: string) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  currentChapterId,
  onSelectChapter,
}) => {
  if (chapters.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          章が作成されていません
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ mb: 2 }}>
      <List dense>
        {chapters.map((chapter) => (
          <ListItem key={chapter.id} disablePadding>
            <ListItemButton
              selected={chapter.id === currentChapterId}
              onClick={() => onSelectChapter(chapter.id)}
            >
              <ListItemText
                primary={`${chapter.order}. ${chapter.title}`}
                secondary={
                  chapter.synopsis
                    ? chapter.synopsis.substring(0, 40) + "..."
                    : "概要なし"
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ChapterList;
