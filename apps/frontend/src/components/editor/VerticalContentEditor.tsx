import React, { useState, useCallback } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { styled } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";

// スタイル付きコンポーネント
const VerticalEditorContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  overflowX: "auto",
  overflowY: "auto",
  padding: theme.spacing(1),
  backgroundColor: "#f8f8f8",
  display: "flex",
  justifyContent: "flex-start",
}));

const GridPaper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row", // 原稿用紙を横に並べる
  gap: "16px",
  padding: "8px",
  minHeight: "600px",
}));

const PaperSheet = styled(Box)(({ theme }) => ({
  width: "540px",
  height: "500px",
  position: "relative",
  backgroundColor: "white",
  boxShadow: theme.shadows[1],
  border: "1px solid #ddd",
  overflow: "hidden",
  display: "flex",
  justifyContent: "flex-end", // 右端からスタート
  alignItems: "flex-start", // 上部からスタート
  // 余白
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: `
      linear-gradient(90deg, #f5f5f5 20px, transparent 20px, transparent calc(100% - 20px), #f5f5f5 calc(100% - 20px)),
      linear-gradient(180deg, #f5f5f5 20px, transparent 20px, transparent calc(100% - 20px), #f5f5f5 calc(100% - 20px))
    `,
    zIndex: 1,
    pointerEvents: "none",
  },
}));

const EditableContent = styled(ContentEditable)(() => ({
  width: "calc(100% - 40px)",
  height: "calc(100% - 40px)",
  margin: "20px",
  outline: "none",
  writingMode: "vertical-rl", // 縦書き - 右上から左下へ
  WebkitWritingMode: "vertical-rl", // Safari対応
  msWritingMode: "vertical-rl", // IE対応
  textOrientation: "mixed", // 自然な縦書きの向き
  fontSize: "18px",
  fontFamily: '"Noto Serif JP", serif',
  lineHeight: "2em",
  letterSpacing: "0.05em",
  textIndent: "1em",
  overflowWrap: "break-word",
  wordBreak: "normal",
  position: "relative",
  zIndex: 2,
}));

interface VerticalContentEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

const VerticalContentEditor: React.FC<VerticalContentEditorProps> = ({
  initialValue = "",
  onChange,
}) => {
  const [html, setHtml] = useState(initialValue);

  // 編集可能なコンテンツのインスタンス
  const contentEditable = React.createRef<ContentEditable>();

  // コンテンツ変更時のハンドラー
  const handleChange = useCallback(
    (evt: ContentEditableEvent) => {
      const newValue = evt.target.value;
      setHtml(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  // 入力でのキーボードイベント処理
  const handleKeyDown = useCallback(() => {
    // キー操作が必要な場合ここに実装
    // 例: Enter押下時の改行など特別な処理
  }, []);

  // ページ数の計算
  const calculatePages = (text: string): number => {
    // 1ページあたり約360文字として計算（20行 x 18文字）
    const charsPerPage = 360;
    return Math.max(1, Math.ceil(text.length / charsPerPage) + 1);
  };

  const pageCount = calculatePages(html.replace(/<[^>]*>/g, ""));

  return (
    <VerticalEditorContainer>
      <GridPaper>
        {/* 追加のページ（読み取り専用） */}
        {Array.from({ length: pageCount - 1 }).map((_, index) => (
          <PaperSheet key={index + 1}>
            <Box
              sx={{
                width: "calc(100% - 40px)",
                height: "calc(100% - 40px)",
                margin: "20px",
                writingMode: "vertical-rl",
                WebkitWritingMode: "vertical-rl",
                msWritingMode: "vertical-rl",
                textOrientation: "mixed",
                fontSize: "18px",
                fontFamily: '"Noto Serif JP", serif',
                lineHeight: "2em",
                letterSpacing: "0.05em",
                textIndent: "1em",
                userSelect: "none",
                position: "relative",
                zIndex: 2,
              }}
              dangerouslySetInnerHTML={{
                __html: html
                  .replace(/<[^>]*>/g, "")
                  .substring((index + 1) * 360, (index + 2) * 360),
              }}
            />
          </PaperSheet>
        ))}

        {/* 編集可能なページ（右側に配置） */}
        <PaperSheet>
          <EditableContent
            ref={contentEditable}
            html={html}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            tagName="div"
            placeholder="ここに文章を入力してください..."
            spellCheck={false}
            lang="ja"
          />
        </PaperSheet>
      </GridPaper>
    </VerticalEditorContainer>
  );
};

export default VerticalContentEditor;
