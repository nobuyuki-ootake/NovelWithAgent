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
      // ローカルストレージから認証情報を取得
      const storedUser = localStorage.getItem('user');
      const authToken = localStorage.getItem('authToken');
      
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