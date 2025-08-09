import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTodosQuery } from '../../../generated/graphql';
import TodoForm from '../components/TodoForm/TodoForm';
import {
  Container,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useAuth } from '../../../hooks/AuthContext';

const TodoEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { loading, error, data } = useGetTodosQuery();

  if (authLoading) {
    return (
      <Box py={8} textAlign="center">
        <CircularProgress size={48} color="primary" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background:
            'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 40%, #c7d2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 6,
            p: 4,
            maxWidth: 500,
            textAlign: 'center',
          }}
        >
          <Alert severity="info" sx={{ mb: 3 }}>
            TODOを編集するにはログインが必要です
          </Alert>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            ✨ TODO App
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                fontWeight: 600,
              }}
            >
              ログイン
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/register')}
              sx={{
                borderColor: '#6366f1',
                color: '#6366f1',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#818cf8',
                  backgroundColor: 'rgba(99, 102, 241, 0.04)',
                },
              }}
            >
              新規登録
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box py={8} textAlign="center">
        <CircularProgress size={48} color="primary" />
      </Box>
    );
  }
  if (error) {
    return (
      <Box py={8} textAlign="center">
        <Alert severity="error" sx={{ mb: 2 }}>
          エラーが発生しました: {error.message}
        </Alert>
      </Box>
    );
  }

  const todo = data?.todos?.find((t) => String(t.id) === String(id));
  if (!todo) {
    return (
      <Box py={8} textAlign="center">
        <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }} elevation={3}>
          <Typography>該当するTODOが見つかりません</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          background: 'rgba(255,255,255,0.98)',
        }}
      >
        <TodoForm
          mode="edit"
          initialValues={todo}
          onSuccess={() => navigate('/todos')}
          onCancel={() => navigate('/todos')}
        />
      </Paper>
    </Container>
  );
};

export default TodoEditPage;
