import React from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Snackbar,
} from "@mui/material";
import { useWorldBuilding } from "../hooks/useWorldBuilding";
import WorldMapTab from "../components/worldbuilding/WorldMapTab";
import SettingTab from "../components/worldbuilding/SettingTab";
import TabPanel from "../components/worldbuilding/TabPanel";
import SocietyCultureTab from "../components/worldbuilding/SocietyCultureTab";
import GeographyEnvironmentTab from "../components/worldbuilding/GeographyEnvironmentTab";
import HistoryLegendTab from "../components/worldbuilding/HistoryLegendTab";
import MagicTechnologyTab from "../components/worldbuilding/MagicTechnologyTab";
import RulesTab from "../components/worldbuilding/RulesTab";
import PlacesTab from "../components/worldbuilding/PlacesTab";
import FreeFieldsTab from "../components/worldbuilding/FreeFieldsTab";
import { ExtendedPlace } from "../components/worldbuilding/PlacesTab";

const WorldBuildingPage: React.FC = () => {
  const {
    currentProject,
    tabValue,
    mapImageUrl,
    description,
    history,
    rules,
    newRule,
    places,
    freeFields,
    newFreeField,
    isEditingFreeField,
    snackbarOpen,
    snackbarMessage,
    hasUnsavedChanges,
    newPlace,
    isEditingPlace,
    // 社会と文化のタブの状態
    socialStructure,
    government,
    economy,
    religion,
    traditions,
    language,
    art,
    education,
    technology,
    // 地理と環境のタブの状態
    geography,
    climate,
    flora,
    fauna,
    resources,
    settlements,
    naturalDisasters,
    seasonalChanges,
    // 歴史と伝説のタブの状態
    historicalEvents,
    ancientCivilizations,
    myths,
    legends,
    folklore,
    religions,
    historicalFigures,
    conflicts,
    // 魔法と技術のタブの状態
    magicSystem,
    magicRules,
    magicUsers,
    artifacts,
    technologyLevel,
    inventions,
    energySources,
    transportation,
    // ハンドラ関数
    handleTabChange,
    handleMapImageUpload,
    handleSettingChange,
    handleHistoryChange,
    handleAddRule,
    handleDeleteRule,
    setNewRule,
    handleFreeFieldChange,
    handleAddFreeField,
    handleEditFreeField,
    handleDeleteFreeField,
    handlePlaceChange,
    handleAddPlace,
    handleEditPlace,
    handleDeletePlace,
    handleSave,
    handleCloseSnackbar,
    // 社会と文化のタブのハンドラ
    handleSocialStructureChange,
    handleGovernmentChange,
    handleEconomyChange,
    handleReligionChange,
    handleTraditionsChange,
    handleLanguageChange,
    handleArtChange,
    handleEducationChange,
    handleTechnologyChange,
    // 地理と環境のタブのハンドラ
    handleGeographyChange,
    handleClimateChange,
    handleFloraChange,
    handleFaunaChange,
    handleResourcesChange,
    handleSettlementsChange,
    handleNaturalDisastersChange,
    handleSeasonalChangesChange,
    // 歴史と伝説のタブのハンドラ
    handleHistoricalEventsChange,
    handleAncientCivilizationsChange,
    handleMythsChange,
    handleLegendsChange,
    handleFolkloreChange,
    handleReligionsChange,
    handleHistoricalFiguresChange,
    handleConflictsChange,
    // 魔法と技術のタブのハンドラ
    handleMagicSystemChange,
    handleMagicRulesChange,
    handleMagicUsersChange,
    handleArtifactsChange,
    handleTechnologyLevelChange,
    handleInventionsChange,
    handleEnergySourcesChange,
    handleTransportationChange,
  } = useWorldBuilding();

  if (!currentProject) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>プロジェクトが選択されていません。</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {currentProject.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          世界観構築
        </Typography>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="world building tabs"
        >
          <Tab label="ワールドマップ" />
          <Tab label="世界観設定" />
          <Tab label="ルール" />
          <Tab label="地名" />
          <Tab label="社会と文化" />
          <Tab label="地理と環境" />
          <Tab label="歴史と伝説" />
          <Tab label="魔法と技術" />
          <Tab label="自由入力" />
        </Tabs>

        {/* ワールドマップタブ */}
        <TabPanel value={tabValue} index={0}>
          <WorldMapTab
            mapImageUrl={mapImageUrl}
            onMapImageUpload={handleMapImageUpload}
          />
        </TabPanel>

        {/* 世界観設定タブ */}
        <TabPanel value={tabValue} index={1}>
          <SettingTab
            description={description}
            onDescriptionChange={handleSettingChange}
            history={history}
            onHistoryChange={handleHistoryChange}
          />
        </TabPanel>

        {/* ルールタブ */}
        <TabPanel value={tabValue} index={2}>
          <RulesTab
            rules={rules}
            newRule={newRule}
            setNewRule={setNewRule}
            onAddRule={handleAddRule}
            onDeleteRule={handleDeleteRule}
          />
        </TabPanel>

        {/* 地名タブ */}
        <TabPanel value={tabValue} index={3}>
          <PlacesTab
            places={places as ExtendedPlace[]}
            newPlace={newPlace as ExtendedPlace}
            isEditingPlace={isEditingPlace}
            onPlaceChange={handlePlaceChange}
            onAddPlace={handleAddPlace}
            onEditPlace={handleEditPlace}
            onDeletePlace={handleDeletePlace}
          />
        </TabPanel>

        {/* 社会と文化タブ */}
        <TabPanel value={tabValue} index={4}>
          <SocietyCultureTab
            socialStructure={socialStructure}
            onSocialStructureChange={handleSocialStructureChange}
            government={government}
            onGovernmentChange={handleGovernmentChange}
            economy={economy}
            onEconomyChange={handleEconomyChange}
            religion={religion}
            onReligionChange={handleReligionChange}
            traditions={traditions}
            onTraditionsChange={handleTraditionsChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            art={art}
            onArtChange={handleArtChange}
            education={education}
            onEducationChange={handleEducationChange}
            technology={technology}
            onTechnologyChange={handleTechnologyChange}
          />
        </TabPanel>

        {/* 地理と環境タブ */}
        <TabPanel value={tabValue} index={5}>
          <GeographyEnvironmentTab
            geography={geography}
            onGeographyChange={handleGeographyChange}
            climate={climate}
            onClimateChange={handleClimateChange}
            flora={flora}
            onFloraChange={handleFloraChange}
            fauna={fauna}
            onFaunaChange={handleFaunaChange}
            resources={resources}
            onResourcesChange={handleResourcesChange}
            settlements={settlements}
            onSettlementsChange={handleSettlementsChange}
            naturalDisasters={naturalDisasters}
            onNaturalDisastersChange={handleNaturalDisastersChange}
            seasonalChanges={seasonalChanges}
            onSeasonalChangesChange={handleSeasonalChangesChange}
          />
        </TabPanel>

        {/* 歴史と伝説タブ */}
        <TabPanel value={tabValue} index={6}>
          <HistoryLegendTab
            historicalEvents={historicalEvents}
            onHistoricalEventsChange={handleHistoricalEventsChange}
            ancientCivilizations={ancientCivilizations}
            onAncientCivilizationsChange={handleAncientCivilizationsChange}
            myths={myths}
            onMythsChange={handleMythsChange}
            legends={legends}
            onLegendsChange={handleLegendsChange}
            folklore={folklore}
            onFolkloreChange={handleFolkloreChange}
            religions={religions}
            onReligionsChange={handleReligionsChange}
            historicalFigures={historicalFigures}
            onHistoricalFiguresChange={handleHistoricalFiguresChange}
            conflicts={conflicts}
            onConflictsChange={handleConflictsChange}
          />
        </TabPanel>

        {/* 魔法と技術タブ */}
        <TabPanel value={tabValue} index={7}>
          <MagicTechnologyTab
            magicSystem={magicSystem}
            onMagicSystemChange={handleMagicSystemChange}
            magicRules={magicRules}
            onMagicRulesChange={handleMagicRulesChange}
            magicUsers={magicUsers}
            onMagicUsersChange={handleMagicUsersChange}
            artifacts={artifacts}
            onArtifactsChange={handleArtifactsChange}
            technologyLevel={technologyLevel}
            onTechnologyLevelChange={handleTechnologyLevelChange}
            inventions={inventions}
            onInventionsChange={handleInventionsChange}
            energySources={energySources}
            onEnergySourcesChange={handleEnergySourcesChange}
            transportation={transportation}
            onTransportationChange={handleTransportationChange}
          />
        </TabPanel>

        {/* 自由入力タブ */}
        <TabPanel value={tabValue} index={8}>
          <FreeFieldsTab
            freeFields={freeFields}
            newFreeField={newFreeField}
            isEditingFreeField={isEditingFreeField}
            onFreeFieldChange={handleFreeFieldChange}
            onAddFreeField={handleAddFreeField}
            onEditFreeField={handleEditFreeField}
            onDeleteFreeField={handleDeleteFreeField}
          />
        </TabPanel>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
        >
          保存
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default WorldBuildingPage;
