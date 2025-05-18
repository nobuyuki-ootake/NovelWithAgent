import { useState } from "react";
import { TimelineEventSeed, PlotElement } from "@novel-ai-assistant/types";

// タイムラインイベントの「種」をAIに生成させるためのAPIの想定レスポンス型
// 実際にはAPIクライアントの型定義に依存します
// interface GenerateEventSeedsResponse {
//   seeds: TimelineEventSeed[];
//   // 必要に応じて他の情報（例: AIの提案理由、コストなど）
// }

// useTimelineAI フックのインターフェース
export interface UseTimelineAIReturn {
  eventSeeds: TimelineEventSeed[];
  isLoading: boolean;
  error: Error | null;
  generateEventSeeds: (params: {
    prompt: string;
    plotId?: string | null;
    allPlots?: PlotElement[];
  }) => Promise<void>;
}

/**
 * タイムライン関連のAI機能を提供するカスタムフック
 */
export const useTimelineAI = (): UseTimelineAIReturn => {
  const [eventSeeds, setEventSeeds] = useState<TimelineEventSeed[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * AIに指示を送信し、イベントの「種」のリストを生成・取得する関数
   * @param params AIへの指示内容と関連プロットID
   */
  const generateEventSeeds = async (params: {
    prompt: string;
    plotId?: string | null;
    allPlots?: PlotElement[];
  }): Promise<void> => {
    const { prompt, plotId, allPlots } = params;
    setIsLoading(true);
    setError(null);
    try {
      console.log(
        `AIにイベント生成をリクエスト: "${prompt}", 関連プロットID: ${
          plotId || "なし"
        }`
      );
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const getPlotTitle = (pId: string): string => {
        if (!allPlots) return pId;
        const foundPlot = allPlots.find((p) => p.id === pId);
        return foundPlot ? foundPlot.title : pId;
      };

      const plotTitle = plotId ? getPlotTitle(plotId) : "";

      const dummySeeds: TimelineEventSeed[] = [
        {
          id: "seed-1",
          eventName: plotId
            ? `プロット「${plotTitle}」に関連する試練`
            : "最初の試練",
          characterIds: ["char-主人公ID"],
          relatedPlaceIds: ["place-始まりの村ID"],
          relatedPlotIds: plotId ? [plotId] : undefined,
          relatedPlotTitles: plotId ? [plotTitle] : undefined,
          estimatedTime: "物語開始から数日後",
          description: plotId
            ? `プロット「${plotTitle}」に沿った展開で、主人公が初めて大きな困難に直面する。`
            : "主人公が初めて大きな困難に直面する。",
        },
        {
          id: "seed-2",
          eventName: plotId
            ? `プロット「${plotTitle}」での謎の出会い`
            : "謎の出会い",
          characterIds: ["char-主人公ID", "char-謎の協力者ID"],
          relatedPlaceIds: ["place-古い遺跡ID"],
          relatedPlotIds: plotId ? [plotId] : undefined,
          relatedPlotTitles: plotId ? [plotTitle] : undefined,
          estimatedTime: "最初の試練の後",
          description: "今後の物語の鍵となる人物との出会い。",
        },
      ];
      setEventSeeds(dummySeeds);
    } catch (err) {
      console.error("イベントの種の生成に失敗しました:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("AIによるイベント生成中に不明なエラーが発生しました。")
      );
      setEventSeeds([]); // エラー時は空にするか、以前の値を保持するかは要件次第
    } finally {
      setIsLoading(false);
    }
  };

  return {
    eventSeeds,
    isLoading,
    error,
    generateEventSeeds,
  };
};
