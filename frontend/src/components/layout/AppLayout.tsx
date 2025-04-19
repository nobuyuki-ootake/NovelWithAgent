import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useRecoilValue } from "recoil";
import theme from "../../utils/theme";
import Sidebar from "./Sidebar";
import ChatPanel from "./ChatPanel";
import {
  sidebarOpenState,
  chatPanelOpenState,
  currentProjectState,
} from "../../store/atoms";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const sidebarOpen = useRecoilValue(sidebarOpenState);
  const chatPanelOpen = useRecoilValue(chatPanelOpenState);
  const currentProject = useRecoilValue(currentProjectState);

  // プロジェクトが選択されていない場合は単純なレイアウト
  if (!currentProject) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              overflow: "auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  // プロジェクトが選択されている場合は通常のレイアウト
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* サイドバー */}
        <Sidebar open={sidebarOpen} />

        {/* メインコンテンツ */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            width: {
              sm: `calc(100% - ${sidebarOpen ? 240 : 0}px - ${
                chatPanelOpen ? 320 : 0
              }px)`,
            },
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            overflowY: "auto",
          }}
        >
          {children}
        </Box>

        {/* チャットパネル */}
        <ChatPanel open={chatPanelOpen} />
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;
