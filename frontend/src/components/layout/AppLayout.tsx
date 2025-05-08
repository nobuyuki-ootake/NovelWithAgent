import React, { useState } from "react";
import { Box, Container, Fab, Tooltip, IconButton } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentProjectState,
  sidebarOpenState,
  aiChatPanelOpenState,
} from "../../store/atoms";
import Sidebar from "./Sidebar";
import AIChatPanel from "../ai/AIChatPanel";
import { SettingsMenu } from "./SettingsMenu";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const currentProject = useRecoilValue(currentProjectState);
  const [sidebarOpen, setSidebarOpen] = useRecoilState(sidebarOpenState);
  const [aiChatPanelOpen] = useRecoilState(aiChatPanelOpenState);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  // プロジェクトが選択されていない場合はシンプルなレイアウトを表示
  if (!currentProject) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {children}
      </Container>
    );
  }

  // サイドバーの切り替え
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 設定メニューの切り替え
  const toggleSettingsMenu = () => {
    setSettingsMenuOpen(!settingsMenuOpen);
  };

  // プロジェクトが選択されている場合はサイドバー付きのレイアウトを表示
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "background.default",
        position: "relative",
      }}
    >
      {/* サイドバー - ドロワーをoverlayモードに変更 */}
      <Sidebar open={sidebarOpen} onClose={toggleSidebar} />

      {/* メインコンテンツ - サイドバーが表示されてもスペースを取らないように修正 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "all 0.2s ease-in-out",
          ml: 0,
          mr: aiChatPanelOpen ? "320px" : 0,
          height: "100vh",
          overflow: "auto",
          position: "relative",
          backgroundColor: "background.default",
        }}
      >
        {/* ヘッダーアクション */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 100,
            display: "flex",
            gap: 1,
          }}
        >
          {/* 設定メニューボタン */}
          <IconButton
            color="primary"
            onClick={toggleSettingsMenu}
            sx={{
              backgroundColor: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <SettingsIcon />
          </IconButton>

          {/* 設定メニュー */}
          <Box sx={{ position: "relative" }}>
            <SettingsMenu
              isOpen={settingsMenuOpen}
              onClose={() => setSettingsMenuOpen(false)}
            />
          </Box>
        </Box>

        {children}

        {/* フロート操作メニューボタン */}
        <Tooltip title="創作メニュー" placement="left">
          <Fab
            color="primary"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{
              position: "fixed",
              bottom: 24,
              left: 24,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              opacity: sidebarOpen ? 0 : 1,
              visibility: sidebarOpen ? "hidden" : "visible",
              transition:
                "opacity 0.2s ease-in-out, visibility 0.2s ease-in-out",
              zIndex: 1000,
            }}
          >
            <MenuIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* AIChatPanel */}
      <AIChatPanel />
    </Box>
  );
};

export default AppLayout;
