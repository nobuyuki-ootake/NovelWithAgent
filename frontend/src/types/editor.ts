import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

// カスタムエディタ型の定義
export type CustomEditor = BaseEditor & ReactEditor;

// カスタム要素の型定義
export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type CustomElement = ParagraphElement;

// カスタムテキストの型定義
export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

// Slateの型の拡張
declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
