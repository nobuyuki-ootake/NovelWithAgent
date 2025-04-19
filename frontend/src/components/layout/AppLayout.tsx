import React, { useEffect } from "react";
import { Box, Container } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentProjectState,
  sidebarOpenState,
  chatPanelOpenState,
} from "../../store/atoms";
import Sidebar from "./Sidebar";
import ChatPanel from "./ChatPanel";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const currentProject = useRecoilValue(currentProjectState);
  const [sidebarOpen, setSidebarOpen] = useRecoilState(sidebarOpenState);
  const [chatPanelOpen] = useRecoilState(chatPanelOpenState);

  // プロジェクトが読み込まれたらサイドバーを自動的に開く
  useEffect(() => {
    if (currentProject && !sidebarOpen) {
      setSidebarOpen(true);
    }
  }, [currentProject, sidebarOpen, setSidebarOpen]);

  // プロジェクトが選択されていない場合はシンプルなレイアウトを表示
  if (!currentProject) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {children}
      </Container>
    );
  }

  // プロジェクトが選択されている場合はサイドバー付きのレイアウトを表示
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* サイドバー */}
      <Sidebar open={sidebarOpen} />

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin 0.3s",
          ml: sidebarOpen ? "240px" : 0,
          mr: chatPanelOpen ? "320px" : 0,
          height: "100vh",
          overflow: "auto",
        }}
      >
        {children}
      </Box>

      {/* チャットパネル */}
      <ChatPanel open={chatPanelOpen} />
    </Box>
  );
};

export default AppLayout;
