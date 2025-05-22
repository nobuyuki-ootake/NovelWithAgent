import React, { useCallback, useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { styled } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";
// import { extractTextFromHtml } from "../../utils/editorUtils"; // 不要になったためコメントアウト

// スタイル付きコンポーネント
const VerticalEditorContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  flexGrow: 1, // 親のBox内で高さを最大限利用する
  display: "flex", // 中のGridPaperをflexアイテムとして扱うため
  flexDirection: "column", // GridPaperを縦に配置（現在は1つだけだが将来的な拡張性）
  overflow: "hidden", // VerticalEditorContainer自体はスクロールさせず、中の要素でスクロール
  padding: theme.spacing(1),
  backgroundColor: "#f8f8f8",
}));

const GridPaperContainer = styled(Box)(() => ({
  // GridPaperをラップするコンテナを追加
  width: "100%",
  flexGrow: 1,
  overflowX: "auto", // 水平スクロールはこちらで担当
  overflowY: "hidden", // PaperSheetの高さは固定なので、ここはhidden
  paddingBottom: "16px", // スクロールバーのためのスペース（任意）
}));

const GridPaper = styled(Box)(() => ({
  display: "inline-flex", // PaperSheetを横並びにするため(現在は1つ)
  flexDirection: "row",
  gap: "16px",
  padding: "8px", // GridPaperContainerに移しても良い
  minHeight: "720px", // PaperSheetの高さに合わせる
  width: "max-content",
  // margin: "0 auto", // 中央寄せは一旦解除、GridPaperContainerの幅が100%なので不要なはず
}));

const PaperSheet = styled(Box)(({ theme }) => ({
  width: "max-content", // コンテンツ幅に追従
  minWidth: "min(max(600px, 70vw), 1000px)", // 最小幅を調整 (600px以上、かつビューポート70%か1000pxの小さい方)
  height: "590px",
  position: "relative",
  backgroundColor: "white",
  boxShadow: theme.shadows[1],
  border: "1px solid #ddd",
  overflow: "hidden", // PaperSheet自体はスクロールさせない
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  padding: "18px",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "18px",
    right: "18px",
    bottom: "18px",
    left: "18px",
    backgroundSize: "18px 36px",
    backgroundImage: `
      linear-gradient(to right, #eee 1px, transparent 1px),
      linear-gradient(to bottom, #eee 1px, transparent 1px)
    `,
    zIndex: 1,
    pointerEvents: "none",
  },
}));

const EditableContent = styled(ContentEditable)(() => ({
  width: "max-content",
  minWidth: "calc(100% - 36px)", // PaperSheetのpadding(18px*2)を考慮
  height: "100%",
  outline: "none",
  writingMode: "vertical-rl",
  WebkitWritingMode: "vertical-rl",
  msWritingMode: "vertical-rl",
  textOrientation: "mixed",
  fontSize: "18px",
  fontFamily: "monospace",
  lineHeight: "2",
  letterSpacing: "0",
  overflowWrap: "break-word",
  wordBreak: "keep-all",
  whiteSpace: "pre-wrap",
  position: "relative",
  zIndex: 2,
  backgroundColor: "transparent",
  padding: 0,
  margin: 0,
  overflowY: "auto",
}));

interface VerticalContentEditorProps {
  /**
   * 現在のページに表示するHTMLコンテンツ全体。
   * 親コンポーネントがページ単位で管理しているHTML文字列を想定。
   */
  pageHtml: string;
  /**
   * ページ内容が変更されたときに呼び出されるコールバック。
   * 変更後のページ全体のHTMLコンテンツを引数として渡す。
   */
  onPageHtmlChange: (newPageHtml: string) => void;
  // onRequestNewPage?: () => void; // 不要になったため削除
}

// const MAX_CHARS_PER_PAGE = 600; // 不要になったため削除

const VerticalContentEditor: React.FC<VerticalContentEditorProps> = ({
  pageHtml,
  onPageHtmlChange,
  // onRequestNewPage, // 不要になったため削除
}) => {
  const editableRef = useRef<ContentEditable>(null);
  // const lastRequestedHtmlRef = useRef<string | null>(null); // 不要になったため削除

  const handleChange = useCallback(
    (evt: ContentEditableEvent) => {
      const newHtml = evt.target.value;
      onPageHtmlChange(newHtml);

      // 文字数チェックと onRequestNewPage 呼び出しロジックは削除
    },
    [onPageHtmlChange]
  );

  // pageHtml が外部から変更された場合の lastRequestedHtmlRef のリセットも不要
  // React.useEffect(() => {
  //   lastRequestedHtmlRef.current = null;
  // }, [pageHtml]);

  return (
    <VerticalEditorContainer>
      <GridPaperContainer>
        {" "}
        {/* ラッパーコンテナを追加 */}
        <GridPaper>
          <PaperSheet key="editable-page-single">
            {" "}
            {/* 複数ページ表示する場合はkeyの動的生成が必要 */}
            <EditableContent
              ref={editableRef}
              html={pageHtml}
              onChange={handleChange}
              tagName="div"
              placeholder="(本文)"
              spellCheck={false}
              lang="ja"
            />
          </PaperSheet>
        </GridPaper>
      </GridPaperContainer>
    </VerticalEditorContainer>
  );
};

export default VerticalContentEditor;
