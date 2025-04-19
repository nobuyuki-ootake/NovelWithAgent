import React, { useCallback, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CustomElement, CustomText } from "../../types/editor";

// スタイル付きコンポーネント
const VerticalEditorContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "calc(100vh - 100px)",
  overflowX: "auto",
  overflowY: "hidden",
  display: "flex",
  flexDirection: "row-reverse",
  padding: theme.spacing(2),
  backgroundColor: "#f8f8f8",
  "& .slate-content": {
    display: "flex",
    flexDirection: "row-reverse",
    height: "100%",
  },
}));

const GridPaper = styled(Box)(({ theme }) => ({
  width: "400px",
  height: "100%",
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  fontSize: "16px",
  lineHeight: "1.8",
  letterSpacing: "0.05em",
  margin: "0 auto",
  padding: theme.spacing(1),
  backgroundColor: "white",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  position: "relative",
  whiteSpace: "pre-wrap",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: `
      linear-gradient(transparent 19px, #eeeeee 19px, #eeeeee 20px),
      linear-gradient(to left, transparent 19px, #eeeeee 19px, #eeeeee 20px)
    `,
    backgroundSize: "20px 20px",
    pointerEvents: "none",
  },
}));

interface VerticalEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

const VerticalEditor: React.FC<VerticalEditorProps> = ({ value, onChange }) => {
  // Slateエディタインスタンスの作成
  const editor = useMemo(() => withReact(createEditor()), []);

  // エディタのレンダリング関数
  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props;

    switch ((element as CustomElement).type) {
      case "paragraph":
        return <p {...attributes}>{children}</p>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    const { attributes, children, leaf } = props;
    const text = leaf as CustomText;

    const style: React.CSSProperties = {
      fontWeight: text.bold ? "bold" : undefined,
      fontStyle: text.italic ? "italic" : undefined,
      textDecoration: text.underline ? "underline" : undefined,
    };

    return (
      <span {...attributes} style={style}>
        {children}
      </span>
    );
  }, []);

  return (
    <VerticalEditorContainer>
      <Slate editor={editor} initialValue={value} onChange={onChange}>
        <GridPaper className="slate-content">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="ここに文章を入力してください..."
            style={{
              padding: "20px",
              outline: "none",
              minWidth: "100%",
              minHeight: "100%",
            }}
          />
        </GridPaper>
      </Slate>
    </VerticalEditorContainer>
  );
};

export default VerticalEditor;
