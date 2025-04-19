import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, Tabs, Tab } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import VerticalEditor from "../components/editor/VerticalEditor";
import { currentChapterSelector } from "../store/selectors";
import { currentChapterIdState, currentProjectState } from "../store/atoms";
import { createEditorValue, serializeToText } from "../utils/editorUtils";
import { Descendant } from "slate";

const WritingPage: React.FC = () => {
  const [editorValue, setEditorValue] = useState<Descendant[]>([]);
  const currentChapter = useRecoilValue(currentChapterSelector);
  const [, setCurrentChapterId] = useRecoilState(currentChapterIdState);
  const currentProject = useRecoilValue(currentProjectState);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  useEffect(() => {
    if (currentChapter) {
      setEditorValue(createEditorValue(currentChapter.content));
    } else {
      // 選択されている章がない場合は最初の章を選択
      if (currentProject && currentProject.chapters.length > 0) {
        setCurrentChapterId(currentProject.chapters[0].id);
      }
    }
  }, [currentChapter, currentProject, setCurrentChapterId]);

  const handleEditorChange = (value: Descendant[]) => {
    setEditorValue(value);
    // TODO: 実際のアプリケーションでは、バックエンドに保存する処理を追加
    console.log("Content changed:", serializeToText(value));
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTabIndex(newValue);
  };

  if (!currentProject) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>プロジェクトが選択されていません。</Typography>
      </Box>
    );
  }

  if (currentProject.chapters.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>
          章が作成されていません。まずは章を作成してください。
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          {currentProject.title}
        </Typography>
        {currentChapter && (
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {currentChapter.title}
          </Typography>
        )}
      </Paper>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={currentTabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="原稿用紙モード" />
          <Tab label="プレビューモード" />
        </Tabs>
      </Paper>

      {currentTabIndex === 0 && (
        <VerticalEditor value={editorValue} onChange={handleEditorChange} />
      )}

      {currentTabIndex === 1 && (
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
          >
            {serializeToText(editorValue)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default WritingPage;
