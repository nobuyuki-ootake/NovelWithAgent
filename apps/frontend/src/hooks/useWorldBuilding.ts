import { useState } from "react";

export function useWorldBuilding() {
  const [tabValue, setTabValue] = useState(0);
  const [updatedTabs, setUpdatedTabs] = useState<boolean[]>(
    Array(10).fill(false)
  );
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");

  return {
    currentProject: null,
    tabValue,
    updatedTabs,
    mapImageUrl: "",
    description: "",
    history: "",
    rules: [],
    places: [],
    freeFields: [],
    handleTabChange: (_: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    },
    markTabAsUpdated: (index: number) => {
      const newTabs = [...updatedTabs];
      newTabs[index] = true;
      setUpdatedTabs(newTabs);
    },
    handleMapImageUpload: () => {},
    handleSettingChange: () => {},
    handleHistoryChange: () => {},
    handleSaveWorldBuilding: () => {},
    hasUnsavedChanges: false,
    getCurrentProjectState: () => null,
    updateProjectState: () => {},
  };
}
