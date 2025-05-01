import React from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useCharacters } from "../hooks/useCharacters";
import CharacterList from "../features/characters/CharacterList";
import CharacterForm from "../components/characters/CharacterForm";

const CharactersPage: React.FC = () => {
  // useCharactersフックを使用
  const {
    characters,
    viewMode,
    openDialog,
    editMode,
    formData,
    formErrors,
    tempImageUrl,
    selectedEmoji,
    newTrait,
    newCustomField,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleViewModeChange,
    handleOpenDialog,
    handleEditCharacter,
    handleCloseDialog,
    handleImageUpload,
    handleEmojiSelect,
    handleInputChange,
    handleSelectChange,
    handleAddTrait,
    handleRemoveTrait,
    handleNewTraitChange,
    handleCustomFieldChange,
    handleAddCustomField,
    handleRemoveCustomField,
    handleDeleteCharacter,
    handleSaveCharacter,
    handleCloseSnackbar,
  } = useCharacters();

  return (
    <Box sx={{ p: 3 }}>
      {/* ヘッダー部分 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          キャラクター
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="表示モード"
            size="small"
            sx={{ mr: 2 }}
          >
            <ToggleButton value="grid" aria-label="グリッド表示">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="リスト表示">
              <ListViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenDialog}
          >
            新規キャラクター
          </Button>
        </Box>
      </Box>

      {/* キャラクター一覧 */}
      <CharacterList
        characters={characters.map((character) => ({
          ...character,
          description: character.description || "",
          background: character.background || "",
          motivation: character.motivation || "",
          traits: character.traits ?? [],
          relationships: (character.relationships ?? []).map((rel) => ({
            ...rel,
            description: rel.description || "",
          })),
          customFields: character.customFields ?? [],
        }))}
        viewMode={viewMode}
        onAddCharacter={handleOpenDialog}
        onEditCharacter={(character) =>
          handleEditCharacter({
            ...character,
            description: character.description || "",
            background: character.background || "",
            motivation: character.motivation || "",
            traits: character.traits ?? [],
            relationships: (character.relationships ?? []).map((rel) => ({
              ...rel,
              description: rel.description || "",
            })),
            customFields: character.customFields ?? [],
          })
        }
        onDeleteCharacter={handleDeleteCharacter}
      />

      {/* キャラクター編集ダイアログ */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "キャラクターを編集" : "新規キャラクター作成"}
        </DialogTitle>
        <DialogContent dividers>
          <CharacterForm
            formData={{
              ...formData,
              description: formData.description || "",
              background: formData.background || "",
              motivation: formData.motivation || "",
              traits: formData.traits ?? [],
              relationships: (formData.relationships ?? []).map((rel) => ({
                ...rel,
                description: rel.description || "",
              })),
              customFields: formData.customFields ?? [],
            }}
            formErrors={formErrors}
            selectedEmoji={selectedEmoji}
            tempImageUrl={tempImageUrl}
            newTrait={newTrait}
            newCustomField={newCustomField}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onImageUpload={handleImageUpload}
            onEmojiSelect={handleEmojiSelect}
            onNewTraitChange={handleNewTraitChange}
            onAddTrait={handleAddTrait}
            onRemoveTrait={handleRemoveTrait}
            onCustomFieldChange={handleCustomFieldChange}
            onAddCustomField={handleAddCustomField}
            onRemoveCustomField={handleRemoveCustomField}
            onSave={handleSaveCharacter}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* スナックバー通知 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CharactersPage;
