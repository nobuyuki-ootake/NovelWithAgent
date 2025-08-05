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
  if (!req.session.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      loginUrl: '/auth/google'
    });
  }
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  // 認証は必須ではないが、セッション情報があれば使用
  next();
}