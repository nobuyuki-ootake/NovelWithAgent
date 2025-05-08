import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export interface AIAssistModalProps {
  /**
   * モーダルが開いているかどうか
   */
  open: boolean;

  /**
   * モーダルを閉じる関数
   */
  onClose: () => void;

  /**
   * AIアシスタントに送信するメッセージのデフォルト値
   */
  defaultMessage?: string;

  /**
   * モーダルのタイトル
   */
  title?: string;

  /**
   * モーダルの説明
   */
  description?: string;

  /**
   * AI応答後のコールバック関数
   */
  onAssistComplete: (response: any) => void;

  /**
   * AI応答のリクエスト関数
   */
  requestAssist: (message: string) => Promise<any>;
}

/**
 * AIアシスタントモーダルコンポーネント
 */
export const AIAssistModal: React.FC<AIAssistModalProps> = ({
  open,
  onClose,
  defaultMessage = "",
  title = "AIアシスタント",
  description = "AIに指示を出して項目を埋めてもらいましょう",
  onAssistComplete,
  requestAssist,
}) => {
  const [message, setMessage] = useState(defaultMessage);
  const [isLoading, setIsLoading] = useState(false);

  // リセット処理
  const handleReset = () => {
    setMessage(defaultMessage);
  };

  // キャンセル処理
  const handleCancel = () => {
    handleReset();
    onClose();
  };

  // 送信処理
  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("メッセージを入力してください");
      return;
    }

    try {
      setIsLoading(true);
      const response = await requestAssist(message);
      onAssistComplete(response);
      toast.success("AIが応答しました");
      handleCancel();
    } catch (error) {
      console.error("AIアシスト処理エラー:", error);
      toast.error("AIアシスタントとの通信に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="AIへの指示を入力してください..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="resize-none"
            disabled={isLoading}
          />

          {isLoading && (
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
              <Spinner className="h-4 w-4" />
              AIが応答を生成中...
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? <Spinner className="h-4 w-4 mr-2" /> : null}
            AIに送信
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
