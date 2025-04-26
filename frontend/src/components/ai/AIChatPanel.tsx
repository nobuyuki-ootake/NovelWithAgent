import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Send as SendIcon,
  Close as CloseIcon,
  ExpandLess,
  ExpandMore,
  ChatBubble as ChatBubbleIcon,
} from "@mui/icons-material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  aiChatPanelOpenState,
  selectedElementsState,
  aiChatHistoryState,
  currentMessageState,
  aiLoadingState,
  ChatMessage,
} from "../../store/atoms";
import { v4 as uuidv4 } from "uuid";

// AIとのメッセージのやり取りを表示するコンポーネント
const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: message.role === "user" ? "flex-end" : "flex-start",
        mb: 2,
        maxWidth: "80%",
        alignSelf: message.role === "user" ? "flex-end" : "flex-start",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor:
            message.role === "user" ? "primary.light" : "background.paper",
          color: message.role === "user" ? "white" : "text.primary",
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
      </Paper>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 0.5, mx: 1 }}
      >
        {new Date(message.timestamp).toLocaleTimeString()}
      </Typography>
    </Box>
  );
};

// 選択された要素を表示するコンポーネント
const SelectedContext: React.FC = () => {
  const selectedElements = useRecoilValue(selectedElementsState);
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };

  if (selectedElements.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleToggle}
      >
        <Typography variant="subtitle2" color="text.secondary">
          選択中の要素 ({selectedElements.length})
        </Typography>
        {open ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Collapse in={open}>
        <List dense sx={{ mt: 1 }}>
          {selectedElements.map((element) => (
            <ListItem key={element.id}>
              <Chip
                label={`${element.content.title}`}
                size="small"
                sx={{ mr: 1 }}
                color="primary"
                variant="outlined"
              />
              <ListItemText
                primary={element.type}
                secondary={element.content.description}
                primaryTypographyProps={{ variant: "caption" }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
      <Divider sx={{ mt: 1 }} />
    </Box>
  );
};

const AIChatPanel: React.FC = () => {
  // Recoilの状態
  const [isOpen, setIsOpen] = useRecoilState(aiChatPanelOpenState);
  const [chatHistory, setChatHistory] = useRecoilState(aiChatHistoryState);
  const [currentMessage, setCurrentMessage] =
    useRecoilState(currentMessageState);
  const [isLoading, setIsLoading] = useRecoilState(aiLoadingState);
  const selectedElements = useRecoilValue(selectedElementsState);

  // チャットメッセージ送信時の処理
  const handleSendMessage = async () => {
    if (currentMessage.trim() === "" || isLoading) return;

    // 新しいユーザーメッセージを作成
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    // メッセージをチャット履歴に追加
    setChatHistory([...chatHistory, userMessage]);
    setCurrentMessage("");

    // ここでAIとの通信を行う処理が入ります
    // 現在はモックレスポンスを返すだけの実装
    setIsLoading(true);

    try {
      // モック: 実際にはAPIリクエストを行う
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: uuidv4(),
          role: "assistant",
          content: `AIレスポンスの例：\n${
            selectedElements.length > 0
              ? `選択された${selectedElements.length}個の要素について考慮します。`
              : "特に選択された要素はありません。"
          }\n\n${currentMessage}についての提案や回答をここに表示します。`,
          timestamp: new Date(),
        };

        setChatHistory((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("AI通信エラー:", error);
      setIsLoading(false);
    }
  };

  // Enter キーでメッセージを送信
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // チャットパネルを閉じる
  const handleClose = () => {
    setIsOpen(false);
  };

  // チャットパネルを開く
  const handleOpen = () => {
    setIsOpen(true);
  };

  // フローティングボタン（チャットパネルが閉じているとき表示）
  if (!isOpen) {
    return (
      <IconButton
        color="primary"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
        onClick={handleOpen}
      >
        <ChatBubbleIcon />
      </IconButton>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      variant="persistent"
      sx={{
        width: 350,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 350,
          boxSizing: "border-box",
          padding: 2,
        },
      }}
    >
      {/* ヘッダー */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">AIアシスタント</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* 選択されたコンテキスト表示 */}
      <SelectedContext />

      {/* チャット履歴表示エリア */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          mb: 2,
          p: 1,
          backgroundColor: "background.default",
          borderRadius: 1,
          minHeight: "300px",
          maxHeight: "calc(100vh - 250px)",
        }}
      >
        {chatHistory.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", my: 10 }}
          >
            AIアシスタントに質問や提案を求めてみましょう
          </Typography>
        ) : (
          chatHistory.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 2,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* メッセージ入力エリア */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
          size="small"
          placeholder="AIに質問や指示を入力..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={currentMessage.trim() === "" || isLoading}
        >
          送信
        </Button>
      </Box>
    </Drawer>
  );
};

export default AIChatPanel;
