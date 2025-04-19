import { Descendant } from "slate";
import { CustomElement, CustomText } from "../types/editor";

// エディタの初期値を設定する関数
export const createEmptyEditor = (): Descendant[] => {
  return [
    {
      type: "paragraph",
      children: [{ text: "" }],
    } as CustomElement,
  ];
};

// 既存のコンテンツからエディタの値を作成する関数
export const createEditorValue = (content: string): Descendant[] => {
  if (!content) return createEmptyEditor();

  // 段落に分割して値を作成
  return content.split("\n\n").map(
    (paragraph) =>
      ({
        type: "paragraph",
        children: [{ text: paragraph }],
      } as CustomElement)
  );
};

// 編集不可能なプレーンテキストとしてのエディタ値を作成
export const createReadOnlyValue = (content: string): Descendant[] => {
  return [
    {
      type: "paragraph",
      children: [{ text: content || "" }],
    } as CustomElement,
  ];
};

// エディタの値からプレーンテキストを抽出
export const serializeToText = (nodes: Descendant[]): string => {
  return nodes
    .map((node) => {
      const n = node as CustomElement;
      const children = n.children
        .map((child: CustomText) => child.text)
        .join("");
      return children;
    })
    .join("\n\n");
};
