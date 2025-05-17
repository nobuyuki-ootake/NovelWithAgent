import React from "react";
import {
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Stack,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { VerticalContentEditorWrapper } from "../components/editor";
import ChapterList from "../components/writing/ChapterList";
import WritingPreview from "../components/writing/WritingPreview";
import NewChapterDialog from "../components/writing/NewChapterDialog";
import AssignEventsDialog from "../components/writing/AssignEventsDialog";
import EventDetailDialog from "../components/writing/EventDetailDialog";
import RelatedEventsList from "../components/writing/RelatedEventsList";
import { WritingProvider, useWritingContext } from "../contexts/WritingContext";
import { NovelProject } from "@novel-ai-assistant/types";

// WritingPageの実装コンポーネント
const WritingPageContent: React.FC = () => {
  const {
    editorValue,
    currentChapter,
    currentProject,
    currentTabIndex,
    currentChapterId,
    timelineEvents,
    newChapterDialogOpen,
    newChapterTitle,
    newChapterSynopsis,
    assignEventsDialogOpen,
    selectedEvents,
    eventDetailDialogOpen,
    selectedEvent,
    handleEditorChange,
    handleTabChange,
    handleChapterSelect,
    handleOpenNewChapterDialog,
    handleCloseNewChapterDialog,
    setNewChapterTitle,
    setNewChapterSynopsis,
    handleCreateChapter,
    handleOpenAssignEventsDialog,
    handleCloseAssignEventsDialog,
    handleToggleEvent,
    handleAssignEvents,
    handleOpenEventDetailDialog,
    handleCloseEventDetailDialog,
    handleAddEventToChapter,
    handleAddNewEvent,
    handleSaveContent,
    serializeToText,
  } = useWritingContext();

  // キャラクター名を取得する関数
  const getCharacterName = (characterId: string) => {
    const characters = (currentProject as NovelProject)?.characters || [];
    const character = characters.find(
      (c: { id: string }) => c.id === characterId
    );
    return character ? character.name : characterId;
  };

  // 場所名を取得する関数
  const getPlaceName = (placeId: string) => {
    const places =
      (currentProject as NovelProject)?.worldBuilding?.places || [];
    const place = places.find((p: { id: string }) => p.id === placeId);
    return place ? place.name : placeId;
  };

  if (!currentProject) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>プロジェクトが選択されていません。</Typography>
      </Box>
    );
  }

  const isEventAlreadyInChapter = (eventId: string) => {
    return currentChapter?.relatedEvents?.includes(eventId) ?? false;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              {(currentProject as NovelProject).title}
            </Typography>
            {currentChapter && (
              <Typography variant="h5" color="text.secondary">
                {currentChapter.title}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {currentChapter && (
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSaveContent}
              >
                保存
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenNewChapterDialog}
            >
              新規章作成
            </Button>
          </Box>
        </Box>
      </Paper>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Box sx={{ width: { xs: "100%", md: "25%" } }}>
          <ChapterList
            chapters={(currentProject as NovelProject).chapters}
            currentChapterId={currentChapterId}
            onSelectChapter={handleChapterSelect}
          />

          {currentChapter && (
            <RelatedEventsList
              events={timelineEvents}
              relatedEventIds={currentChapter.relatedEvents || []}
              onViewEvent={handleOpenEventDetailDialog}
              onAssignEvents={handleOpenAssignEventsDialog}
            />
          )}
        </Box>

        <Box sx={{ width: { xs: "100%", md: "75%" } }}>
          {currentChapter ? (
            <>
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
                <Box sx={{ position: "relative" }}>
                  <VerticalContentEditorWrapper
                    value={editorValue}
                    onChange={handleEditorChange}
                  />
                  <Box
                    sx={{
                      position: "fixed",
                      bottom: 32,
                      right: 32,
                      zIndex: 100,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveContent}
                    >
                      保存
                    </Button>
                  </Box>
                </Box>
              )}

              {currentTabIndex === 1 && (
                <WritingPreview content={serializeToText(editorValue)} />
              )}
            </>
          ) : (
            <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                章が選択されていません
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                左側のリストから章を選択するか、新しい章を作成してください。
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenNewChapterDialog}
              >
                新規章作成
              </Button>
            </Paper>
          )}
        </Box>
      </Stack>

      {/* ダイアログコンポーネント */}
      <NewChapterDialog
        open={newChapterDialogOpen}
        title={newChapterTitle}
        synopsis={newChapterSynopsis}
        onClose={handleCloseNewChapterDialog}
        onTitleChange={setNewChapterTitle}
        onSynopsisChange={setNewChapterSynopsis}
        onCreateChapter={handleCreateChapter}
      />

      <AssignEventsDialog
        open={assignEventsDialogOpen}
        events={timelineEvents}
        selectedEvents={selectedEvents}
        characters={(currentProject as NovelProject).characters || []}
        places={(currentProject as NovelProject).worldBuilding?.places || []}
        onClose={handleCloseAssignEventsDialog}
        onToggle={handleToggleEvent}
        onSave={handleAssignEvents}
        onViewEventDetails={handleOpenEventDetailDialog}
        onAddNewEvent={handleAddNewEvent}
        getCharacterName={getCharacterName}
        getPlaceName={getPlaceName}
      />

      <EventDetailDialog
        open={eventDetailDialogOpen}
        event={selectedEvent}
        onClose={handleCloseEventDetailDialog}
        onAddToChapter={
          selectedEvent && !isEventAlreadyInChapter(selectedEvent.id)
            ? () => handleAddEventToChapter(selectedEvent.id)
            : undefined
        }
        isAlreadyInChapter={
          selectedEvent ? isEventAlreadyInChapter(selectedEvent.id) : false
        }
        getCharacterName={getCharacterName}
        getPlaceName={getPlaceName}
      />
    </Box>
  );
};

// ラッパーコンポーネント
const WritingPage: React.FC = () => {
  return (
    <WritingProvider>
      <WritingPageContent />
    </WritingProvider>
  );
};

export default WritingPage;
