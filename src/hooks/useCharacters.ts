import React, { useCallback } from "react";

// 表示モードの切り替え
const handleViewModeChange = useCallback(
  (_: React.MouseEvent<HTMLElement>, newMode: "list" | "grid" | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  },
  []
);
