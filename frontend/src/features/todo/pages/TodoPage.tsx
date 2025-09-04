import React, { useEffect } from 'react';
import { Container, Grid, Paper, Box, Typography, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TodoList from '../components/TodoList/TodoList';
import TodoForm from '../components/TodoForm/TodoForm';
import { useAuth } from '../../../hooks/AuthContext';

const TodoPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // 未認証時にログインページにリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 40%, #c7d2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          読み込み中...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 40%, #c7d2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          リダイレクト中...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 40%, #c7d2fe 100%)',
        py: { xs: 3, sm: 6 },
        fontFamily: 'Inter, "Noto Sans JP", sans-serif',
      }}
    >
      <Container maxWidth="lg" sx={{ minHeight: '90vh' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 4 }, maxWidth: 900, mx: 'auto' }}>
          <Paper elevation={6} sx={{ background: 'rgba(255,255,255,0.95)', borderRadius: 6, p: { xs: 2, sm: 4 }, mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a5b4fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900,
                letterSpacing: '-1px',
                fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                mb: 1,
              }}
            >
              ✨ TODO App
            </Typography>
            <Typography variant="h6" color="text.secondary">
              GraphQL + React + Laravel で作られた
              <br />
              <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
                モダンなTODOアプリケーション
              </Box>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              ようこそ、{user.name}さん！
            </Typography>
          </Paper>
        </Box>
        {/* Main Content */}
        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
          <Grid item xs={12} md={5}>
            <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 5, mb: 3, background: 'rgba(255,255,255,0.98)' }}>
              <TodoForm mode="create" />
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 5, mb: 3, background: 'rgba(255,255,255,0.98)' }}>
              <TodoList />
            </Paper>
          </Grid>
        </Grid>
        {/* Footer */}
        <Box textAlign="center" mt={6} mb={2}>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ using GraphQL, React & Laravel
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TodoPage;
