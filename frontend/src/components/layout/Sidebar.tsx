import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import {
  ShortText as SynopsisIcon,
  List as PlotIcon,
  People as CharactersIcon,
  Public as WorldIcon,
  Timeline as TimelineIcon,
  MenuBook as WritingIcon,
  Feedback as FeedbackIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { appModeState, AppMode, sidebarOpenState } from "../../store/atoms";

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const [appMode, setAppMode] = useRecoilState(appModeState);
  const [sidebarOpen, setSidebarOpen] = useRecoilState(sidebarOpenState);

  const handleModeChange = (mode: AppMode) => {
    setAppMode(mode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { mode: "synopsis" as AppMode, text: "あらすじ", icon: <SynopsisIcon /> },
    { mode: "plot" as AppMode, text: "プロット", icon: <PlotIcon /> },
    {
      mode: "characters" as AppMode,
      text: "キャラクター",
      icon: <CharactersIcon />,
    },
    {
      mode: "worldbuilding" as AppMode,
      text: "世界観構築",
      icon: <WorldIcon />,
    },
    {
      mode: "timeline" as AppMode,
      text: "タイムライン",
      icon: <TimelineIcon />,
    },
    { mode: "writing" as AppMode, text: "本文執筆", icon: <WritingIcon /> },
    {
      mode: "feedback" as AppMode,
      text: "読者リアクション",
      icon: <FeedbackIcon />,
    },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          創作メニュー
        </Typography>
        <IconButton onClick={toggleSidebar}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.mode} disablePadding>
            <ListItemButton
              selected={appMode === item.mode}
              onClick={() => handleModeChange(item.mode)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
