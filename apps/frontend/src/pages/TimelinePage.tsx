import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Button,
  Snackbar,
  Alert,
  Typography,
  Divider,
} from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { useTimeline } from "../hooks/useTimeline";
import TimelineEventDialog from "../components/timeline/TimelineEventDialog";
import TimelineSettingsDialog from "../components/timeline/TimelineSettingsDialog";
import TimelineEventList from "../components/timeline/TimelineEventList";
import TimelineChart from "../components/timeline/TimelineChart";
import { AIAssistModal } from "../components/modals/AIAssistModal";
import { useTimelineAI } from "../hooks/useTimelineAI";
import EventSeedReviewDialog from "../components/timeline/EventSeedReviewDialog";
import {
  TimelineEventSeed,
  TimelineEvent,
  PlotElement,
} from "@novel-ai-assistant/types";

const convertSeedToTimelineEvent = (
  seed: TimelineEventSeed,
  currentTimelineItems: TimelineEvent[],
  indexInBatch: number
): TimelineEvent => {
  const maxOrder = currentTimelineItems.reduce(
    (max, item) => Math.max(max, item.order || 0),
    0
  );
  return {
    id: crypto.randomUUID(),
    title: seed.eventName,
    description: seed.description || "",
    date: seed.estimatedTime || new Date().toISOString(),
    relatedCharacters: seed.characterIds || [],
    relatedPlaces: seed.relatedPlaceIds || [],
    order: maxOrder + 1 + indexInBatch,
    // postEventCharacterStatuses はAIシード段階ではないため初期値なし(undefined)
  };
};

const TimelinePage: React.FC = () => {
  const {
    currentProject,
    timelineItems,
    timelineGroups,
    characters,
    places,
    hasUnsavedChanges,
    dialogOpen,
    isEditing,
    newEvent,
    settingsDialogOpen,
    timelineSettings,
    snackbarOpen,
    snackbarMessage,
    dateArray,
    definedCharacterStatuses,
    handleOpenDialog,
    handleCloseDialog,
    handleEventChange,
    handleCharactersChange,
    handlePlacesChange,
    handleSaveEvent,
    handleOpenSettingsDialog,
    handleCloseSettingsDialog,
    handleSaveSettings,
    handleSettingsChange,
    handleEventClick,
    handleSave,
    handleCloseSnackbar,
    getCharacterName,
    getPlaceName,
    calculateEventPosition,
    handleReorderEvents,
    handlePostEventStatusChange,
    addTimelineEventsBatch,
    allPlots,
    handleRelatedPlotsChange,
  } = useTimeline();

  const plots = currentProject?.plot || [];

  const {
    eventSeeds,
    isLoading: isAILoading,
    error: aiError,
    generateEventSeeds,
  } = useTimelineAI();

  const [aiAssistModalOpen, setAiAssistModalOpen] = useState(false);
  const [aiErrorSnackbarOpen, setAiErrorSnackbarOpen] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState("");
  const [reviewableEventSeeds, setReviewableEventSeeds] = useState<
    TimelineEventSeed[]
  >([]);
  const [eventSeedReviewDialogOpen, setEventSeedReviewDialogOpen] =
    useState(false);

  const handleOpenAIAssistModal = () => {
    setAiAssistModalOpen(true);
  };

  const handleTimelineAIAssist = async (params: {
    message: string;
    plotId?: string | null;
  }) => {
    setAiAssistModalOpen(false);
    await generateEventSeeds({
      prompt: params.message,
      plotId: params.plotId,
      allPlots: plots,
    });
  };

  useEffect(() => {
    if (eventSeeds && eventSeeds.length > 0) {
      console.log("AIによって生成されたイベントの種:", eventSeeds);
      setReviewableEventSeeds(eventSeeds);
      setEventSeedReviewDialogOpen(true);
    }
  }, [eventSeeds]);

  useEffect(() => {
    if (aiError) {
      console.error("AI処理エラー:", aiError);
      setAiErrorMessage(aiError.message || "AI処理中にエラーが発生しました。");
      setAiErrorSnackbarOpen(true);
    }
  }, [aiError]);

  const handleCloseAiErrorSnackbar = () => {
    setAiErrorSnackbarOpen(false);
    setAiErrorMessage("");
  };

  const handleConfirmEventSeeds = (selectedSeeds: TimelineEventSeed[]) => {
    console.log("ユーザーが選択したイベントの種:", selectedSeeds);

    const newEvents: TimelineEvent[] = selectedSeeds.map((seed, index) =>
      convertSeedToTimelineEvent(seed, currentProject?.timeline || [], index)
    );

    console.log("変換された新しいタイムラインイベント:", newEvents);

    if (newEvents.length > 0) {
      addTimelineEventsBatch(newEvents);
    }

    setEventSeedReviewDialogOpen(false);
  };

  console.log(
    "[TimelinePage] definedCharacterStatuses from useTimeline:",
    definedCharacterStatuses
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* ページヘッダー */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">タイムライン</Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<SettingsIcon />}
              onClick={handleOpenSettingsDialog}
              size="small"
            >
              タイムライン設定
            </Button>
          </Box>
          <Divider />
        </Box>

        {/* イベント一覧セクション */}
        <TimelineEventList
          timelineItems={timelineItems}
          onAddEvent={() => handleOpenDialog()}
          onAIAssist={handleOpenAIAssistModal}
          onEditEvent={handleEventClick}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={handleSave}
          onReorder={handleReorderEvents}
        />

        {/* タイムラインチャート */}
        <TimelineChart
          timelineItems={timelineItems}
          timelineGroups={timelineGroups}
          dateArray={dateArray}
          calculateEventPosition={calculateEventPosition}
          onEventClick={handleEventClick}
        />
      </Paper>

      {/* イベント追加/編集ダイアログ */}
      <TimelineEventDialog
        open={dialogOpen}
        isEditing={isEditing}
        newEvent={newEvent}
        characters={characters}
        places={places}
        onClose={handleCloseDialog}
        onSave={handleSaveEvent}
        onEventChange={handleEventChange}
        onCharactersChange={handleCharactersChange}
        onPlacesChange={handlePlacesChange}
        getCharacterName={getCharacterName}
        getPlaceName={getPlaceName}
        onPostEventStatusChange={handlePostEventStatusChange}
        definedCharacterStatuses={definedCharacterStatuses}
        allPlots={allPlots}
        onRelatedPlotsChange={handleRelatedPlotsChange}
      />

      {/* タイムライン設定ダイアログ */}
      <TimelineSettingsDialog
        open={settingsDialogOpen}
        timelineSettings={timelineSettings}
        onClose={handleCloseSettingsDialog}
        onSave={handleSaveSettings}
        onSettingsChange={handleSettingsChange}
      />

      {/* AI支援モーダル (仮配置、詳細は後で) */}
      <AIAssistModal
        open={aiAssistModalOpen}
        onClose={() => setAiAssistModalOpen(false)}
        title="AIでタイムラインイベントを生成"
        description="どのようなイベントを生成したいか、AIへの指示を入力してください。物語の特定の時期、関与するキャラクター、プロットの展開などを指定すると効果的です。"
        defaultMessage="例: 主人公が最初の試練に直面するイベントを3つ提案してください。"
        requestAssist={handleTimelineAIAssist}
        isLoading={isAILoading}
        plots={plots}
      />

      {/* スナックバー通知 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* AIエラー用スナックバー */}
      <Snackbar
        open={aiErrorSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseAiErrorSnackbar}
      >
        <Alert onClose={handleCloseAiErrorSnackbar} severity="error">
          {aiErrorMessage}
        </Alert>
      </Snackbar>

      <EventSeedReviewDialog
        open={eventSeedReviewDialogOpen}
        onClose={() => setEventSeedReviewDialogOpen(false)}
        eventSeeds={reviewableEventSeeds}
        onConfirm={handleConfirmEventSeeds}
      />
    </Box>
  );
};

export default TimelinePage;
