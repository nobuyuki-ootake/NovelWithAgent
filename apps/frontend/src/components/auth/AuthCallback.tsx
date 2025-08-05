import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URLパラメータからトークンとユーザー情報を取得
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');
    const name = params.get('name');
    const picture = params.get('picture');

    if (token && email) {
      // ローカルストレージに保存
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({ email, name, picture }));
      
      // パラメータをクリアしてホームにリダイレクト
      navigate('/', { replace: true });
    } else {
      // エラーの場合もホームにリダイレクト
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
};

export default AuthCallback;