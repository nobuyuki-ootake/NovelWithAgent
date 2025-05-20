import React, { JSX } from "react";
import {
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Stack,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { VerticalContentEditorWrapper } from "../components/editor";
import ChapterList from "../components/writing/ChapterList";
import WritingPreview from "../components/writing/WritingPreview";
import NewChapterDialog from "../components/writing/NewChapterDialog";
import AssignEventsDialog from "../components/writing/AssignEventsDialog";
import EventDetailDialog from "../components/writing/EventDetailDialog";
import RelatedEventsList from "../components/writing/RelatedEventsList";
import { WritingProvider, useWritingContext } from "../contexts/WritingContext";
import {
  NovelProject,
  TimelineEvent,
  PlaceElement,
} from "@novel-ai-assistant/types";
import { AIChapterGenerationParams } from "../contexts/WritingContext";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";

// WritingPageの実装コンポーネント
const WritingPageContent: () => JSX.Element | null = () => {
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
    isAiProcessing,
    aiUserInstructions,
    aiTargetLength,
    setAiUserInstructions,
    setAiTargetLength,
    generateChapterByAI,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    closeSnackbar,
  } = useWritingContext();

  const localHandleGenerateChapterByAI = async () => {
    if (!currentChapter || !currentProject || !timelineEvents) return;

    const relatedEventDetails: AIChapterGenerationParams["relatedEvents"] =
      currentChapter.relatedEvents
        ?.map((eventId) => timelineEvents.find((event) => event.id === eventId))
        .filter((event): event is TimelineEvent => !!event)
        .map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
        })) || [];

    const characterIdsInEvents = relatedEventDetails.reduce(
      (
        acc: Set<string>,
        eventDetail: { id: string; title: string; description: string }
      ) => {
        const event = timelineEvents.find((e) => e.id === eventDetail.id);
        event?.relatedCharacters?.forEach((charId) => acc.add(charId));
        return acc;
      },
      new Set<string>()
    );

    const charactersInChapter: AIChapterGenerationParams["charactersInChapter"] =
      Array.from(characterIdsInEvents).map((charId) => {
        const char = (currentProject.characters || []).find(
          (c: { id: string }) => c.id === charId
        );
        return {
          id: charId,
          name: char?.name || "不明なキャラクター",
          description: char?.description || "",
          role: char?.role || "supporting",
        };
      });

    const locationIdsInEvents = relatedEventDetails.reduce(
      (
        acc: Set<string>,
        eventDetail: { id: string; title: string; description: string }
      ) => {
        const event = timelineEvents.find((e) => e.id === eventDetail.id);
        event?.relatedPlaces?.forEach((placeId) => acc.add(placeId));
        if (event?.placeId) acc.add(event.placeId);
        return acc;
      },
      new Set<string>()
    );

    const selectedLocations: AIChapterGenerationParams["selectedLocations"] =
      Array.from(locationIdsInEvents).map((placeId) => {
        const place = (currentProject.worldBuilding?.places || []).find(
          (p) => p.id === placeId
        ) as PlaceElement | undefined;
        return {
          id: placeId,
          name: place?.name || "不明な場所",
          description: place?.description || "",
        };
      });

    const params: AIChapterGenerationParams = {
      chapterTitle: currentChapter.title,
      relatedEvents: relatedEventDetails,
      charactersInChapter: charactersInChapter,
      selectedLocations: selectedLocations,
      userInstructions: aiUserInstructions,
      targetChapterLength: aiTargetLength || undefined,
    };

    await generateChapterByAI(params);
  };

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
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 112px)",
      }}
    >
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
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {currentChapter && (
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSaveContent}
                disabled={isAiProcessing}
              >
                保存
              </Button>
            )}
            {currentChapter && currentTabIndex === 0 && (
              <>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="ai-target-length-label">章の長さ</InputLabel>
                  <Select
                    labelId="ai-target-length-label"
                    value={aiTargetLength}
                    label="章の長さ"
                    onChange={(e) =>
                      setAiTargetLength(
                        e.target.value as "short" | "medium" | "long" | ""
                      )
                    }
                    disabled={isAiProcessing}
                  >
                    <MenuItem value="">
                      <em>指定なし</em>
                    </MenuItem>
                    <MenuItem value="short">短め</MenuItem>
                    <MenuItem value="medium">普通</MenuItem>
                    <MenuItem value="long">長め</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="AIへの追加指示"
                  size="small"
                  variant="outlined"
                  value={aiUserInstructions}
                  onChange={(e) => setAiUserInstructions(e.target.value)}
                  disabled={isAiProcessing}
                  sx={{ flexGrow: 1, minWidth: 150 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    isAiProcessing ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <AutoFixHighIcon />
                    )
                  }
                  onClick={localHandleGenerateChapterByAI}
                  disabled={isAiProcessing || !currentChapter}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  AIに執筆してもらう
                </Button>
              </>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenNewChapterDialog}
              disabled={isAiProcessing}
            >
              新規章作成
            </Button>
          </Box>
        </Box>
      </Paper>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ flexGrow: 1, overflow: "hidden" }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "25%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChapterList
            chapters={(currentProject as NovelProject).chapters}
            currentChapterId={currentChapterId}
            onSelectChapter={handleChapterSelect}
          />

          {currentChapter && (
            <Box sx={{ mt: 2, flexGrow: 1, overflowY: "auto" }}>
              <RelatedEventsList
                events={timelineEvents || []}
                relatedEventIds={currentChapter.relatedEvents || []}
                onViewEvent={handleOpenEventDetailDialog}
                onAssignEvents={handleOpenAssignEventsDialog}
              />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "75%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
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
                <Paper
                  elevation={1}
                  sx={{
                    flexGrow: 1,
                    p: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <VerticalContentEditorWrapper
                    value={editorValue}
                    onChange={handleEditorChange}
                  />
                  <Typography
                    variant="caption"
                    sx={{ textAlign: "right", p: 1, mt: "auto" }}
                  >
                    文字数: {serializeToText(editorValue).length}
                  </Typography>
                </Paper>
              )}

              {currentTabIndex === 1 && (
                <Paper
                  elevation={1}
                  sx={{ flexGrow: 1, p: 1, overflowY: "auto" }}
                >
                  <WritingPreview content={serializeToText(editorValue)} />
                </Paper>
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
        events={timelineEvents || []}
        selectedEvents={selectedEvents}
        characters={(currentProject as NovelProject).characters || []}
        places={(currentProject as NovelProject).worldBuilding?.places || []}
        allPlots={(currentProject as NovelProject).plot || []}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
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
