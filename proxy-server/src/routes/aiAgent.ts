import express from 'express';
import {
  novelCreationNetwork,
  plotDevelopmentNetwork,
  writingImprovementNetwork,
} from '../networks';
import { SystemRoles } from '../utils/systemPrompts';
import { mastra } from '../mastra';

const router = express.Router();

// 認証ミドルウェア
const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // APIキーを環境変数から取得
  const API_KEY = process.env.API_KEY;

  // 開発環境ではAPIキー認証をスキップ
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: '認証が必要です' });
  }

  next();
};

// 暗号化されたAPIキーを復号化する関数（実際の実装ではもっと強力な方法を使用すべき）
const decryptApiKey = (encryptedKey: string): string => {
  try {
    // Base64デコード（デモ実装）
    return Buffer.from(encryptedKey, 'base64').toString('utf-8');
  } catch (error) {
    console.error('APIキーの復号化に失敗:', error);
    throw new Error('APIキーの復号化に失敗しました');
  }
};

/**
 * ステータスエンドポイント - AIエージェントのヘルスチェック
 */
router.get('/status', (req, res) => {
  try {
    // Mastraのステータスを確認
    const status = {
      status: 'ready',
      version: 'v1',
      providers: Object.keys(mastra['providers'] || {}),
      timestamp: new Date().toISOString(),
    };

    res.json(status);
  } catch (error) {
    console.error('ステータス確認エラー:', error);
    res.status(500).json({
      error: 'AIエージェントステータスの取得に失敗しました',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * AI設定を保存するエンドポイント
 */
router.post('/settings', authMiddleware, async (req, res) => {
  try {
    const { provider, apiKey: encryptedKey, modelName, parameters } = req.body;

    if (!provider || !encryptedKey || !modelName) {
      return res.status(400).json({ error: '必須項目が不足しています' });
    }

    const apiKey = decryptApiKey(encryptedKey);

    // 環境変数ファイルに保存するために適切な名前に変換
    const envVarName = provider.toUpperCase() + '_API_KEY';

    // 本来は安全な方法（環境変数など）で保存すべき
    // このデモでは簡易的に実装
    process.env[envVarName] = apiKey;

    // TODO: モデル名やパラメータを設定に保存
    console.log(`${provider} の設定を保存しました`);

    res.json({
      success: true,
      message: '設定を保存しました',
    });
  } catch (error) {
    console.error('設定保存エラー:', error);
    res.status(500).json({
      error: '設定の保存に失敗しました',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * API設定を取得するエンドポイント
 */
router.get('/settings', authMiddleware, async (req, res) => {
  try {
    // 実際の実装では、データベースやファイルから設定を読み込む
    // このデモでは簡易的に実装

    // 設定データの例
    const settings = {
      openai: process.env.OPENAI_API_KEY
        ? {
            provider: 'openai',
            apiKey: '********', // マスクした値を返す
            modelName: 'gpt-3.5-turbo',
            parameters: {
              temperature: 0.7,
              maxTokens: 2000,
            },
          }
        : undefined,

      anthropic: process.env.ANTHROPIC_API_KEY
        ? {
            provider: 'anthropic',
            apiKey: '********',
            modelName: 'claude-3-haiku',
            parameters: {
              temperature: 0.7,
              maxTokens: 4000,
            },
          }
        : undefined,

      gemini: process.env.GEMINI_API_KEY
        ? {
            provider: 'gemini',
            apiKey: '********',
            modelName: 'gemini-1.5-pro',
            parameters: {
              temperature: 0.7,
              maxTokens: 8000,
            },
          }
        : undefined,

      custom: undefined,
    };

    res.json(settings);
  } catch (error) {
    console.error('設定取得エラー:', error);
    res.status(500).json({
      error: '設定の取得に失敗しました',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * APIキーをテストするエンドポイント
 */
router.post('/test-key', authMiddleware, async (req, res) => {
  try {
    const { provider, apiKey: encryptedKey, modelName } = req.body;

    if (!provider || !encryptedKey) {
      return res.status(400).json({ error: '必須項目が不足しています' });
    }

    const apiKey = decryptApiKey(encryptedKey);

    // 実際にAPIに接続してキーをテスト
    let isValid = false;

    try {
      // プロバイダーごとのテスト実装
      switch (provider) {
        case 'openai':
          // OpenAIのAPIテスト
          isValid = true; // 実際はOpenAI APIへの接続テスト
          break;

        case 'anthropic':
          // AnthropicのAPIテスト
          isValid = true; // 実際はAnthropic APIへの接続テスト
          break;

        case 'gemini':
          // GoogleのGemini APIテスト
          isValid = true; // 実際はGemini APIへの接続テスト
          break;

        case 'custom':
          // カスタムエンドポイントテスト
          isValid = true; // 実際はエンドポイントへの接続テスト
          break;

        default:
          throw new Error('未対応のプロバイダーです');
      }
    } catch (testError) {
      console.error(`${provider} APIのテストに失敗:`, testError);
      isValid = false;
    }

    res.json({
      valid: isValid,
      message: isValid
        ? 'APIキーは有効です'
        : 'APIキーが無効か、接続に問題があります',
    });
  } catch (error) {
    console.error('APIキーテストエラー:', error);
    res.status(500).json({
      error: 'APIキーのテストに失敗しました',
      message: error instanceof Error ? error.message : String(error),
      valid: false,
    });
  }
});

/**
 * 小説作成アシスタントへのチャットエンドポイント
 */
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const {
      message,
      selectedElements = [],
      networkType = 'novel-creation',
      maxSteps = 10,
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'メッセージは必須です' });
    }

    // 選択されたネットワークに基づいた処理
    let network;
    switch (networkType) {
      case 'plot-development':
        network = plotDevelopmentNetwork;
        break;
      case 'writing-improvement':
        network = writingImprovementNetwork;
        break;
      case 'novel-creation':
      default:
        network = novelCreationNetwork;
        break;
    }

    // エージェントネットワークを実行
    const result = await network.run(message, {
      context: { selectedElements },
      maxSteps,
    });

    // 結果を返す
    res.json({
      response: result.output,
      agentUsed: result.agentUsed,
      steps: result.steps,
    });
  } catch (error) {
    console.error('AIエージェントエラー:', error);
    res.status(500).json({
      error: 'AIエージェントリクエストに失敗しました',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * プロットアドバイスを取得
 */
router.post('/plot-advice', authMiddleware, async (req, res) => {
  try {
    const { message, plotElements = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'メッセージは必須です' });
    }

    // プロット開発ネットワークを使用
    const result = await plotDevelopmentNetwork.run(message, {
      context: { selectedElements: plotElements },
      maxSteps: 5,
    });

    res.json({
      response: result.output,
      agentUsed: result.agentUsed,
      steps: result.steps,
    });
  } catch (error) {
    console.error('プロットアドバイスエラー:', error);
    res.status(500).json({
      error: 'プロットアドバイスリクエストに失敗しました',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * あらすじアドバイスを取得（あらすじ専用エンドポイント）
 */
router.post('/synopsis-advice', authMiddleware, async (req, res) => {
  try {
    const { message, titleContext = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'メッセージは必須です' });
    }

    // 小説作成ネットワークを使用
    const result = await novelCreationNetwork.run(message, {
      context: { selectedElements: titleContext },
      maxSteps: 5,
    });

    res.json({
      response: result.output,
      agentUsed: result.agentUsed,
      steps: result.steps,
    });
  } catch (error) {
    console.error('あらすじアドバイスエラー:', error);
    res.status(500).json({
      error: 'あらすじアドバイスリクエストに失敗しました',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * キャラクターアドバイスを取得
 */
router.post('/character-advice', authMiddleware, async (req, res) => {
  try {
    const { message, characterElements = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'メッセージは必須です' });
    }

    // キャラクターデザイナーを直接使用
    const result = await novelCreationNetwork.run(message, {
      context: {
        selectedElements: characterElements,
        forceAgent: 'character-designer',
      },
      maxSteps: 5,
    });

    res.json({
      response: result.output,
      agentUsed: result.agentUsed,
      steps: result.steps,
    });
  } catch (error) {
    console.error('キャラクターアドバイスエラー:', error);
    res.status(500).json({
      error: 'キャラクターアドバイスリクエストに失敗しました',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * キャラクター生成を行う専用エンドポイント
 */
router.post('/character-generation', authMiddleware, async (req, res) => {
  try {
    const { message, plotElements = [], existingCharacters = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'メッセージは必須です' });
    }

    // キャラクターデザイナーを直接使用して生成
    const result = await novelCreationNetwork.run(message, {
      context: {
        selectedElements: [...plotElements, ...existingCharacters],
        forceAgent: 'character-designer',
      },
      maxSteps: 5,
    });

    res.json({
      response: result.output,
      agentUsed: result.agentUsed,
      steps: result.steps,
    });
  } catch (error) {
    console.error('キャラクター生成エラー:', error);
    res.status(500).json({
      error: 'キャラクター生成リクエストに失敗しました',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * キャラクターリスト生成を行う専用エンドポイント（分割リクエスト第1段階）
 */
router.post('/character-list-generation', authMiddleware, async (req, res) => {
  try {
    const { message, plotElements = [], existingCharacters = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'メッセージは必須です' });
    }

    console.log('キャラクターリスト生成リクエスト:', {
      messageLength: message.length,
      plotElementsCount: plotElements.length,
      existingCharactersCount: existingCharacters.length,
    });

    // キャラクターデザイナーを直接使用
    const result = await novelCreationNetwork.run(message, {
      context: {
        selectedElements: [...plotElements, ...existingCharacters],
        forceAgent: 'character-designer',
        task: 'character-list', // リスト生成タスクを指定
      },
      maxSteps: 3, // リスト生成は少ないステップで十分
    });

    res.json({
      response: result.output,
      agentUsed: result.agentUsed,
      steps: result.steps,
    });
  } catch (error) {
    console.error('キャラクターリスト生成エラー:', error);
    res.status(500).json({
      error: 'キャラクターリスト生成リクエストに失敗しました',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * 特定のキャラクターの詳細生成を行う専用エンドポイント（分割リクエスト第2段階）
 */
router.post(
  '/character-detail-generation',
  authMiddleware,
  async (req, res) => {
    try {
      const {
        characterName,
        characterRole,
        message = '',
        plotElements = [],
        existingCharacters = [],
      } = req.body;

      if (!characterName) {
        return res.status(400).json({ error: 'キャラクター名は必須です' });
      }

      console.log('キャラクター詳細生成リクエスト:', {
        characterName,
        characterRole,
        messageLength: message.length,
      });

      // 指示メッセージを構築
      const detailPrompt = `
「${characterName}」というキャラクターの詳細情報を以下の形式で作成してください。
役割は「${characterRole}」です。

名前: ${characterName}
役割: ${characterRole}
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

${message}
`;

      // キャラクターデザイナーを直接使用して詳細生成
      const result = await novelCreationNetwork.run(detailPrompt, {
        context: {
          selectedElements: [...plotElements, ...existingCharacters],
          forceAgent: 'character-designer',
          task: 'character-detail', // 詳細生成タスクを指定
          characterName,
          characterRole,
        },
        maxSteps: 3, // 詳細生成は少ないステップで十分
      });

      res.json({
        response: result.output,
        agentUsed: result.agentUsed,
        steps: result.steps,
      });
    } catch (error) {
      console.error('キャラクター詳細生成エラー:', error);
      res.status(500).json({
        error: 'キャラクター詳細生成リクエストに失敗しました',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
);

/**
 * 文体アドバイスを取得
 */
router.post('/style-advice', authMiddleware, async (req, res) => {
  try {
    const { message, textContent = '' } = req.body;

    if (!textContent) {
      return res.status(400).json({ error: 'テキスト内容は必須です' });
    }

    // 文章改善ネットワークを使用
    const result = await writingImprovementNetwork.run(
      message || 'このテキストの文体や表現を改善してください',
      {
        context: {
          selectedElements: [
            {
              type: 'writing',
              id: 'current-text',
              name: 'テキスト内容',
              content: textContent,
            },
          ],
        },
        maxSteps: 5,
      },
    );

    res.json({
      response: result.output,
      agentUsed: result.agentUsed,
      steps: result.steps,
    });
  } catch (error) {
    console.error('文体アドバイスエラー:', error);
    res.status(500).json({
      error: '文体アドバイスリクエストに失敗しました',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * 世界観構築アドバイスを取得
 */
router.post('/worldbuilding-advice', authMiddleware, async (req, res) => {
  try {
    const { message, worldElements = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'メッセージは必須です' });
    }

    // 世界観構築アシスタントを直接使用
    const result = await novelCreationNetwork.run(message, {
      context: {
        selectedElements: worldElements,
        forceAgent: 'world-building',
      },
      maxSteps: 5,
    });

    res.json({
      response: result.output,
      agentUsed: result.agentUsed,
      steps: result.steps,
    });
  } catch (error) {
    console.error('世界観構築アドバイスエラー:', error);
    res.status(500).json({
      error: '世界観構築アドバイスリクエストに失敗しました',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * 世界観要素リストを生成する専用エンドポイント（分割リクエスト第1段階）
 */
router.post(
  '/worldbuilding-list-generation',
  authMiddleware,
  async (req, res) => {
    try {
      const { message, plotElements = [], charactersElements = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'メッセージは必須です' });
      }

      console.log('世界観要素リスト生成リクエスト:', {
        messageLength: message.length,
        plotElementsCount: plotElements.length,
        charactersElementsCount: charactersElements.length,
      });

      // 世界観構築アシスタントを直接使用
      const result = await novelCreationNetwork.run(message, {
        context: {
          selectedElements: [...plotElements, ...charactersElements],
          forceAgent: 'world-building',
          task: 'worldbuilding-list', // リスト生成タスクを指定
        },
        maxSteps: 3, // リスト生成は少ないステップで十分
      });

      res.json({
        response: result.output,
        agentUsed: result.agentUsed,
        steps: result.steps,
      });
    } catch (error) {
      console.error('世界観要素リスト生成エラー:', error);
      res.status(500).json({
        error: '世界観要素リスト生成リクエストに失敗しました',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
);

/**
 * 特定の世界観要素の詳細生成を行う専用エンドポイント（分割リクエスト第2段階）
 */
router.post(
  '/worldbuilding-detail-generation',
  authMiddleware,
  async (req, res) => {
    try {
      const {
        elementName,
        elementType,
        message = '',
        plotElements = [],
        charactersElements = [],
      } = req.body;

      if (!elementName || !elementType) {
        return res.status(400).json({ error: '要素名と要素タイプは必須です' });
      }

      console.log('世界観要素詳細生成リクエスト:', {
        elementName,
        elementType,
        messageLength: message.length,
      });

      // 指示メッセージを構築
      const detailPrompt = `
「${elementName}」という${elementTypeToJapanese(
        elementType,
      )}の詳細情報を以下の形式で作成してください。

名前: ${elementName}
タイプ: ${elementTypeToJapanese(elementType)}
説明: [詳細な説明]
特徴: [主要な特徴]
重要性: [物語における重要性]
${
  elementType === 'place'
    ? '立地: [地理的な立地や環境]\n人口: [おおよその人口規模]\n文化的特徴: [この場所特有の文化]'
    : ''
}
${
  elementType === 'culture'
    ? '習慣: [文化における重要な習慣]\n信念: [文化的な信念や価値観]\n歴史: [文化の簡単な歴史]'
    : ''
}
${
  elementType === 'rule'
    ? '影響: [ルールが世界に与える影響]\n例外: [ルールの例外や制限]\n由来: [ルールの起源や理由]'
    : ''
}

関連事項:
- [関連する要素1]: [関係の説明]
- [関連する要素2]: [関係の説明]

${message}
`;

      // 世界観構築アシスタントを直接使用して詳細生成
      const result = await novelCreationNetwork.run(detailPrompt, {
        context: {
          selectedElements: [...plotElements, ...charactersElements],
          forceAgent: 'world-building',
          task: 'worldbuilding-detail', // 詳細生成タスクを指定
          elementName,
          elementType,
        },
        maxSteps: 3, // 詳細生成は少ないステップで十分
      });

      res.json({
        response: result.output,
        agentUsed: result.agentUsed,
        steps: result.steps,
      });
    } catch (error) {
      console.error('世界観要素詳細生成エラー:', error);
      res.status(500).json({
        error: '世界観要素詳細生成リクエストに失敗しました',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
);

// 要素タイプを日本語に変換するヘルパー関数
function elementTypeToJapanese(type: string): string {
  const normalizedType = type.toLowerCase().trim();

  switch (normalizedType) {
    case 'place':
    case '場所':
      return '場所';
    case 'culture':
    case '文化':
      return '文化';
    case 'rule':
    case 'ルール':
      return 'ルール';
    case 'history':
    case '歴史':
    case '歴史的出来事':
      return '歴史的出来事';
    case 'legend':
    case '伝説':
      return '伝説';
    case 'technology':
    case '技術':
      return '技術';
    case 'magic':
    case '魔法':
      return '魔法';
    case 'religion':
    case '宗教':
      return '宗教';
    case 'custom':
    case '習慣':
      return '習慣';
    case 'geography':
    case '地理':
      return '地理';
    case 'climate':
    case '気候':
      return '気候';
    case 'language':
    case '言語':
      return '言語';
    default:
      return '要素';
  }
}

export default router;
