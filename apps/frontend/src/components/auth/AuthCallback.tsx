import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthCallback コンポーネントが実行されました');
    console.log('Current URL:', window.location.href);
    
    // URLパラメータからトークンとユーザー情報を取得
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');
    const name = params.get('name');
    const picture = params.get('picture');

    console.log('取得したパラメータ:', { token, email, name, picture });

    if (token && email) {
      // ローカルストレージに保存
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({ 
        email: decodeURIComponent(email), 
        name: name ? decodeURIComponent(name) : '',
        picture: picture ? decodeURIComponent(picture) : ''
      }));
      
      console.log('認証情報をlocalStorageに保存しました');
      console.log('保存されたトークン:', localStorage.getItem('authToken'));
      console.log('保存されたユーザー:', localStorage.getItem('user'));
      
      // パラメータをクリアしてホームにリダイレクト
      navigate('/', { replace: true });
    } else {
      console.log('トークンまたはメールが不足しています');
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