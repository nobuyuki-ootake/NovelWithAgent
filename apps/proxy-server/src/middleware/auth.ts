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
    
    // Express-sessionのセッションストアを使用
    const sessionStore = req.app.locals.sessionStore || req.sessionStore;
    if (token && sessionStore) {
      sessionStore.get(token, (err: any, sessionData: any) => {
        if (err) {
          console.error('Session store error:', err);
          return res.status(401).json({ 
            error: 'Authentication required',
            loginUrl: '/auth/google'
          });
        }
        
        console.log('Session data found:', sessionData);
        if (sessionData && sessionData.user) {
          // セッションデータからユーザー情報を設定
          req.session.user = sessionData.user;
          console.log('Authenticated via Bearer token');
          return next();
        } else {
          console.log('Invalid or expired token');
          return res.status(401).json({ 
            error: 'Invalid token',
            loginUrl: '/auth/google'
          });
        }
      });
      return; // 非同期処理を待つ
    }
  }

  // 認証情報がない場合
  console.log('No valid authentication found');
  return res.status(401).json({ 
    error: 'Authentication required',
    loginUrl: '/auth/google'
  });
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  // 認証は必須ではないが、セッション情報があれば使用
  next();
}