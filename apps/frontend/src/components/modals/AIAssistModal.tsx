import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Spinner } from "../ui/spinner";
import {
  Box,
  Tabs,
  Tab,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { PlotElement } from "@novel-ai-assistant/types";

// レスポンス型の定義
export interface ResponseData {
  response?: string;
  batchResponse?: boolean;
  [key: string]: unknown;
}

// キャラクター型の定義
export interface Character {
  name?: string;
  role?: string;
  response?: string;
  [key: string]: unknown;
}

interface AIAssistModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  defaultMessage?: string;
  requestAssist: (params: {
    message: string;
    plotId?: string | null;
  }) => Promise<ResponseData> | Promise<void>;
  onAssistComplete?: (result: ResponseData) => void;
  supportsBatchGeneration?: boolean;
  isLoading?: boolean;
  plots?: PlotElement[];
}

export const AIAssistModal: React.FC<AIAssistModalProps> = ({
  open,
  onClose,
  title,
  description,
  defaultMessage = "",
  requestAssist,
  onAssistComplete,
  supportsBatchGeneration = false,
  isLoading: externalIsLoading,
  plots = [],
}) => {
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [message, setMessage] = useState(defaultMessage || "");
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [activeTab, setActiveTab] = useState<"input" | "response">("input");
  const [useBatchGeneration, setUseBatchGeneration] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [currentCharacter, setCurrentCharacter] = useState<Character>({});
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [generatedCharacters, setGeneratedCharacters] = useState<Character[]>(
    []
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }

    if (open) {
      setMessage(defaultMessage);
      setResponse(null);
      setError(null);
      setActiveTab("input");
      setBatchProgress(0);
      setCurrentCharacter({});
      setTotalCharacters(0);
      setGeneratedCharacters([]);
      setSelectedPlotId(null);
    }
  }, [open, defaultMessage]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (!message.trim() || internalIsLoading || externalIsLoading) return;

    setInternalIsLoading(true);
    setError(null);
    setResponse(null);
    setActiveTab("response");

    try {
      const result = await requestAssist({ message, plotId: selectedPlotId });
      if (result) {
        setResponse(result);

        if (onAssistComplete) {
          onAssistComplete(result);
        }
      } else {
        setResponse({
          response: "操作は完了しましたが、応答データはありません。",
        });
      }
    } catch (err) {
      console.error("AIアシスト実行エラー:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setInternalIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleCancel = () => {
    if (!internalIsLoading) {
      onClose();
    }
  };

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: "input" | "response"
  ) => {
    setActiveTab(newValue);
  };

  const handleBatchGenerationToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUseBatchGeneration(event.target.checked);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent
        className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[900px] w-[95vw] max-h-[90vh] overflow-auto"
        style={{ padding: "1.5rem" }}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <Box sx={{ width: "100%", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="AI Assist tabs"
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label="リクエスト" value="input" />
            <Tab label="レスポンス" value="response" />
          </Tabs>
        </Box>

        {activeTab === "input" && (
          <div>
            {plots && plots.length > 0 && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="plot-select-label">
                  関連プロット (任意)
                </InputLabel>
                <Select
                  labelId="plot-select-label"
                  id="plot-select"
                  value={selectedPlotId || ""}
                  label="関連プロット (任意)"
                  onChange={(e) =>
                    setSelectedPlotId((e.target.value as string) || null)
                  }
                  disabled={internalIsLoading || externalIsLoading}
                >
                  <MenuItem value="">
                    <em>指定なし</em>
                  </MenuItem>
                  {plots.map((plot) => (
                    <MenuItem key={plot.id} value={plot.id}>
                      {plot.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyDown}
              rows={8}
              className="resize-none text-base p-3 w-full"
              style={{ minHeight: "150px" }}
              disabled={internalIsLoading || externalIsLoading}
            />

            {supportsBatchGeneration && (
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="batch-generation"
                  checked={useBatchGeneration}
                  onChange={handleBatchGenerationToggle}
                  disabled={internalIsLoading || externalIsLoading}
                />
                <label htmlFor="batch-generation" className="text-sm">
                  キャラクターを1人ずつ生成（より詳細な情報を取得）
                </label>
              </div>
            )}
          </div>
        )}

        {activeTab === "response" && (
          <div className="border rounded-md p-4 min-h-[200px] w-full bg-gray-50">
            {internalIsLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-6">
                <Spinner className="h-8 w-8" />
                <p className="mt-4 text-gray-600">処理中...</p>

                {useBatchGeneration && batchProgress > 0 && (
                  <div className="w-full mt-4 space-y-2">
                    <LinearProgress
                      variant="determinate"
                      value={batchProgress}
                      sx={{ width: "100%" }}
                    />
                    <p className="text-sm text-center">
                      {currentCharacter &&
                      currentCharacter.name &&
                      currentCharacter.role
                        ? `「${currentCharacter.name}」(${currentCharacter.role}) を生成中... ${generatedCharacters.length}/${totalCharacters}キャラクター完了`
                        : `キャラクターリストを生成中...`}
                    </p>
                  </div>
                )}
              </div>
            ) : error ? (
              <div className="text-red-500 p-2 rounded-md">
                <p className="font-medium">エラーが発生しました:</p>
                <p>{error.message}</p>
              </div>
            ) : response ? (
              <div className="p-4 border border-gray-200 rounded-md whitespace-pre-wrap font-mono text-sm">
                {response.batchResponse ? (
                  <div>
                    <p className="font-bold mb-2">
                      {totalCharacters}人のキャラクターが生成されました:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      {generatedCharacters.map((char, index) => (
                        <li key={index}>
                          {char.response?.split("\n")[0] ||
                            `キャラクター ${index + 1}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  response.response || JSON.stringify(response, null, 2)
                )}
              </div>
            ) : (
              <p className="text-gray-400 italic text-center py-10">
                AIからの応答がここに表示されます
              </p>
            )}
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={internalIsLoading || externalIsLoading}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={internalIsLoading || externalIsLoading || !message.trim()}
          >
            {internalIsLoading ? (
              <Spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            生成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
