import { Router, Request, Response } from 'express';

const router = Router();

// 環境変数から設定を読み込み
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const API_BASE_URL = process.env.API_BASE_URL || 'https://novelwithagent-production.up.railway.app';
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',') || [];

// Google OAuth開始
router.get('/google', (req: Request, res: Response) => {
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

    // セッションに保存
    req.session.user = {
      email: user.email,
      name: user.name,
      picture: user.picture,
    };

    // フロントエンドにリダイレクト
    res.redirect(CLIENT_URL);
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
router.get('/me', (req: Request, res: Response) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;