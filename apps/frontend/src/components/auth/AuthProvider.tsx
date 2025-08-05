import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('AuthProvider: 認証状態を確認中...');
      
      // まずURLパラメータをチェック（リダイレクト直後の場合）
      if (window.location.pathname !== '/auth/callback') {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const email = params.get('email');
        const name = params.get('name');
        const picture = params.get('picture');

        if (token && email) {
          console.log('AuthProvider: URLパラメータから認証情報を取得');
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify({ 
            email: decodeURIComponent(email), 
            name: name ? decodeURIComponent(name) : '',
            picture: picture ? decodeURIComponent(picture) : ''
          }));
          setUser(JSON.parse(localStorage.getItem('user')!));
          // URLパラメータをクリア
          window.history.replaceState({}, document.title, window.location.pathname);
          setIsLoading(false);
          return;
        }
      }
      
      // ローカルストレージから認証情報を取得
      const storedUser = localStorage.getItem('user');
      const authToken = localStorage.getItem('authToken');
      
      console.log('AuthProvider: ストレージ確認', { storedUser: !!storedUser, authToken: !!authToken });
      
      if (storedUser && authToken) {
        // ストレージにユーザー情報があればそれを使用
        setUser(JSON.parse(storedUser));
        
        // トークンの有効性を確認
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          console.log('AuthProvider: トークンが無効、クリアします');
          // トークンが無効な場合はクリア
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('認証状態の確認に失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const logout = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        credentials: 'include',
      });
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      setUser(null);
    } catch (error) {
      console.error('ログアウトに失敗:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};