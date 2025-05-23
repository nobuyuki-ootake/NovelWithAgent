import express from 'express';
import { processAIRequest } from '../services/aiIntegration';
import { StandardAIRequest } from '../utils/aiRequestStandard';
import templateManager from '../utils/aiTemplateManager';
import { PLOT_DEVELOPER, WORLD_BUILDER } from '../utils/systemPrompts';
import * as yaml from 'js-yaml';
import {
  WorldBuildingElementType,
  generateElementPrompt,
  WorldBuildingElementData,
} from '../utils/worldBuildingSchemas';

const router = express.Router();

/**
 * 世界観要素の詳細生成エンドポイント
 * 特定の世界観要素（場所、文化、ルールなど）の詳細を生成します
 */
router.post('/worldbuilding-detail-generation', async (req, res) => {
  try {
    const {
      elementName,
      elementType,
      message,
      plotElements,
      charactersElements,
    } = req.body;
    const format = req.body.format || 'json'; // デフォルトをJSONに変更
    const model = req.body.model || 'gemini-1.5-pro';

    console.log(
      `[API] 世界観要素詳細生成リクエスト: ${elementName} (${elementType}), フォーマット: ${format}`,
    );

    // 要素タイプの正規化（小文字に変換）
    const normalizedElementType =
      elementType?.toLowerCase() || WorldBuildingElementType.PLACE;

    // 世界観要素タイプに応じたプロンプトテンプレートを生成
    const promptTemplate = generateElementPrompt(
      normalizedElementType,
      elementName,
    );

    // ユーザーからの追加指示がある場合は組み合わせる
    const enhancedMessage = message
      ? `${promptTemplate}\n\n追加の指示:\n${message}`
      : promptTemplate;

    // システムプロンプトを構築
    const systemPrompt = templateManager.buildWorldElementSystemPrompt(
      elementName,
      normalizedElementType,
    );

    // AIリクエストを作成
    const aiRequest: StandardAIRequest = {
      requestType: 'worldbuilding-detail',
      model: model,
      systemPrompt,
      userPrompt: enhancedMessage,
      context: {
        elementName,
        elementType: normalizedElementType,
        plotElements,
        charactersElements,
      },
      options: {
        temperature: 0.7,
        maxTokens: 2000,
        expectedFormat: format === 'json' ? 'json' : 'yaml',
        responseFormat: format === 'json' ? 'json' : 'yaml',
      },
    };

    // AIリクエストを実行
    console.log(
      `[API] AIリクエスト実行: ${aiRequest.requestType}, フォーマット: ${format}, モデル: ${model}`,
    );
    const aiResponse = await processAIRequest(aiRequest);

    let responseData: WorldBuildingElementData;

    // JSON形式の場合、パースしてエンリッチしたデータを返す
    if (format === 'json' && aiResponse.content) {
      try {
        // パース済みの場合はそのまま使用、文字列ならパースする
        const parsedData =
          typeof aiResponse.content === 'string'
            ? JSON.parse(aiResponse.content)
            : aiResponse.content;

        // 世界観要素共通データの設定
        responseData = {
          ...parsedData,
          type: normalizedElementType,
          originalType: elementType || normalizedElementType,
        };

        console.log(
          `[API] 世界観要素データ処理完了: ${elementName} (${normalizedElementType})`,
        );
      } catch (error) {
        console.error(`[API] エラー: 世界観要素データのパースに失敗`, error);
        responseData = {
          name: elementName,
          type: normalizedElementType,
          description:
            aiResponse.rawContent || '世界観要素の説明を取得できませんでした',
          features: '特徴',
          importance: '重要性',
        };
      }
    } else {
      // YAMLまたはテキスト形式の場合
      responseData = {
        name: elementName,
        type: normalizedElementType,
        description: aiResponse.rawContent || aiResponse.content || '',
        features: '特徴',
        importance: '重要性',
      };
    }

    // レスポンスを返す
    res.json({
      status: 'success',
      data: responseData,
      rawContent: aiResponse.rawContent,
      metadata: {
        model: aiRequest.model,
        processingTime: aiResponse.debug?.processingTime,
        requestType: aiRequest.requestType,
        format: format,
      },
    });
  } catch (error) {
    console.error('[API] 世界観要素詳細生成エラー:', error);
    res.status(500).json({
      status: 'error',
      error: error.message || '世界観要素詳細の生成中にエラーが発生しました',
    });
  }
});

/**
 * 世界観要素のリスト生成エンドポイント
 * 小説世界の場所や文化などのリストを生成します
 */
router.post('/worldbuilding-list-generation', async (req, res) => {
  try {
    const { elementType, userMessage, model } = req.body;
    const format = req.body.format || 'json'; // デフォルトをJSONに変更

    console.log(
      `[API] 世界観要素リスト生成リクエスト: ${elementType || 'タイプ未指定'}, フォーマット: ${format}, モデル: ${model || 'デフォルト'}`,
    );
    console.log(
      `[API] ユーザーメッセージ: ${userMessage ? userMessage.slice(0, 100) + '...' : 'なし'}`,
    );

    // elementTypeの検証を追加
    const validatedElementType = elementType || 'places'; // デフォルトは場所

    // 明示的なデバッグログを追加
    console.log(`[API] 処理される要素タイプ: ${validatedElementType}`);

    // 要素タイプに応じたテンプレートキーを取得（デフォルトを'places'に変更）
    const templateKey =
      validatedElementType === 'places' || validatedElementType === '場所'
        ? 'places'
        : validatedElementType === 'cultures' || validatedElementType === '文化'
          ? 'cultures'
          : validatedElementType === 'characters' ||
              validatedElementType === 'キャラクター'
            ? 'characters'
            : 'places'; // デフォルトを'characters'から'places'に変更

    // テンプレートタイプをログに出力
    console.log(`[API] 使用するテンプレートキー: ${templateKey}`);

    // 汎用的な世界観要素リストテンプレートを使用する
    const modelSpecific =
      model && model.includes('gemini') ? 'gemini' : undefined;
    const formatTemplate = templateManager.getFormatTemplate(
      format as 'json' | 'yaml',
      'world-building-list-generic', // 汎用テンプレートを使用
      modelSpecific,
    );

    // ユーザープロンプトを構築（ユーザーの意図を優先し、フォーマット指示を後に配置）
    // ユーザーメッセージがない場合のみデフォルトのプロンプトを使用
    const enhancedUserMessage =
      userMessage ||
      `現在の物語設定から、適切な世界観構築設定を行うための要素リストを生成してください。`;

    // ユーザーメッセージを最初に配置し、フォーマット指示を後に追加
    const userPrompt = `${enhancedUserMessage}\n\n以下のフォーマットで回答してください:\n${formatTemplate}`;

    // AIリクエストを作成
    const aiRequest: StandardAIRequest = {
      requestType: 'worldbuilding-list',
      model: model || determineModelByElementType(validatedElementType),
      systemPrompt: WORLD_BUILDER,
      userPrompt,
      context: {
        elementType: validatedElementType,
      },
      options: {
        temperature: 0.7,
        maxTokens: 2000,
        expectedFormat: format === 'json' ? 'json' : 'yaml',
        responseFormat: format === 'json' ? 'json' : 'yaml',
      },
    };

    // AIリクエストを実行
    console.log(
      `[API] AIリクエスト実行: ${aiRequest.requestType}, フォーマット: ${format}, モデル: ${aiRequest.model}`,
    );
    const aiResponse = await processAIRequest(aiRequest);

    // 詳細なデバッグ情報
    console.log(`[API] AIレスポンスステータス: ${aiResponse.status}`);

    // レスポンスがnullかどうか確認
    if (!aiResponse.content) {
      console.warn(`[API] 警告：レスポンスコンテンツがnullまたは空です`);
      console.log(
        `[API] 生のレスポンス内容: ${aiResponse.rawContent || '<空>'}`,
      );
    }

    // エラー処理
    if (aiResponse.status === 'error') {
      // レスポンスのエラーコードとリクエスト内容をコンソールに出力
      console.error('[API] AIリクエスト失敗:', {
        errorCode: aiResponse.error?.code,
        errorMessage: aiResponse.error?.message,
        request: JSON.stringify(aiRequest, null, 2),
      });

      return res.status(500).json({
        status: 'error',
        message: aiResponse.error?.message || 'AI処理中にエラーが発生しました',
        error: aiResponse.error,
      });
    }

    // 成功の場合でも、コンテンツがない場合はダミーデータを提供
    if (!aiResponse.content && format === 'json') {
      console.warn(
        '[API] 警告：AIから有効なレスポンスが得られませんでした。ダミーデータを返します',
      );

      // 要素タイプに応じたダミーデータ - フロントエンドの期待する形式 (name, type) に合わせる
      const dummyData =
        validatedElementType === 'places' || validatedElementType === '場所'
          ? [
              {
                name: '魔法の森',
                type: 'place',
              },
              {
                name: '古代都市エレミア',
                type: 'place',
              },
            ]
          : validatedElementType === 'cultures' ||
              validatedElementType === '文化'
            ? [
                {
                  name: '空翔ける民',
                  type: 'culture',
                },
                {
                  name: '深緑の守護者',
                  type: 'culture',
                },
              ]
            : [
                {
                  name: '魔法使いの制約',
                  type: 'rule',
                },
                {
                  name: '王国の継承法',
                  type: 'rule',
                },
              ];

      // ダミーデータを返す
      return res.json({
        status: 'success',
        data: dummyData,
        rawContent: JSON.stringify(dummyData),
        metadata: {
          model: aiResponse.debug?.model || 'fallback',
          processingTime: aiResponse.debug?.processingTime || 0,
          requestType: aiRequest.requestType,
          format: format,
          isDummyData: true, // これがダミーデータであることを示すフラグ
        },
      });
    }

    // 通常の成功レスポンス
    console.log(
      `[API] 成功レスポンス送信: データ型=${typeof aiResponse.content}, 生データ長=${aiResponse.rawContent?.length || 0}`,
    );

    return res.json({
      status: 'success',
      data: aiResponse.content,
      rawContent: aiResponse.rawContent,
      metadata: {
        model: aiResponse.debug?.model,
        processingTime: aiResponse.debug?.processingTime,
        requestType: aiRequest.requestType,
        format: format,
      },
    });
  } catch (error: any) {
    console.error('[API] ルートハンドラでのエラー:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || '処理中に予期しないエラーが発生しました',
    });
  }
});

/**
 * キャラクター詳細生成エンドポイント
 * 小説のキャラクターの詳細情報を生成します
 */
router.post('/character-detail-generation', async (req, res) => {
  try {
    const { characterName, characterRole, userMessage, model } = req.body;
    const format = req.body.format || 'yaml'; // デフォルトをYAMLに変更

    console.log(
      `[API] キャラクター詳細生成リクエスト: ${characterName} (${characterRole})`,
    );

    // ユーザープロンプトを構築
    const userPrompt = templateManager.buildCharacterUserPrompt(
      characterName,
      characterRole || '主要キャラクター',
      userMessage || '',
      format as 'json' | 'yaml',
    );

    // AIリクエストを作成
    const aiRequest: StandardAIRequest = {
      requestType: 'character-detail',
      model: model || 'gpt-4o',
      systemPrompt: templateManager.buildCharacterSystemPrompt(
        characterName,
        characterRole || '主要キャラクター',
      ),
      userPrompt,
      context: {
        characterName,
        characterRole,
      },
      options: {
        temperature: 0.7,
        maxTokens: 2000,
        expectedFormat: format === 'json' ? 'json' : 'yaml',
        responseFormat: format === 'json' ? 'json' : 'yaml',
      },
    };

    // AIリクエストを実行
    console.log(`[API] AIリクエスト実行: ${aiRequest.requestType}`);
    const aiResponse = await processAIRequest(aiRequest);

    // エラー処理
    if (aiResponse.status === 'error') {
      // レスポンスのエラーコードとリクエスト内容をコンソールに出力
      console.error('[API] AIリクエスト失敗:', {
        errorCode: aiResponse.error?.code,
        errorMessage: aiResponse.error?.message,
        request: JSON.stringify(aiRequest, null, 2),
      });

      return res.status(500).json({
        status: 'error',
        message: aiResponse.error?.message || 'AI処理中にエラーが発生しました',
        error: aiResponse.error,
      });
    }

    // 成功レスポンス
    return res.json({
      status: 'success',
      data: aiResponse.content,
      rawContent: aiResponse.rawContent,
      metadata: {
        model: aiResponse.debug?.model,
        processingTime: aiResponse.debug?.processingTime,
        requestType: aiRequest.requestType,
        format: format,
      },
    });
  } catch (error: any) {
    console.error('[API] ルートハンドラでのエラー:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || '処理中に予期しないエラーが発生しました',
    });
  }
});

/**
 * プロット開発エンドポイント
 * 物語のプロット作成や改善に関するアドバイスを提供します
 */
router.post('/plot-development', async (req, res) => {
  try {
    const { userMessage, model } = req.body;
    const format = req.body.format || 'text'; // プロットはテキストがデフォルト

    console.log('[API] プロット開発リクエスト');

    // AIリクエストを作成
    const aiRequest: StandardAIRequest = {
      requestType: 'plot-development',
      model: model || 'gpt-4o',
      systemPrompt: PLOT_DEVELOPER,
      userPrompt: userMessage,
      options: {
        temperature: 0.7,
        maxTokens: 2000,
        expectedFormat:
          format === 'text' ? 'text' : format === 'json' ? 'json' : 'yaml',
        responseFormat:
          format === 'text' ? 'text' : format === 'json' ? 'json' : 'yaml',
      },
    };

    // AIリクエストを実行
    console.log(`[API] AIリクエスト実行: ${aiRequest.requestType}`);
    const aiResponse = await processAIRequest(aiRequest);

    // エラー処理
    if (aiResponse.status === 'error') {
      // レスポンスのエラーコードとリクエスト内容をコンソールに出力
      console.error('[API] AIリクエスト失敗:', {
        errorCode: aiResponse.error?.code,
        errorMessage: aiResponse.error?.message,
        request: JSON.stringify(aiRequest, null, 2),
      });

      return res.status(500).json({
        status: 'error',
        message: aiResponse.error?.message || 'AI処理中にエラーが発生しました',
        error: aiResponse.error,
      });
    }

    // 成功レスポンス
    return res.json({
      status: 'success',
      data: aiResponse.content,
      rawContent: aiResponse.rawContent,
      metadata: {
        model: aiResponse.debug?.model,
        processingTime: aiResponse.debug?.processingTime,
        requestType: aiRequest.requestType,
        format: format,
      },
    });
  } catch (error: any) {
    console.error('[API] ルートハンドラでのエラー:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || '処理中に予期しないエラーが発生しました',
    });
  }
});

/**
 * YAMLとJSONの変換エンドポイント
 * YAMLとJSON形式の相互変換を行います
 */
router.post('/format-conversion', async (req, res) => {
  try {
    const { data, fromFormat, toFormat } = req.body;

    if (!data || !fromFormat || !toFormat) {
      return res.status(400).json({
        status: 'error',
        message: '必要なパラメータが不足しています: data, fromFormat, toFormat',
      });
    }

    console.log(
      `[API] フォーマット変換リクエスト: ${fromFormat} -> ${toFormat}`,
    );

    let parsedData;
    let result;

    // ソース形式からパース
    try {
      if (fromFormat === 'json') {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } else if (fromFormat === 'yaml') {
        parsedData = typeof data === 'string' ? yaml.load(data) : data;
      } else {
        return res.status(400).json({
          status: 'error',
          message: `サポートされていないソース形式: ${fromFormat}`,
        });
      }
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: `${fromFormat}のパースに失敗しました: ${error.message}`,
      });
    }

    // 目標形式に変換
    try {
      if (toFormat === 'json') {
        result = JSON.stringify(parsedData, null, 2);
      } else if (toFormat === 'yaml') {
        result = yaml.dump(parsedData, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
        });
      } else {
        return res.status(400).json({
          status: 'error',
          message: `サポートされていない目標形式: ${toFormat}`,
        });
      }
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: `${toFormat}への変換に失敗しました: ${error.message}`,
      });
    }

    // 成功レスポンス
    return res.json({
      status: 'success',
      data: result,
      metadata: {
        fromFormat,
        toFormat,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[API] フォーマット変換エラー:', error);
    return res.status(500).json({
      status: 'error',
      message:
        error.message || 'フォーマット変換中に予期しないエラーが発生しました',
    });
  }
});

/**
 * 要素タイプに基づいて最適なモデルを決定する関数
 */
function determineModelByElementType(elementType: string): string {
  if (elementType === 'places' || elementType === '場所') {
    return 'gemini-1.5-pro'; // 場所には詳細な地理情報が必要なため、Geminiモデルを使用
  } else if (elementType === 'cultures' || elementType === '文化') {
    return 'gemini-1.5-pro'; // 文化には細かいニュアンスが必要
  } else {
    return 'gemini-1.5-pro'; // その他の場合も同様にGeminiを使用
  }
}

export default router;
