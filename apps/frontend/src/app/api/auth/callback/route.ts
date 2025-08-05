import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/auth/callback';
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',') || [];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return new NextResponse('Missing authorization code', { status: 400 });
  }

  try {
    // トークンを取得
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
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
    if (!ALLOWED_EMAILS.includes(user.email)) {
      return new NextResponse('このメールアドレスではアクセスできません', { 
        status: 403,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    // セッションクッキーを設定
    const response = NextResponse.redirect(
      new URL(state ? Buffer.from(state, 'base64').toString() : '/', request.url)
    );

    response.cookies.set('auth-session', JSON.stringify({
      email: user.email,
      name: user.name,
      picture: user.picture,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
    });

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return new NextResponse('認証エラーが発生しました', { status: 500 });
  }
}