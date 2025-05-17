import React from "react";
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

const TimelinePage: React.FC = () => {
  const {
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
  } = useTimeline();

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
      />

      {/* タイムライン設定ダイアログ */}
      <TimelineSettingsDialog
        open={settingsDialogOpen}
        timelineSettings={timelineSettings}
        onClose={handleCloseSettingsDialog}
        onSave={handleSaveSettings}
        onSettingsChange={handleSettingsChange}
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
    </Box>
  );
};

export default TimelinePage;
