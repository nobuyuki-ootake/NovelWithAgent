import React, { useEffect, useRef } from "react";
import { Descendant, Editor } from "slate";
import VerticalContentEditor from "./VerticalContentEditor";
import { ReactEditor } from "slate-react";
import Box from "@mui/material/Box";

interface VerticalContentEditorWrapperProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  editorRef: React.RefObject<Editor | null>;
  onSelectionChange?: () => void;
  editorKey?: number;
}

const VerticalContentEditorWrapper: React.FC<
  VerticalContentEditorWrapperProps
> = ({ value, onChange, editorRef, onSelectionChange, editorKey }) => {
  return (
    <Box
      sx={{
        height: "620px",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "16px",
        writingMode: "vertical-rl",
        fontFamily: '"Noto Serif JP", serif',
        backgroundColor: "#fff",
      }}
    >
      <VerticalContentEditor
        key={editorKey}
        value={value}
        onChange={onChange}
        editorRef={editorRef}
        onSelectionChange={onSelectionChange}
      />
    </Box>
  );
};

export default VerticalContentEditorWrapper;
