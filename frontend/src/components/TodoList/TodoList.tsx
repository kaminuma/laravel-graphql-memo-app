import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TODOS } from '../../services/queries';
import { DELETE_TODO } from '../../services/mutations';
import {
  Card,
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

const TodoList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_TODOS);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [deleteTodo, { loading: deleting }] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  if (loading) {
    return (
      <Box py={6} textAlign="center">
        <CircularProgress color="primary" size={48} />
        <Typography color="text.secondary" mt={2}>TODOを取得しています...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={6} textAlign="center">
        <Alert severity="error" sx={{ mb: 2 }}>エラーが発生しました: {error.message}</Alert>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>再試行</Button>
      </Box>
    );
  }

  const todos: Todo[] = data?.todos || [];

  return (
    <Box width="100%">
      <Stack spacing={3} alignItems="center" mb={4}>
        <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(67, 233, 123, 0.2)', mb: 1 }}>
          <ListAltIcon sx={{ color: '#fff', fontSize: 32 }} />
        </Box>
        <Typography variant="h5" fontWeight={900} sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Inter, "Noto Sans JP", sans-serif' }}>
          TODO一覧
        </Typography>
        <Chip label={`${todos.length}件のTODO`} color="primary" variant="outlined" sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.5px', background: '#eef2ff' }} />
      </Stack>
      {todos.length === 0 ? (
        <Box py={6} textAlign="center">
          <Typography variant="h6" color="text.secondary">まだTODOがありません</Typography>
          <Typography variant="body2" color="text.secondary">上記のフォームから新しいTODOを追加して、素晴らしいアイデアを形にしましょう</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {todos.map((todo) => (
            <Grid item xs={12} md={10} key={todo.id as string}>
              <Card elevation={4} sx={{ maxWidth: 700, mx: 'auto', p: 3, borderRadius: 4, background: todo.completed ? 'linear-gradient(90deg, #e0ffe8 0%, #f0fff4 100%)' : 'linear-gradient(90deg, #f1f5ff 0%, #e0e7ff 100%)', border: todo.completed ? '2px solid #43e97b' : '2px solid #a5b4fc', boxShadow: '0 8px 32px 0 rgba(102, 126, 234, 0.10)', position: 'relative', overflow: 'hidden' }}>
                <Stack spacing={1}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="h6" fontWeight={800} sx={{ color: todo.completed ? '#38a169' : '#3730a3', textDecoration: todo.completed ? 'line-through' : 'none', letterSpacing: '-0.5px' }}>{todo.title}</Typography>
                    <Chip
                      icon={todo.completed ? <CheckCircleIcon /> : <HourglassEmptyIcon />}
                      label={todo.completed ? '完了' : '進行中'}
                      color={todo.completed ? 'success' : 'warning'}
                      variant="filled"
                      sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.5px', px: 2 }}
                    />
                  </Box>
                  {todo.description && (
                    <Typography variant="body1" color={todo.completed ? 'green' : 'primary.dark'} fontWeight={500} mb={1}>{todo.description}</Typography>
                  )}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Box display="flex" gap={2} alignItems="center">
                      <Typography variant="caption" color="text.secondary">🆔 {todo.id}</Typography>
                      <Typography variant="caption" color="text.secondary">👤 ユーザー: {todo.user_id}</Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <Button size="small" variant="contained" color="primary" startIcon={<EditIcon />} sx={{ fontWeight: 700, borderRadius: 2, px: 2 }} onClick={() => navigate(`/todos/edit/${todo.id}`)}>
                        編集
                      </Button>
                      <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} sx={{ fontWeight: 700, borderRadius: 2, px: 2 }} onClick={() => { setSelectedId(todo.id); setOpen(true); }}>
                        削除
                      </Button>
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>本当に削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>このTODOを本当に削除してもよろしいですか？この操作は取り消せません。</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">キャンセル</Button>
          <Button onClick={async () => {
            if (selectedId) {
              await deleteTodo({ variables: { id: selectedId } });
              setOpen(false);
              setSelectedId(null);
            }
          }} color="error" variant="contained" disabled={deleting}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodoList; 