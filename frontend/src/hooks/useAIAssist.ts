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
  onCharacterGenerated?: (character: any) => void;

  /**
   * 世界観構築要素が生成された時のコールバック関数
   * @param element 生成された世界観要素情報
   */
  onWorldBuildingElementGenerated?: (element: any) => void;
}

/**
 * AIアシスタント機能を提供するフック
 */
export function useAIAssist(options: UseAIAssistOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<any>(null);
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
   * キャラクター生成（分割リクエスト実装）
   */
  const generateCharactersBatch = async (
    message: string,
    plotElements: any[] = [],
    existingCharacters: any[] = []
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
      const generatedCharacters = [];
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
            options.onCharacterGenerated(detailResult);
          }
        }

        currentIndex++;
      }

      // 最終的な結果を設定
      const finalResult = {
        batchResponse: true,
        characters: generatedCharacters,
        totalCharacters: total,
      };

      setResponse(finalResult);
      updateProgress(1.0);

      // 全キャラクター生成完了を通知
      toast.success(`${total}人のキャラクター生成が完了しました！`);

      // 成功コールバックを呼び出し
      if (options.onSuccess) {
        options.onSuccess(finalResult);
      }

      return finalResult;
    } catch (err: any) {
      setError(err);
      toast.error(
        "キャラクター生成に失敗しました: " + (err.message || "不明なエラー")
      );
      if (options.onError) {
        options.onError(err);
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
    plotElements: any[] = [],
    existingCharacters: any[] = []
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

      setResponse(result);
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

  /**
   * 世界観生成（分割リクエスト実装）
   */
  const generateWorldBuildingBatch = async (
    message: string,
    plotElements: any[] = [],
    characterElements: any[] = []
  ) => {
    try {
      updateLoading(true);
      setError(null);
      updateProgress(0);

      // 処理開始を通知
      toast.info("世界観要素リストの生成を開始しています...");

      // ステップ1: 世界観要素リストの生成
      const enhancedListMessage = `
物語の世界観に登場する重要な場所とその特徴のリストを作成してください。
以下のJSONフォーマットで出力してください:
[
  {"name": "場所の名前1", "type": "place"},
  {"name": "場所の名前2", "type": "place"},
  {"name": "文化名1", "type": "culture"},
  {"name": "ルール名1", "type": "rule"}
]

少なくとも3つの主要な場所を含めてください。
${message}`;

      const listResult = await aiAgentApi.generateWorldBuildingList(
        enhancedListMessage,
        plotElements,
        characterElements
      );

      // レスポンスから世界観要素一覧を抽出
      let elementList: { name: string; type: string }[] = [];
      try {
        const response = listResult.response || "";
        // JSONパターンを見つける
        const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          elementList = JSON.parse(jsonMatch[0]);
          toast.success(
            `${elementList.length}件の世界観要素リストを作成しました。詳細を生成します...`
          );
        } else {
          throw new Error("JSON形式の世界観要素リストが見つかりませんでした");
        }
      } catch (e) {
        console.error("世界観要素リストのパースに失敗:", e);
        toast.error("世界観要素リストの解析に失敗しました");
        throw e;
      }

      // 生成する要素がない場合
      if (elementList.length === 0) {
        toast.error("生成する世界観要素がありません");
        throw new Error("生成する世界観要素がありません");
      }

      // 総要素数を設定
      const total = elementList.length;
      setTotalCharacters(total); // 既存の状態を流用
      updateProgress(
        0.1,
        { name: elementList[0].name, role: elementList[0].type },
        total
      );

      // ステップ2: 各要素の詳細を生成
      const generatedElements = [];
      let currentIndex = 0;

      for (const elementInfo of elementList) {
        // 進捗状況の更新
        const progress = 0.1 + (0.9 * currentIndex) / total;
        updateProgress(
          progress,
          { name: elementInfo.name, role: elementInfo.type },
          total
        );

        // 現在の要素生成状況を通知
        toast.info(
          `世界観要素生成中 (${currentIndex + 1}/${total}): 「${
            elementInfo.name
          }」(${elementInfo.type})`
        );

        // 要素詳細のリクエスト用メッセージを構築
        const detailMessage = `
以下の厳密なフォーマットに従って、「${elementInfo.name}」という${elementInfo.type}の詳細情報を作成してください。
`;

        // 要素詳細を取得
        const detailResult = await aiAgentApi.generateWorldBuildingDetail(
          elementInfo.name,
          elementInfo.type,
          detailMessage,
          plotElements,
          characterElements
        );

        // 結果を保存
        if (detailResult && detailResult.response) {
          // パース結果を追加
          generatedElements.push({
            response: detailResult.response,
            agentUsed: detailResult.agentUsed,
            steps: detailResult.steps,
            elementName: elementInfo.name,
            elementType: elementInfo.type,
          });

          // 要素が生成されたことを通知
          toast.success(
            `「${elementInfo.name}」を生成しました (${
              currentIndex + 1
            }/${total})`
          );

          // 個別要素が生成されたことを通知（コールバック）
          if (options.onWorldBuildingElementGenerated) {
            options.onWorldBuildingElementGenerated(detailResult);
          }
        }

        currentIndex++;
      }

      // 最終的な結果を設定
      const finalResult = {
        batchResponse: true,
        elements: generatedElements,
        totalElements: total,
      };

      setResponse(finalResult);
      updateProgress(1.0);

      // 全要素生成完了を通知
      toast.success(`${total}件の世界観要素生成が完了しました！`);

      // 成功コールバックを呼び出し
      if (options.onSuccess) {
        options.onSuccess(finalResult);
      }

      return finalResult;
    } catch (err: any) {
      setError(err);
      toast.error(
        "世界観要素生成に失敗しました: " + (err.message || "不明なエラー")
      );
      if (options.onError) {
        options.onError(err);
      }
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
    assistWorldBuilding,
    generateWorldBuildingBatch,
  };
}
