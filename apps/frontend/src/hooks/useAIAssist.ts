import { useState } from "react";
import { aiAgentApi } from "../api/aiAgent";
import { toast } from "sonner";
import {
  AgentResponse,
  CharacterBatchResponse,
  WorldBuildingApiResponse,
  WorldBuildingBatchResponse,
  WorldBuildingElementResponse,
} from "../types/apiResponse";
import {
  Character,
  PlotElement,
  WorldBuildingElement,
  WorldBuildingElementData,
} from "@novel-ai-assistant/types";

interface UseAIAssistOptions {
  /**
   * あらすじ支援専用のコールバック関数
   * @param response あらすじ支援AI応答
   */
  onSynopsisSuccess?: (response: AgentResponse) => void;

  /**
   * プロット支援専用のコールバック関数
   * @param response プロット支援AI応答
   */
  onPlotSuccess?: (response: AgentResponse) => void;

  /**
   * キャラクター支援専用のコールバック関数
   * @param response キャラクター支援AI応答
   */
  onCharacterSuccess?: (response: AgentResponse) => void;

  /**
   * 世界観支援専用のコールバック関数
   * @param response 世界観支援AI応答
   */
  onWorldBuildingSuccess?: (response: WorldBuildingElementResponse) => void;

  /**
   * 世界観バッチ生成専用のコールバック関数
   * @param response 世界観バッチ生成応答
   */
  onWorldBuildingBatchSuccess?: (response: WorldBuildingBatchResponse) => void;

  /**
   * キャラクターバッチ生成専用のコールバック関数
   * @param response キャラクターバッチ生成応答
   */
  onCharacterBatchSuccess?: (response: CharacterBatchResponse) => void;

  /**
   * 文体支援専用のコールバック関数
   * @param response 文体支援AI応答
   */
  onStyleSuccess?: (response: AgentResponse) => void;

  /**
   * エラー発生時のコールバック関数
   * @param error エラー
   */
  onError?: (error: Error) => void;

  /**
   * ロード中ステータスが変わったときのコールバック関数
   * @param isLoading ロード中かどうか
   */
  onLoadingChange?: (isLoading: boolean) => void;

  /**
   * キャラクター生成の進捗状況のコールバック関数
   * @param progress 進捗状況 (0.0 〜 1.0)
   * @param currentCharacter 現在生成中のキャラクター情報
   * @param totalCharacters 生成予定の合計キャラクター数
   */
  onCharacterGenerationProgress?: (
    progress: number,
    currentCharacter?: { name: string; role: string },
    totalCharacters?: number
  ) => void;

  /**
   * 個別キャラクターが生成された時のコールバック関数
   * @param character 生成されたキャラクター情報
   */
  onCharacterGenerated?: (character: AgentResponse) => void;

  /**
   * 世界観構築要素が生成された時のコールバック関数
   * @param element 生成された世界観要素情報
   */
  onWorldBuildingElementGenerated?: (
    element: WorldBuildingElementResponse
  ) => void;
}

/**
 * AIアシスタント機能を提供するフック
 */
export function useAIAssist(options: UseAIAssistOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<
    AgentResponse | CharacterBatchResponse | WorldBuildingBatchResponse | null
  >(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentCharacter, setCurrentCharacter] = useState<
    { name: string; role: string } | undefined
  >(undefined);
  const [totalCharacters, setTotalCharacters] = useState(0);

  // ロード状態が変わったときにコールバックを呼び出す
  const updateLoading = (loading: boolean) => {
    setIsLoading(loading);
    options.onLoadingChange?.(loading);
  };

  // 進捗状況を更新する
  const updateProgress = (
    progress: number,
    character?: { name: string; role: string },
    total?: number
  ) => {
    setGenerationProgress(progress);
    if (character) setCurrentCharacter(character);
    if (total !== undefined) setTotalCharacters(total);

    // コールバックを呼び出す
    options.onCharacterGenerationProgress?.(progress, character, total);
  };

  /**
   * 汎用チャット関数
   */
  const chat = async (
    message: string,
    selectedElements: (Character | PlotElement | WorldBuildingElement)[] = [],
    networkType?: "novel-creation" | "plot-development" | "writing-improvement"
  ) => {
    try {
      updateLoading(true);
      setError(null);

      const result = await aiAgentApi.chat(
        message,
        selectedElements,
        networkType
      );

      setResponse(result as AgentResponse);
      return result as AgentResponse;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("AIアシスタントとの通信に失敗しました");
      options.onError?.(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  /**
   * プロット支援
   */
  const assistPlot = async (
    message: string,
    plotElements: PlotElement[] = []
  ) => {
    try {
      updateLoading(true);
      setError(null);

      const result = await aiAgentApi.getPlotAdvice(message, plotElements);

      setResponse(result as AgentResponse);
      // 専用コールバックを使用
      if (options.onPlotSuccess) {
        options.onPlotSuccess(result as AgentResponse);
      }
      return result as AgentResponse;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("プロット支援に失敗しました");
      options.onError?.(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  /**
   * あらすじ支援
   */
  const assistSynopsis = async (
    message: string,
    titleContext: { title?: string; genre?: string }[] = []
  ) => {
    try {
      updateLoading(true);
      setError(null);

      const result = await aiAgentApi.getSynopsisAdvice(message, titleContext);

      setResponse(result as AgentResponse);
      // 専用コールバックを使用
      if (options.onSynopsisSuccess) {
        options.onSynopsisSuccess(result as AgentResponse);
      }
      return result as AgentResponse;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("あらすじ支援に失敗しました");
      options.onError?.(err instanceof Error ? err : new Error(String(err)));
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
    characterElements: Character[] = []
  ) => {
    try {
      updateLoading(true);
      setError(null);

      const result = await aiAgentApi.getCharacterAdvice(
        message,
        characterElements
      );

      setResponse(result as AgentResponse);
      // 専用コールバックを使用
      if (options.onCharacterSuccess) {
        options.onCharacterSuccess(result as AgentResponse);
      }
      return result as AgentResponse;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("キャラクター支援に失敗しました");
      options.onError?.(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  /**
   * キャラクター生成（分割リクエスト実装）
   */
  const generateCharactersBatch = async (
    message: string,
    plotElements: PlotElement[] = [],
    existingCharacters: Character[] = []
  ) => {
    try {
      updateLoading(true);
      setError(null);
      updateProgress(0);

      // 処理開始を通知
      toast.info("キャラクターリストの生成を開始しています...");

      // ステップ1: キャラクターリストの生成
      const enhancedListMessage = `
キャラクター名とその役割（主人公/敵役/脇役）のリストを作成してください。
以下のJSONフォーマットで出力してください:
[
  {"name": "キャラクター名1", "role": "主人公/敵役/脇役"},
  {"name": "キャラクター名2", "role": "主人公/敵役/脇役"}
]

${message}`;

      const listResult = await aiAgentApi.generateCharacterList(
        enhancedListMessage,
        plotElements,
        existingCharacters
      );

      // レスポンスからキャラクター一覧を抽出
      let characterList: { name: string; role: string }[] = [];
      try {
        const response = listResult.response || "";
        // JSONパターンを見つける
        const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          characterList = JSON.parse(jsonMatch[0]);
          toast.success(
            `${characterList.length}人のキャラクターリストを作成しました。詳細を生成します...`
          );
        } else {
          throw new Error("JSON形式のキャラクターリストが見つかりませんでした");
        }
      } catch (e) {
        console.error("キャラクターリストのパースに失敗:", e);
        toast.error("キャラクターリストの解析に失敗しました");
        throw e;
      }

      // 生成するキャラクターがない場合
      if (characterList.length === 0) {
        toast.error("生成するキャラクターがありません");
        throw new Error("生成するキャラクターがありません");
      }

      // 総キャラクター数を設定
      const total = characterList.length;
      setTotalCharacters(total);
      updateProgress(0.1, characterList[0], total);

      // ステップ2: 各キャラクターの詳細を生成
      const generatedCharacters: AgentResponse[] = [];
      let currentIndex = 0;

      for (const charInfo of characterList) {
        // 進捗状況の更新
        const progress = 0.1 + (0.9 * currentIndex) / total;
        updateProgress(progress, charInfo, total);

        // 現在のキャラクター生成状況を通知
        toast.info(
          `キャラクター生成中 (${currentIndex + 1}/${total}): 「${
            charInfo.name
          }」(${charInfo.role})`
        );

        // キャラクター詳細のリクエスト用メッセージを構築
        const detailMessage = `
以下の厳密なフォーマットに従って、「${charInfo.name}」というキャラクターの詳細情報を作成してください。

名前: ${charInfo.name}
役割: ${charInfo.role}
性別: [性別]
年齢: [年齢]
説明: [短い説明]
背景: [背景情報]
動機: [動機]
特性: [特性1], [特性2], [特性3]
アイコン: [絵文字]

関係:
- [他キャラ名]: [関係タイプ] - [関係の説明]
- [他キャラ名]: [関係タイプ] - [関係の説明]
`;

        // キャラクター詳細を取得
        const detailResult = await aiAgentApi.generateCharacterDetail(
          charInfo.name,
          charInfo.role,
          detailMessage,
          plotElements,
          [...existingCharacters, ...generatedCharacters]
        );

        // 結果を解析してキャラクター情報を抽出
        if (detailResult && detailResult.response) {
          // パース結果を追加
          generatedCharacters.push({
            response: detailResult.response,
            agentUsed: detailResult.agentUsed,
            steps: detailResult.steps,
          });

          // 個別キャラクターが生成されたことを通知
          toast.success(
            `キャラクター「${charInfo.name}」を生成しました (${
              currentIndex + 1
            }/${total})`
          );

          // 個別キャラクターが生成されたことを通知（コールバック）
          if (options.onCharacterGenerated) {
            options.onCharacterGenerated(detailResult as AgentResponse);
          }
        }

        currentIndex++;
      }

      // 結果を返す
      const finalResult: CharacterBatchResponse = {
        batchResponse: true,
        characters: generatedCharacters,
        totalCharacters: characterList.length,
      };

      // バッチ成功コールバックがあれば呼び出し
      if (options.onCharacterBatchSuccess) {
        options.onCharacterBatchSuccess(finalResult);
      }

      return finalResult;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(
        "キャラクター生成に失敗しました: " +
          (err instanceof Error ? err.message : "不明なエラー")
      );
      if (options.onError) {
        options.onError(err instanceof Error ? err : new Error(String(err)));
      }
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  /**
   * キャラクター生成（従来の方法）
   */
  const generateCharacter = async (
    message: string,
    plotElements: PlotElement[] = [],
    existingCharacters: Character[] = []
  ) => {
    try {
      updateLoading(true);
      setError(null);

      // 改善されたメッセージテンプレート - フォーマットの厳格化
      let enhancedMessage = message;
      if (!message.includes("フォーマット") && !message.includes("形式")) {
        // デフォルトのフォーマット指示を追加
        enhancedMessage = `以下の厳密なフォーマットに従って、物語に登場する主要キャラクターを作成してください。
各キャラクターは以下のフォーマットで記述し、キャラクター間は空行2つで区切ってください。

名前: [キャラクター名]
役割: [主人公/敵役/脇役]
性別: [性別]
年齢: [年齢]
説明: [短い説明]
背景: [背景情報]
動機: [動機]
特性: [特性1], [特性2], [特性3]
アイコン: [絵文字]

関係:
- [他キャラ名]: [関係タイプ] - [関係の説明]
- [他キャラ名]: [関係タイプ] - [関係の説明]

${message}`;
      }

      const result = await aiAgentApi.generateCharacter(
        enhancedMessage,
        plotElements,
        existingCharacters
      );

      setResponse(result as AgentResponse);
      return result as AgentResponse;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("キャラクター生成に失敗しました");
      options.onError?.(err instanceof Error ? err : new Error(String(err)));
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

      setResponse(result as AgentResponse);
      if (options.onStyleSuccess) {
        options.onStyleSuccess(result as AgentResponse);
      }
      return result as AgentResponse;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("文体支援に失敗しました");
      options.onError?.(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  /**
   * エラー処理を統一したヘルパー関数
   */
  const handleGenerationError = (err: unknown, processName: string) => {
    const error = err instanceof Error ? err : new Error(String(err));
    setError(error);
    toast.error(`${processName}に失敗しました: ${error.message}`);
    options.onError?.(error);
  };

  /**
   * 世界観要素リストを抽出するヘルパー関数
   */
  const extractWorldBuildingElementList = async (
    message: string,
    plotElements: PlotElement[],
    characterElements: Character[]
  ): Promise<{ name: string; type: string }[]> => {
    // 一時的なもの
    const enhancedListMessage = `
世界観に登場する重要な場所とその特徴のリストを作成してください。
以下のJSONフォーマットで出力してください:
[
  {"name": "場所の名前1", "type": "place"},
  {"name": "場所の名前2", "type": "place"},
]

重要な注意:
- 特殊なマーカー記号は使用しないでください
- 名前はシンプルに記述してください
- 純粋なテキストのみを使用してください

2つの主要な場所を定義してください
${message}`;

    const listResult = await aiAgentApi.generateWorldBuildingList(
      enhancedListMessage,
      plotElements,
      characterElements,
      "gemini-1.5-pro",
      "json",
      "places"
    );

    // リスト抽出処理
    let elementList: { name: string; type: string }[] = [];

    // APIから直接JSON配列を取得できる場合
    if (listResult?.data && Array.isArray(listResult.data)) {
      elementList = listResult.data;
      toast.success(
        `${elementList.length}件の世界観要素リストを作成しました。詳細を生成します...`
      );
      return elementList;
    }

    // レスポンス文字列からJSON抽出を試みる
    const response = listResult.response || "";
    const jsonMatch = response.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error("JSON形式の世界観要素リストが見つかりませんでした");
    }

    elementList = JSON.parse(jsonMatch[0]);
    toast.success(
      `${elementList.length}件の世界観要素リストを作成しました。詳細を生成します...`
    );

    if (elementList.length === 0) {
      throw new Error("生成する世界観要素がありません");
    }

    return elementList;
  };
  //     const enhancedListMessage = `
  // 世界観に登場する重要な場所とその特徴のリストを作成してください。
  // 以下のJSONフォーマットで出力してください:
  // [
  //   {"name": "場所の名前1", "type": "place"},
  //   {"name": "場所の名前2", "type": "place"},
  //   {"name": "文化名1", "type": "culture"},
  //   {"name": "ルール名1", "type": "rule"}
  // ]

  // 重要な注意:
  // - 特殊なマーカー記号は使用しないでください
  // - 名前はシンプルに記述してください
  // - 純粋なテキストのみを使用してください

  // 少なくとも3つの主要な場所を含めてください。
  // ${message}`;

  //     const listResult = await aiAgentApi.generateWorldBuildingList(
  //       enhancedListMessage,
  //       plotElements,
  //       characterElements,
  //       "gemini-1.5-pro",
  //       "json",
  //       "places"
  //     );

  //     // リスト抽出処理
  //     let elementList: { name: string; type: string }[] = [];

  //     // APIから直接JSON配列を取得できる場合
  //     if (listResult?.data && Array.isArray(listResult.data)) {
  //       elementList = listResult.data;
  //       toast.success(
  //         `${elementList.length}件の世界観要素リストを作成しました。詳細を生成します...`
  //       );
  //       return elementList;
  //     }

  //     // レスポンス文字列からJSON抽出を試みる
  //     const response = listResult.response || "";
  //     const jsonMatch = response.match(/\[[\s\S]*\]/);

  //     if (!jsonMatch) {
  //       throw new Error("JSON形式の世界観要素リストが見つかりませんでした");
  //     }

  //     elementList = JSON.parse(jsonMatch[0]);
  //     toast.success(
  //       `${elementList.length}件の世界観要素リストを作成しました。詳細を生成します...`
  //     );

  //     if (elementList.length === 0) {
  //       throw new Error("生成する世界観要素がありません");
  //     }

  //     return elementList;
  //   };

  /**
   * 要素レスポンスオブジェクトを作成するヘルパー関数
   */
  const createElementResponse = (
    detailResult: WorldBuildingApiResponse,
    elementInfo: { name: string; type: string }
  ): WorldBuildingElementResponse => {
    // データが直接利用可能な場合
    if (detailResult?.data) {
      const elementData: WorldBuildingElementData = {
        name: elementInfo.name,
        type: elementInfo.type,
        rawData: detailResult.data as WorldBuildingElement,
      };

      return {
        type: elementInfo.type,
        name: elementInfo.name,
        response: detailResult.response || "",
        agentUsed: detailResult.agentUsed,
        steps: detailResult.steps,
        elementName: elementInfo.name,
        elementType: elementInfo.type,
        elementData: elementData,
      } as WorldBuildingElementResponse;
    }

    // データが直接利用できない場合
    return {
      type: elementInfo.type,
      name: elementInfo.name,
      response: detailResult.response || "",
      agentUsed: detailResult.agentUsed,
      steps: detailResult.steps,
      elementName: elementInfo.name,
      elementType: elementInfo.type,
    } as WorldBuildingElementResponse;
  };

  /**
   * 要素詳細の生成を行うヘルパー関数
   */
  const generateElementDetails = async (
    elementList: { name: string; type: string }[],
    total: number,
    plotElements: PlotElement[],
    characterElements: Character[]
  ): Promise<WorldBuildingElementResponse[]> => {
    const generatedElements: WorldBuildingElementResponse[] = [];

    for (let i = 0; i < elementList.length; i++) {
      const elementInfo = elementList[i];
      const progress = 0.1 + (0.9 * i) / total;

      // 進捗状況の更新
      updateProgress(
        progress,
        { name: elementInfo.name, role: elementInfo.type },
        total
      );

      toast.info(
        `世界観要素生成中 (${i + 1}/${total}): 「${elementInfo.name}」(${
          elementInfo.type
        })`
      );

      // 要素詳細のリクエスト用メッセージ
      const detailMessage = `
以下の厳密なフォーマットに従って、「${elementInfo.name}」という${elementInfo.type}の詳細情報を作成してください。

重要な注意:
- 特殊なマーカー記号は使用しないでください
- 純粋なテキストのみを使用してください
- 装飾や強調のための記号は使わないでください
`;

      // 要素詳細を取得
      const detailResult = await aiAgentApi.generateWorldBuildingDetail(
        elementInfo.name,
        elementInfo.type,
        detailMessage,
        plotElements,
        characterElements,
        "json"
      );

      // 生成された要素の処理
      const elementResponse = createElementResponse(detailResult, elementInfo);
      generatedElements.push(elementResponse);
      console.log("生成された要素:", elementResponse);
      console.log("要素追加後の一時保存配列:", generatedElements);

      // 要素生成完了通知
      toast.success(
        `「${elementInfo.name}」を生成しました (${i + 1}/${total})`
      );

      // コールバック実行
      options.onWorldBuildingElementGenerated?.(elementResponse);
    }

    return generatedElements;
  };

  /**
   * 世界観構築要素のバッチ生成
   */
  const generateWorldBuildingBatch = async (
    message: string,
    plotElements: PlotElement[] = [],
    characterElements: Character[] = []
  ) => {
    try {
      updateLoading(true);
      setError(null);
      updateProgress(0);

      toast.info("世界観要素リストの生成を開始しています...");

      // ステップ1: 世界観要素リストの取得
      const elementList = await extractWorldBuildingElementList(
        message,
        plotElements,
        characterElements
      );

      // 総要素数の設定と初期進捗更新
      const total = elementList.length;
      setTotalCharacters(total);
      updateProgress(
        0.1,
        { name: elementList[0].name, role: elementList[0].type },
        total
      );

      // ステップ2: 各要素の詳細を生成
      const generatedElements = await generateElementDetails(
        elementList,
        total,
        plotElements,
        characterElements
      );

      // 結果を返す
      const finalResult: WorldBuildingBatchResponse = {
        batchResponse: true,
        elements: generatedElements,
        totalElements: elementList.length,
      };

      // バッチ成功コールバックがあれば呼び出し
      options.onWorldBuildingBatchSuccess?.(finalResult);
      return finalResult;
    } catch (err: unknown) {
      handleGenerationError(err, "世界観要素生成");
      throw err;
    } finally {
      updateLoading(false);
    }
  };

  return {
    isLoading,
    error,
    response,
    generationProgress,
    currentCharacter,
    totalCharacters,
    chat,
    assistPlot,
    assistSynopsis,
    assistCharacter,
    generateCharacter,
    generateCharactersBatch,
    assistStyle,
    generateWorldBuildingBatch,
  };
}
