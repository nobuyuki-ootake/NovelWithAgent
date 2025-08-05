import React from 'react';
import { Box, Button, Paper, Typography, Container } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from './AuthProvider';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            小説作成AI アシスタント
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            このアプリケーションは招待制です。<br />
            Googleアカウントでログインして、アクセス権限を確認してください。
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={login}
            sx={{ py: 1.5, px: 3 }}
          >
            Googleでログイン
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;