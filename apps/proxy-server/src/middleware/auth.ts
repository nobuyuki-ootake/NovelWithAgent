import { Request, Response, NextFunction } from 'express';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      email: string;
      name: string;
      picture: string;
    };
  }
}

// 簡易的なトークン→ユーザー情報のマッピング（本番環境ではRedisやDBを使用推奨）
export const tokenUserMap = new Map<string, any>();

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log('Auth middleware called for:', req.path);
  console.log('Session user:', req.session.user);
  console.log('Authorization header:', req.headers.authorization);

  // セッション認証をチェック
  if (req.session.user) {
    console.log('Authenticated via session');
    return next();
  }

  // Bearerトークン認証をチェック
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // 'Bearer ' を除去
    console.log('Checking Bearer token:', token);
    
    // トークンマップからユーザー情報を取得
    const userData = tokenUserMap.get(token);
    if (userData) {
      console.log('User found for token:', userData);
      req.session.user = userData;
      return next();
    }
    
    // セッションIDとトークンが一致する場合（同じセッション）
    if (token === req.sessionID) {
      console.log('Token matches session ID');
      return next();
    }
  }

  // 認証情報がない場合
  console.log('No valid authentication found');
  return res.status(401).json({ 
    error: 'Authentication required',
    loginUrl: '/auth/google'
  });
}

// トークンとユーザー情報を登録する関数
export function registerToken(token: string, userData: any) {
  tokenUserMap.set(token, userData);
  // 7日後に自動削除
  setTimeout(() => {
    tokenUserMap.delete(token);
  }, 7 * 24 * 60 * 60 * 1000);
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  // 認証は必須ではないが、セッション情報があれば使用
  next();
}