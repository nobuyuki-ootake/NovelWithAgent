import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));
  
  // セッションクッキーを削除
  response.cookies.delete('auth-session');
  
  return response;
}