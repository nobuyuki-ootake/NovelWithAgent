import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 許可するメールアドレスのリスト
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',') || [];

export async function middleware(request: NextRequest) {
  // 認証不要のパス
  const publicPaths = ['/api/auth', '/_next', '/favicon.ico'];
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // セッションクッキーから認証情報を取得
  const session = request.cookies.get('auth-session');
  
  if (!session) {
    // 未認証の場合はGoogle認証へリダイレクト
    const signInUrl = new URL('/api/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  try {
    // セッションの検証（簡易版）
    const sessionData = JSON.parse(session.value);
    if (!ALLOWED_EMAILS.includes(sessionData.email)) {
      return new NextResponse('Unauthorized', { status: 403 });
    }
    
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};