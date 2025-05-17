import axios from "axios";
import { WorldBuildingApiResponse } from "../types/apiResponse";
import { WorldBuildingElementType } from "../types";

// APIのベースURL
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4001/api";

// APIエラーハンドリング共通関数
const handleApiError = (error: any, operationName: string) => {
  // ネットワークエラーの処理
  if (error.message === "Network Error") {
    console.error(`${operationName} - ネットワークエラー:`, error);
    throw new Error(
      `サーバーへの接続に失敗しました。ネットワーク接続を確認してください。`
    );
  }

  // APIエラーレスポンスの処理
  if (error.response) {
    const status = error.response.status;
    const errorData = error.response.data;

    console.error(`${operationName} - APIエラー (${status}):`, errorData);

    // ステータスコードに応じたエラーメッセージ
    switch (status) {
      case 401:
        throw new Error("認証に失敗しました。APIキーを確認してください。");
      case 400:
        throw new Error(
          errorData.error || "リクエストが不正です。入力を確認してください。"
        );
      case 429:
        throw new Error(
          "リクエスト制限を超過しました。しばらく待ってから再試行してください。"
        );
      case 500:
        throw new Error(
          "サーバー内部エラーが発生しました。管理者に連絡してください。"
        );
      default:
        throw new Error(errorData.error || "エラーが発生しました。");
    }
  }

  // その他のエラー
  console.error(`${operationName} - 予期しないエラー:`, error);
  throw error;
};

// AIエージェントAPIクライアント
export const aiAgentApi = {
  /**
   * AIエージェントのステータスを確認する
   * @returns ステータス情報
   */
  getStatus: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai-agent/status`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "AIエージェントステータス確認");
    }
  },

  /**
   * AIエージェントとチャットする
   * @param message ユーザーのメッセージ
   * @param selectedElements 関連要素（キャラクター、プロット等）
   * @param networkType 使用するネットワークタイプ
   */
  chat: async (
    message: string,
    selectedElements: any[] = [],
    networkType:
      | "novel-creation"
      | "plot-development"
      | "writing-improvement" = "novel-creation"
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai-agent/chat`, {
        message,
        selectedElements,
        networkType,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "AIエージェントチャット");
    }
  },

  /**
   * プロットに関するアドバイスを取得
   * @param message ユーザーのメッセージ
   * @param plotElements プロット要素
   */
  getPlotAdvice: async (message: string, plotElements: any[] = []) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai-agent/plot-advice`,
        {
          message,
          plotElements,
        }
      );
      return response.data;
    } catch (error) {
      console.error("プロットアドバイスエラー:", error);
      throw error;
    }
  },

  /**
   * あらすじに関するアドバイスを取得
   * @param message ユーザーのメッセージ
   * @param titleContext タイトル情報など
   */
  getSynopsisAdvice: async (message: string, titleContext: any[] = []) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai-agent/synopsis-advice`,
        {
          message,
          titleContext,
        }
      );
      return response.data;
    } catch (error) {
      console.error("あらすじアドバイスエラー:", error);
      throw error;
    }
  },

  /**
   * キャラクターに関するアドバイスを取得
   * @param message ユーザーのメッセージ
   * @param characterElements キャラクター要素
   */
  getCharacterAdvice: async (
    message: string,
    characterElements: any[] = []
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai-agent/character-advice`,
        {
          message,
          characterElements,
        }
      );
      return response.data;
    } catch (error) {
      console.error("キャラクターアドバイスエラー:", error);
      throw error;
    }
  },

  /**
   * キャラクター生成を行う
   * @param message ユーザーのメッセージ
   * @param plotElements プロット要素
   * @param existingCharacters 既存のキャラクター
   */
  generateCharacter: async (
    message: string,
    plotElements: any[] = [],
    existingCharacters: any[] = []
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai-agent/character-generation`,
        {
          message,
          plotElements,
          existingCharacters,
        }
      );
      return response.data;
    } catch (error) {
      console.error("キャラクター生成エラー:", error);
      throw error;
    }
  },

  /**
   * キャラクターの概要リストを生成する（分割リクエスト第1段階）
   * @param message ユーザーのメッセージ
   * @param plotElements プロット要素
   * @param existingCharacters 既存のキャラクター
   * @returns キャラクター名と役割のリスト
   */
  generateCharacterList: async (
    message: string,
    plotElements: any[] = [],
    existingCharacters: any[] = []
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai-agent/character-list-generation`,
        {
          message,
          plotElements,
          existingCharacters,
        }
      );
      return response.data;
    } catch (error) {
      console.error("キャラクターリスト生成エラー:", error);
      throw error;
    }
  },

  /**
   * 特定のキャラクターの詳細情報を生成する（分割リクエスト第2段階）
   * @param characterName キャラクター名
   * @param characterRole キャラクターの役割
   * @param message 追加の指示
   * @param plotElements プロット要素
   * @param existingCharacters 既存のキャラクター
   * @returns キャラクターの詳細情報
   */
  generateCharacterDetail: async (
    characterName: string,
    characterRole: string,
    message: string = "",
    plotElements: any[] = [],
    existingCharacters: any[] = []
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai-agent/character-detail-generation`,
        {
          characterName,
          characterRole,
          message,
          plotElements,
          existingCharacters,
        }
      );
      return response.data;
    } catch (error) {
      console.error("キャラクター詳細生成エラー:", error);
      throw error;
    }
  },

  /**
   * 文体に関するアドバイスを取得
   * @param message ユーザーのメッセージ（オプション）
   * @param textContent 分析対象のテキスト
   */
  getStyleAdvice: async (textContent: string, message?: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai-agent/style-advice`,
        {
          message,
          textContent,
        }
      );
      return response.data;
    } catch (error) {
      console.error("文体アドバイスエラー:", error);
      throw error;
    }
  },

  /**
   * 世界観構築に関するアドバイスを取得
   * @param message ユーザーのメッセージ
   * @param worldElements 世界観要素
   */
  getWorldBuildingAdvice: async (
    message: string,
    worldElements: any[] = []
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai-agent/worldbuilding-advice`,
        {
          message,
          worldElements,
        }
      );
      return response.data;
    } catch (error) {
      console.error("世界観構築アドバイスエラー:", error);
      throw error;
    }
  },

  /**
   * 世界観の要素リストを生成する（分割リクエスト第1段階）
   * @param message ユーザーのメッセージ
   * @param plotElements プロット要素
   * @param charactersElements キャラクター要素
   * @param model 使用するAIモデル（省略時はGemini Pro 1.5を使用）
   * @param format レスポンス形式（json/yaml、デフォルトはjson）
   * @param elementType 生成する要素タイプ（places/cultures）
   * @returns 世界観要素のリスト（場所や文化など）
   */
  generateWorldBuildingList: async (
    message: string,
    plotElements: any[] = [],
    charactersElements: any[] = [],
    model: string = "gemini-1.5-pro",
    format: string = "json",
    elementType: string = "places"
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai-agent/worldbuilding-list-generation`,
        {
          message,
          plotElements,
          charactersElements,
          model,
          format,
          elementType,
        }
      );
      return response.data;
    } catch (error) {
      console.error("世界観要素リスト生成エラー:", error);
      throw error;
    }
  },

  /**
   * 特定の世界観要素の詳細情報を生成する（分割リクエスト第2段階）
   * @param elementName 要素名（場所名など）
   * @param elementType 要素タイプ（place, culture, ruleなど）
   * @param message 追加の指示
   * @param plotElements プロット要素
   * @param charactersElements キャラクター要素
   * @param format レスポンス形式（json/yaml、デフォルトはjson）
   * @returns 世界観要素の詳細情報
   */
  generateWorldBuildingDetail: async (
    elementName: string,
    elementType: string,
    message: string = "",
    plotElements: any[] = [],
    charactersElements: any[] = [],
    format: string = "json"
  ): Promise<WorldBuildingApiResponse> => {
    try {
      // 要素タイプの正規化（小文字に変換）
      const normalizedElementType =
        elementType?.toLowerCase() || WorldBuildingElementType.FREE_FIELD;

      // APIリクエストを送信（プロンプト生成はバックエンド側で行われる）
      const response = await axios.post<WorldBuildingApiResponse>(
        `${API_BASE_URL}/ai-agent/worldbuilding-detail-generation`,
        {
          elementName,
          elementType: normalizedElementType,
          message, // 追加指示はそのままバックエンドに渡す
          plotElements,
          charactersElements,
          format,
        }
      );

      // 型の検証
      if (!isWorldBuildingApiResponse(response.data)) {
        console.error("期待される型: WorldBuildingApiResponse", {
          status: "string",
          data: "Record<string, unknown>",
          rawContent: "string",
          metadata: {
            model: "string",
            processingTime: "number",
            requestType: "string",
            format: "string",
          },
        });
        console.error("実際のレスポンス:", response.data);
        throw new Error("レスポンスの型が不正です");
      }

      return response.data;
    } catch (error) {
      console.error("世界観要素詳細生成エラー:", error);
      throw error;
    }
  },

  /**
   * API設定を保存する
   * @param providerSettings プロバイダー設定
   */
  saveApiSettings: async (providerSettings: {
    provider: string;
    apiKey: string;
    modelName: string;
    parameters?: {
      temperature?: number;
      topP?: number;
      maxTokens?: number;
    };
  }) => {
    try {
      // APIキーは暗号化してから送信
      const { apiKey, ...rest } = providerSettings;
      const encryptedKey = await encryptApiKey(apiKey);

      const response = await axios.post(`${API_BASE_URL}/ai-agent/settings`, {
        ...rest,
        apiKey: encryptedKey,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "API設定の保存");
    }
  },

  /**
   * API設定を取得する
   */
  getApiSettings: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai-agent/settings`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "API設定の取得");
    }
  },

  /**
   * APIキーの有効性をテストする
   * @param provider プロバイダー名
   * @param apiKey APIキー
   * @param modelName モデル名
   */
  testApiKey: async (provider: string, apiKey: string, modelName: string) => {
    try {
      // APIキーは暗号化してから送信
      const encryptedKey = await encryptApiKey(apiKey);

      const response = await axios.post(`${API_BASE_URL}/ai-agent/test-key`, {
        provider,
        apiKey: encryptedKey,
        modelName,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "APIキーテスト");
    }
  },
};

/**
 * APIキーを暗号化する簡易関数
 * 実際の実装ではもっと安全な方法を使用すべき
 */
const encryptApiKey = async (apiKey: string): Promise<string> => {
  // ここではデモとして単純なBase64エンコードを使用
  // 実際の実装ではAES-256などの強力な暗号化を使用するべき
  return btoa(apiKey);
};

// 型ガード関数の作成
function isWorldBuildingApiResponse(
  data: any
): data is WorldBuildingApiResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.status === "string" &&
    typeof data.data === "object" &&
    typeof data.rawContent === "string" &&
    typeof data.metadata === "object" &&
    typeof data.metadata.model === "string" &&
    typeof data.metadata.processingTime === "number" &&
    typeof data.metadata.requestType === "string" &&
    typeof data.metadata.format === "string"
  );
}
