import { useState } from "react";
import { aiAgentApi } from "../api/aiAgent";
import { toast } from "sonner";

interface UseAIAssistOptions {
  /**
   * AI応答後のコールバック関数
   * @param response AI応答
   */
  onSuccess?: (response: any) => void;

  /**
   * エラー発生時のコールバック関数
   * @param error エラー
   */
  onError?: (error: any) => void;

  /**
   * ロード中ステータスが変わったときのコールバック関数
   * @param isLoading ロード中かどうか
   */
  onLoadingChange?: (isLoading: boolean) => void;
}

/**
 * AIアシスタント機能を提供するフック
 */
export function useAIAssist(options: UseAIAssistOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<any>(null);

  // ロード状態が変わったときにコールバックを呼び出す
  const updateLoading = (loading: boolean) => {
    setIsLoading(loading);
    options.onLoadingChange?.(loading);
  };

  /**
   * 汎用チャット関数
   */
  const chat = async (
    message: string,
    selectedElements: any[] = [],
    networkType?: any
  ) => {
    try {
      updateLoading(true);
      setError(null);

      const result = await aiAgentApi.chat(
        message,
        selectedElements,
        networkType
      );

      setResponse(result);
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      setError(err);
      toast.error("AIアシスタントとの通信に失敗しました");
      options.onError?.(err);
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  /**
   * プロット支援
   */
  const assistPlot = async (message: string, plotElements: any[] = []) => {
    try {
      updateLoading(true);
      setError(null);

      const result = await aiAgentApi.getPlotAdvice(message, plotElements);

      setResponse(result);
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      setError(err);
      toast.error("プロット支援に失敗しました");
      options.onError?.(err);
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  /**
   * あらすじ支援
   */
  const assistSynopsis = async (message: string, titleContext: any[] = []) => {
    try {
      updateLoading(true);
      setError(null);

      const result = await aiAgentApi.getSynopsisAdvice(message, titleContext);

      setResponse(result);
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      setError(err);
      toast.error("あらすじ支援に失敗しました");
      options.onError?.(err);
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  /**
   * キャラクター支援
   */
  const assistCharacter = async (
    message: string,
    characterElements: any[] = []
  ) => {
    try {
      updateLoading(true);
      setError(null);

      const result = await aiAgentApi.getCharacterAdvice(
        message,
        characterElements
      );

      setResponse(result);
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      setError(err);
      toast.error("キャラクター支援に失敗しました");
      options.onError?.(err);
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  /**
   * キャラクター生成
   */
  const generateCharacter = async (
    message: string,
    plotElements: any[] = [],
    existingCharacters: any[] = []
  ) => {
    try {
      updateLoading(true);
      setError(null);

      const result = await aiAgentApi.generateCharacter(
        message,
        plotElements,
        existingCharacters
      );

      setResponse(result);
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      setError(err);
      toast.error("キャラクター生成に失敗しました");
      options.onError?.(err);
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  /**
   * 文体支援
   */
  const assistStyle = async (textContent: string, message?: string) => {
    try {
      updateLoading(true);
      setError(null);

      const result = await aiAgentApi.getStyleAdvice(textContent, message);

      setResponse(result);
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      setError(err);
      toast.error("文体支援に失敗しました");
      options.onError?.(err);
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  /**
   * 世界観構築支援
   */
  const assistWorldBuilding = async (
    message: string,
    worldElements: any[] = []
  ) => {
    try {
      updateLoading(true);
      setError(null);

      const result = await aiAgentApi.getWorldBuildingAdvice(
        message,
        worldElements
      );

      setResponse(result);
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      setError(err);
      toast.error("世界観構築支援に失敗しました");
      options.onError?.(err);
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  return {
    isLoading,
    error,
    response,
    chat,
    assistPlot,
    assistSynopsis,
    assistCharacter,
    generateCharacter,
    assistStyle,
    assistWorldBuilding,
  };
}
