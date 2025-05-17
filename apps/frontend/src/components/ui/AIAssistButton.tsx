import React, { useState } from "react";
import { Button } from "./button";
import { Wand } from "lucide-react";
import { Spinner } from "./spinner";

export interface AIAssistButtonProps {
  /**
   * ボタンクリック時に実行される関数
   * プロミスを返す必要があります
   */
  onAssist: () => Promise<void>;

  /**
   * ボタンのテキスト
   * @default "AIに項目を埋めてもらう"
   */
  text?: string;

  /**
   * ボタンのバリアント
   * @default "outline"
   */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";

  /**
   * ボタンの幅
   * @default "auto"
   */
  width?: string;

  /**
   * ボタンを無効にするかどうか
   * @default false
   */
  disabled?: boolean;

  /**
   * 追加のクラス名
   */
  className?: string;
}

/**
 * AIアシスタントボタンコンポーネント
 * フォームやモーダルで使用するための共通ボタン
 */
export const AIAssistButton: React.FC<AIAssistButtonProps> = ({
  onAssist,
  text = "AIに項目を埋めてもらう",
  variant = "outline",
  width = "auto",
  disabled = false,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onAssist();
    } catch (error) {
      console.error("AIアシスト処理エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`flex items-center gap-2 ${
        width === "full" ? "w-full" : ""
      } ${className}`}
    >
      {isLoading ? (
        <Spinner className="h-4 w-4" />
      ) : (
        <Wand className="h-4 w-4" />
      )}
      {text}
    </Button>
  );
};
