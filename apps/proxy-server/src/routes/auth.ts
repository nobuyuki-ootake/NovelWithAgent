import { Router, Request, Response } from 'express';
import { registerToken } from '../middleware/auth.js';

const router = Router();

// 環境変数から設定を読み込み
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const API_BASE_URL = process.env.API_BASE_URL || 'https://novelwithagent-production.up.railway.app';
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',') || [];

// Google OAuth開始
router.get('/google', (req: Request, res: Response) => {
  console.log('OAuth start - Environment variables:');
  console.log('CLIENT_URL:', CLIENT_URL);
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    redirect_uri: `${API_BASE_URL}/auth/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  res.redirect(authUrl);
});

// Google OAuth コールバック
router.get('/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('認証コードが不足しています');
  }

  try {
    // トークンを取得
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${API_BASE_URL}/auth/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    // ユーザー情報を取得
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const user = await userResponse.json();

    // メールアドレスをチェック
    console.log('User email:', user.email);
    console.log('Allowed emails:', ALLOWED_EMAILS);
    console.log('Email check result:', ALLOWED_EMAILS.includes(user.email));
    
    if (!ALLOWED_EMAILS.includes(user.email)) {
      return res.status(403).send(`このメールアドレス「${user.email}」ではアクセスできません。許可されたメールアドレス: ${ALLOWED_EMAILS.join(', ')}`);
    }

    // ユーザー情報
    const userData = {
      email: user.email,
      name: user.name,
      picture: user.picture,
    };

    // セッションに保存
    req.session.user = userData;

    // トークンとしてセッションIDを使用
    const sessionToken = req.sessionID;
    
    // トークンマップに登録
    registerToken(sessionToken, userData);

    // フロントエンドにリダイレクト（トークンをクエリパラメータとして渡す）
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? CLIENT_URL 
      : 'http://localhost:3000';
    console.log('Redirecting to:', redirectUrl);
    res.redirect(`${redirectUrl}?token=${sessionToken}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&picture=${encodeURIComponent(user.picture)}`);
  } catch (error) {
    console.error('認証エラー:', error);
    res.status(500).send('認証エラーが発生しました');
  }
});

// ログアウト
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// 認証状態確認
router.get('/me', async (req: Request, res: Response) => {
  // セッション認証をチェック
  if (req.session.user) {
    return res.json(req.session.user);
  }

  // Bearerトークン認証をチェック
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // 'Bearer ' を除去
    
    // requireAuth関数と同じロジックを使用
    const { tokenUserMap } = await import('../middleware/auth.js');
    const userData = tokenUserMap.get(token);
    if (userData) {
      return res.json(userData);
    }
    
    // セッションIDとトークンが一致する場合
    if (token === req.sessionID && req.session.user) {
      return res.json(req.session.user);
    }
  }

  res.status(401).json({ error: 'Not authenticated' });
});

export default router;