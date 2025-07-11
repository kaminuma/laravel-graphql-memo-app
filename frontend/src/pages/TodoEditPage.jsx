import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_TODOS } from '../services/queries';
import TodoForm from '../components/TodoForm/TodoForm';
import { Container, Paper, Box, Typography, CircularProgress, Alert } from '@mui/material';

const TodoEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_TODOS);

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
        <Alert severity="error" sx={{ mb: 2 }}>エラーが発生しました: {error.message}</Alert>
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
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'rgba(255,255,255,0.98)' }}>
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