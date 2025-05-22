import { Descendant, Node } from "slate";
import { CustomElement } from "../types/editor";

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
  // 400文字ごとにページを分割する場合は、そのままテキストを流し込む
  return [
    {
      type: "paragraph",
      children: [{ text: content }],
    } as CustomElement,
  ];
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
  return nodes.map((n) => Node.string(n)).join("\n");
};

// 文字数を計算する関数
export const countCharacters = (nodes: Descendant[]): number => {
  return nodes.reduce((count, node) => {
    return count + Node.string(node).length;
  }, 0);
};

// 指定されたページの内容を取得する関数（20x20=400文字ごと）
export const getPageContent = (
  nodes: Descendant[],
  pageIndex: number
): string => {
  const allText = serializeToText(nodes);
  return allText.substring(pageIndex * 400, (pageIndex + 1) * 400);
};

// HTML文字列からプレーンテキストを抽出するヘルパー関数
export const extractTextFromHtml = (html: string): string => {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  } catch (e) {
    console.error("Error parsing HTML for text extraction:", e);
    // フォールバックとして簡易的なタグ除去（不完全な場合あり）
    return html.replace(/<[^>]+>/g, "");
  }
};
