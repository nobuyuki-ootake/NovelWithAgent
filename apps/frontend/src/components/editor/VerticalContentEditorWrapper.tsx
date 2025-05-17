import React, { useState, useEffect } from "react";
import { Descendant } from "slate";
import { CustomElement, CustomText } from "../../types/editor";
import VerticalContentEditor from "./VerticalContentEditor";

interface VerticalContentEditorWrapperProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

// Slateのデータ構造を平文テキストに変換する関数
const slateToText = (nodes: Descendant[]): string => {
  return nodes
    .map((node) => {
      const element = node as CustomElement;
      return element.children
        .map((child: CustomText) => child.text || "")
        .join("");
    })
    .join("\n");
};

// 平文テキストをSlateのデータ構造に変換する関数
const textToSlate = (text: string): Descendant[] => {
  // 段落ごとに分割
  const paragraphs = text.split("\n");

  return paragraphs.map((paragraph) => ({
    type: "paragraph",
    children: [{ text: paragraph }],
  }));
};

const VerticalContentEditorWrapper: React.FC<
  VerticalContentEditorWrapperProps
> = ({ value, onChange }) => {
  // Slateの値を文字列に変換
  const [textValue, setTextValue] = useState<string>(() => slateToText(value));

  // value プロップが変更されたときに textValue を更新
  useEffect(() => {
    const newTextValue = slateToText(value);
    if (newTextValue !== textValue) {
      setTextValue(newTextValue);
    }
  }, [value]);

  // ContentEditable の値が変更されたときのハンドラ
  const handleChange = (newText: string) => {
    setTextValue(newText);

    // 文字列からSlateデータ構造に変換して親に通知
    const newValue = textToSlate(newText);
    onChange(newValue);
  };

  return (
    <VerticalContentEditor initialValue={textValue} onChange={handleChange} />
  );
};

export default VerticalContentEditorWrapper;
