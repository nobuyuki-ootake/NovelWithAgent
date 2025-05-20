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
  width: "540px", // 18px * 30文字 (30列)
  height: "720px", // 36px * 20行 (20行)
  position: "relative",
  backgroundColor: "white",
  boxShadow: theme.shadows[1],
  border: "1px solid #ddd",
  overflow: "hidden",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  padding: "18px", // 上下左右のパディングを文字サイズに合わせる (1文字分)
  "&::before": {
    content: '""',
    position: "absolute",
    top: "18px", // paddingに合わせる
    right: "18px", // paddingに合わせる
    bottom: "18px", // paddingに合わせる
    left: "18px", // paddingに合わせる
    backgroundSize: "18px 36px", // 1文字の幅18px, 高さ36px
    backgroundImage: `
      linear-gradient(to right, #eee 1px, transparent 1px),
      linear-gradient(to bottom, #eee 1px, transparent 1px)
    `,
    zIndex: 1,
    pointerEvents: "none",
  },
}));

const EditableContent = styled(ContentEditable)(() => ({
  width: "100%", // PaperSheetのpadding内で100%
  height: "100%", // PaperSheetのpadding内で100%
  outline: "none",
  writingMode: "vertical-rl",
  WebkitWritingMode: "vertical-rl",
  msWritingMode: "vertical-rl",
  textOrientation: "mixed",
  fontSize: "18px",
  fontFamily: '"Noto Serif JP", serif',
  lineHeight: "2",
  letterSpacing: "0", // グリッドに合わせるためletterSpacingを0に
  // textIndent: "1em", // グリッドに合わせるため、一旦なし
  overflowWrap: "break-word",
  wordBreak: "keep-all", // 日本語の改行に適した設定
  whiteSpace: "pre-wrap", // 空白や改行を保持
  position: "relative",
  zIndex: 2,
  backgroundColor: "transparent",
  padding: 0, // PaperSheet側でpaddingを制御
  margin: 0,
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

  // コメントアウトされていた calculatePages を元に戻し、ページ計算ロジックとして利用
  const charsPerPage = 360; // 1ページあたりの文字数（設定値）

  const getPlainText = (htmlString: string): string => {
    return htmlString.replace(/<[^>]*>/g, "");
  };

  const plainText = getPlainText(html);
  const totalPages = Math.max(1, Math.ceil(plainText.length / charsPerPage));

  // 右パネルに表示するHTML（基本は全量だが、将来的に最適化するかも）
  const rightPanelHtml = html;

  // 左パネルに表示するHTML（右パネルの前のページ内容）
  let leftPanelHtml = "";
  if (totalPages > 1) {
    // 現在の編集カーソルがどのページにあるか、という概念はないため、
    // 単純に全体のテキストをページ分けし、最後のページの一つ前を表示する。
    // しかし、ContentEditableのhtmlを直接substringするのは危険なので、
    // プレーンテキストで計算し、表示は右パネルの先頭部分とするのが無難か。
    // 今回は、シンプルに「最後のページの一つ前のページ」をプレーンテキストで切り出す。
    const startIndex = Math.max(0, plainText.length - charsPerPage * 2);
    const endIndex = plainText.length - charsPerPage;
    if (endIndex > 0) {
      leftPanelHtml = plainText.substring(
        Math.max(0, endIndex - charsPerPage),
        endIndex
      );
    }
  }
  // 左パネルは読み取り専用なので、divで囲んで ContentEditable の挙動を模倣する
  if (leftPanelHtml) {
    leftPanelHtml = `<div>${leftPanelHtml.split("\n").join("<br>")}</div>`;
  }

  return (
    <VerticalEditorContainer>
      <GridPaper>
        {/* 左パネル (前のページ表示用・読み取り専用) */}
        <PaperSheet key="left-preview-page">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              writingMode: "vertical-rl",
              WebkitWritingMode: "vertical-rl",
              msWritingMode: "vertical-rl",
              textOrientation: "mixed",
              fontSize: "18px",
              fontFamily: '"Noto Serif JP", serif',
              lineHeight: "2",
              letterSpacing: "0",
              wordBreak: "keep-all",
              whiteSpace: "pre-wrap",
              overflow: "hidden", // 内容がはみ出ないように
              position: "relative",
              zIndex: 2, // グリッドよりは手前
              padding: 0, // PaperSheet側で制御
              margin: 0,
            }}
            dangerouslySetInnerHTML={{ __html: leftPanelHtml }}
          />
        </PaperSheet>

        {/* 右パネル (現在の編集ページ) */}
        <PaperSheet key="editable-page-2">
          <EditableContent
            // ref={} // 2つ目のrefは現状不要か
            html={rightPanelHtml} // 右パネルには全HTMLを渡す
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
