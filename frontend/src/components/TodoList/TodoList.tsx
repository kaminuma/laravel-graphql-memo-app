import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TODOS } from '../../services/queries';
import { DELETE_TODO } from '../../services/mutations';
import { Todo, TodoFilters, TodoSortOptions, Priority } from '../../types/todo';
import {
  Card,
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

} from '@mui/material';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';



const TodoList: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  
  // Filter and sort state
  const [filters, setFilters] = React.useState<TodoFilters>({
    priority: null,
    deadlineStatus: null,
    completed: null,
  });
  const [sortOptions, setSortOptions] = React.useState<TodoSortOptions>({
    field: 'created_at',
    direction: 'desc',
  });

  const { loading, error, data } = useQuery(GET_TODOS, {
    variables: {
      completed: filters.completed,
      priority: filters.priority,
      deadline_status: filters.deadlineStatus,
      sort_by: sortOptions.field,
      sort_direction: sortOptions.direction,
    },
  });

  const [deleteTodo, { loading: deleting }] = useMutation(DELETE_TODO, {
    refetchQueries: [{ 
      query: GET_TODOS,
      variables: {
        completed: filters.completed,
        priority: filters.priority,
        deadline_status: filters.deadlineStatus,
        sort_by: sortOptions.field,
        sort_direction: sortOptions.direction,
      },
    }],
  });

  // Helper functions for visual indicators
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <PriorityHighIcon />;
      case 'medium': return <AccessTimeIcon />;
      case 'low': return <CheckCircleIcon />;
      default: return <AccessTimeIcon />;
    }
  };

  const getDeadlineStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return '#ef4444';
      case 'due_today': return '#f59e0b';
      case 'due_soon': return '#eab308';
      default: return '#6b7280';
    }
  };

  const getDeadlineStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <ErrorIcon />;
      case 'due_today': return <WarningIcon />;
      case 'due_soon': return <AccessTimeIcon />;
      default: return <AccessTimeIcon />; // Default icon instead of null
    }
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  // Calculate overdue count
  const overdueCount = todos.filter(todo => 
    todo.deadline_status === 'overdue' && !todo.completed
  ).length;

  return (
    <Box width="100%">
      <Stack spacing={3} alignItems="center" mb={4}>
        <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(67, 233, 123, 0.2)', mb: 1 }}>
          <ListAltIcon sx={{ color: '#fff', fontSize: 32 }} />
        </Box>
        <Typography variant="h5" fontWeight={900} sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Inter, "Noto Sans JP", sans-serif' }}>
          TODO一覧
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip label={`${todos.length}件のTODO`} color="primary" variant="outlined" sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.5px', background: '#eef2ff' }} />
          {/* Overdue notification badge */}
          {overdueCount > 0 && (
            <Badge badgeContent={overdueCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.9rem', fontWeight: 700 } }}>
              <Chip
                icon={<ErrorIcon />}
                label="期限切れ"
                color="error"
                variant="filled"
                sx={{ 
                  fontWeight: 700, 
                  fontSize: '1rem', 
                  letterSpacing: '0.5px',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                    '100%': { opacity: 1 }
                  }
                }}
                onClick={() => setFilters({ ...filters, deadlineStatus: 'overdue', completed: false })}
              />
            </Badge>
          )}
        </Box>
        
        {/* Filter and Sort Controls */}
        <Card sx={{ p: 3, width: '100%', maxWidth: 800, borderRadius: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
          <Typography variant="h6" fontWeight={700} mb={2} sx={{ color: '#6366f1' }}>
            フィルター・ソート
          </Typography>
          <Grid container spacing={2} alignItems="center">
            {/* Priority Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>優先度</InputLabel>
                <Select
                  value={filters.priority || ''}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value as Priority || null })}
                  label="優先度"
                >
                  <MenuItem value="">すべて</MenuItem>
                  <MenuItem value="high">高</MenuItem>
                  <MenuItem value="medium">中</MenuItem>
                  <MenuItem value="low">低</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Deadline Status Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>期限状況</InputLabel>
                <Select
                  value={filters.deadlineStatus || ''}
                  onChange={(e) => setFilters({ ...filters, deadlineStatus: e.target.value as any || null })}
                  label="期限状況"
                >
                  <MenuItem value="">すべて</MenuItem>
                  <MenuItem value="overdue">期限切れ</MenuItem>
                  <MenuItem value="due_today">今日期限</MenuItem>
                  <MenuItem value="due_this_week">今週期限</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Completion Status Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>完了状況</InputLabel>
                <Select
                  value={filters.completed === null || filters.completed === undefined ? '' : filters.completed.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters({ 
                      ...filters, 
                      completed: value === '' ? null : value === 'true' 
                    });
                  }}
                  label="完了状況"
                >
                  <MenuItem value="">すべて</MenuItem>
                  <MenuItem value="false">未完了</MenuItem>
                  <MenuItem value="true">完了</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Sort Options */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>並び順</InputLabel>
                <Select
                  value={`${sortOptions.field}_${sortOptions.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('_');
                    setSortOptions({ 
                      field: field as 'priority' | 'deadline' | 'created_at',
                      direction: direction as 'asc' | 'desc'
                    });
                  }}
                  label="並び順"
                >
                  <MenuItem value="created_at_desc">作成日時（新しい順）</MenuItem>
                  <MenuItem value="created_at_asc">作成日時（古い順）</MenuItem>
                  <MenuItem value="priority_desc">優先度（高い順）</MenuItem>
                  <MenuItem value="priority_asc">優先度（低い順）</MenuItem>
                  <MenuItem value="deadline_asc">期限（近い順）</MenuItem>
                  <MenuItem value="deadline_desc">期限（遠い順）</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Clear Filters Button */}
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => {
                setFilters({ priority: null, deadlineStatus: null, completed: null });
                setSortOptions({ field: 'created_at', direction: 'desc' });
              }}
              sx={{ fontWeight: 600 }}
            >
              フィルターをクリア
            </Button>
          </Box>
        </Card>
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
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6" fontWeight={800} sx={{ color: todo.completed ? '#38a169' : '#3730a3', textDecoration: todo.completed ? 'line-through' : 'none', letterSpacing: '-0.5px' }}>{todo.title}</Typography>
                      {/* Priority indicator */}
                      <Chip
                        icon={getPriorityIcon(todo.priority)}
                        label={todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(todo.priority),
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}
                      />
                      {/* Deadline status indicator */}
                      {todo.deadline_status !== 'normal' && getDeadlineStatusIcon(todo.deadline_status) && (
                        <Chip
                          icon={getDeadlineStatusIcon(todo.deadline_status)}
                          label={
                            todo.deadline_status === 'overdue' ? '期限切れ' :
                            todo.deadline_status === 'due_today' ? '今日期限' :
                            todo.deadline_status === 'due_soon' ? '期限間近' : ''
                          }
                          size="small"
                          sx={{
                            backgroundColor: getDeadlineStatusColor(todo.deadline_status),
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                    </Box>
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
                  {/* Deadline display */}
                  {todo.deadline && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: getDeadlineStatusColor(todo.deadline_status) }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: getDeadlineStatusColor(todo.deadline_status),
                          fontWeight: 600
                        }}
                      >
                        期限: {formatDeadline(todo.deadline)}
                      </Typography>
                    </Box>
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