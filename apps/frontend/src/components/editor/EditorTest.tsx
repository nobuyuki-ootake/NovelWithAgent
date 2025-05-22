import React, { useState } from "react";
import { Box, Button, Typography, Container, Paper } from "@mui/material";
import VerticalContentEditor from "./VerticalContentEditor";

const EditorTest: React.FC = () => {
  const [editorContent, setEditorContent] = useState(
    "縦書きのテキストエディタです。\n日本語が入力できます。"
  );

  const handleSave = () => {
    console.log("保存されたコンテンツ:", editorContent);
    alert(
      "コンテンツが保存されました: " + editorContent.substring(0, 30) + "..."
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          縦書きエディタテスト
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            このエディタは日本語の縦書き入力に対応しています。
            右上から左に向かって文字が並んでいきます。
          </Typography>
        </Paper>

        <VerticalContentEditor
          pageHtml={editorContent}
          onPageHtmlChange={setEditorContent}
        />

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            保存
          </Button>

          <Button variant="outlined" onClick={() => setEditorContent("")}>
            クリア
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditorTest;
