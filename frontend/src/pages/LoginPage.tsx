import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Card,
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { LOGIN_USER } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refetchUser } = useAuth();

  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  // URLパラメータで登録成功メッセージを表示
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('アカウントが正常に作成されました。ログインしてください。');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

      try {
    console.log('ログイン処理開始:', { email: email.trim() });
    
    const result = await loginUser({
      variables: {
        email: email.trim(),
        password,
      },
    });
    
    console.log('ログイン結果:', result);

    // 認証状態を更新
    console.log('認証状態更新開始');
    await refetchUser();
    console.log('認証状態更新完了');

    // 認証状態がセットされたら遷移
    console.log('TODOページに遷移');
    navigate('/todos');
  } catch (err: any) {
    console.error('ログインエラー:', err);
    setError(err.message || 'ログインに失敗しました');
  }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Card
        elevation={8}
        sx={{
          maxWidth: 400,
          width: '100%',
          p: 4,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" fontWeight={900} color="primary">
            ログイン
          </Typography>
          
          <Typography color="text.secondary" textAlign="center">
            アカウントにログインしてTODOを管理しましょう
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ width: '100%' }}>
              {successMessage}
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={3}>
              <TextField
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { fontWeight: 600 } }}
              />
              
              <TextField
                label="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { fontWeight: 600 } }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'ログイン'}
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  アカウントをお持ちでない方は{' '}
                  <MuiLink component={Link} to="/register" color="primary">
                    新規登録
                  </MuiLink>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

export default LoginPage; 