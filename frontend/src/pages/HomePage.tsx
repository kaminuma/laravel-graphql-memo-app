import React from 'react';
import { Container, Paper, Stack, Typography, Button, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      // ログイン済みの場合はTODOページへ
      navigate('/todos');
    } else {
      // 未ログインの場合はログインページへ
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            background: 'rgba(255, 255, 255, 0.97)',
            backdropFilter: 'blur(12px)',
            textAlign: 'center',
            borderRadius: 6,
            p: { xs: 3, sm: 5 },
          }}
        >
          <Stack spacing={4} alignItems="center">
            <Typography
              variant="h2"
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900,
                letterSpacing: '-1px',
                fontSize: { xs: '2.2rem', sm: '3.5rem' },
              }}
            >
              🚀 TODO App
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, fontWeight: 500 }}>
              GraphQL + React + Laravel で作られた
              <br />
              <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
                モダンなTODOアプリケーション
              </Box>
              <br />
              素晴らしいアイデアを形にしましょう
            </Typography>
            
            {!loading && (
              <Button
                size="large"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleGetStarted}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 4,
                  boxShadow: '0 2px 10px rgba(102, 126, 234, 0.10)',
                  letterSpacing: '0.5px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.18)',
                  },
                }}
              >
                {user ? 'TODOアプリを始める' : 'ログインして始める'}
              </Button>
            )}

            {!loading && !user && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                アカウントをお持ちでない方は{' '}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/register')}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      background: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  新規登録
                </Button>
                から始めましょう
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              Made with ❤️ using GraphQL, React & Laravel
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
