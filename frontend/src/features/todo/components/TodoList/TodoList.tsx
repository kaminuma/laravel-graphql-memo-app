import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  useGetTodosQuery,
  useGetCategoriesQuery,
  useDeleteTodoMutation,
  Category,
  Priority,
  Todo,
} from "../../../../generated/graphql";
import { TodoFilters, TodoSortOptions } from "../../../../shared/types/filters";
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
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
const TodoList: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // フィルターとソートの状態管理
  const [filters, setFilters] = React.useState<TodoFilters>({
    priority: null,
    deadlineStatus: null,
    completed: null,
    categoryId: null,
  });
  const [sortOptions, setSortOptions] = React.useState<TodoSortOptions>({
    field: "created_at",
    direction: "desc",
  });

  // Fetch categories
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  // TODO一覧をGraphQLから取得
  const { loading, error, data, refetch } = useGetTodosQuery({
    variables: {
      completed: filters.completed,
      priority: filters.priority
        ? (filters.priority.toUpperCase() as Priority)
        : null,
      deadline_status: filters.deadlineStatus,
      sort_by: sortOptions.field,
      sort_direction: sortOptions.direction,
      category_id: filters.categoryId,
    },
  });

  // TODO削除用のGraphQLミューテーション
  const [deleteTodo, { loading: deleting }] = useDeleteTodoMutation({
    refetchQueries: [
      {
        query: require("../../../../generated/graphql").GetTodosDocument,
        variables: {
          completed: filters.completed,
          priority: filters.priority
            ? (filters.priority.toUpperCase() as Priority)
            : null,
          deadline_status: filters.deadlineStatus,
          sort_by: sortOptions.field,
          sort_direction: sortOptions.direction,
          category_id: filters.categoryId,
        },
      },
    ],
  });

  // 優先度に応じた色を返す関数
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ef4444"; // 高
      case "medium":
        return "#f59e0b"; // 中
      case "low":
        return "#10b981"; // 低
      default:
        return "#6b7280"; // その他
    }
  };

  // 優先度に応じたアイコンを返す関数
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <PriorityHighIcon />; // 高
      case "medium":
        return <AccessTimeIcon />; // 中
      case "low":
        return <CheckCircleIcon />; // 低
      default:
        return <AccessTimeIcon />; // デフォルト
    }
  };

  // 期限状況に応じた色を返す関数
  const getDeadlineStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "#ef4444"; // 期限切れ
      case "due_today":
        return "#f59e0b"; // 今日期限
      case "due_soon":
        return "#eab308"; // 期限間近
      default:
        return "#6b7280"; // 通常
    }
  };

  // 期限状況に応じたアイコンを返す関数
  const getDeadlineStatusIcon = (status: string) => {
    switch (status) {
      case "overdue":
        return <ErrorIcon />; // 期限切れ
      case "due_today":
        return <WarningIcon />; // 今日期限
      case "due_soon":
        return <AccessTimeIcon />; // 期限間近
      default:
        return <AccessTimeIcon />; // デフォルト
    }
  };

  // 期限を日本語でフォーマットする関数
  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ローディング時の表示
  if (loading) {
    return (
      <Box py={6} textAlign="center">
        <CircularProgress color="primary" size={48} />
        <Typography color="text.secondary" mt={2}>
          TODOを取得しています...
        </Typography>
      </Box>
    );
  }

  // エラー時の表示
  if (error) {
    console.error("GraphQL Error:", error);
    return (
      <Box py={6} textAlign="center">
        <Alert severity="error" sx={{ mb: 2 }}>
          データの取得に失敗しました。
          {error.networkError
            ? "ネットワーク接続を確認してください。"
            : error.graphQLErrors?.length > 0
            ? "サーバーエラーが発生しました。"
            : "予期しないエラーが発生しました。"}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mr: 2 }}
        >
          再読み込み
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setFilters({
              priority: null,
              deadlineStatus: null,
              completed: null,
              categoryId: null,
            });
            setSortOptions({ field: "created_at", direction: "desc" });
          }}
        >
          フィルターをリセット
        </Button>
      </Box>
    );
  }

  // 取得したTODOリスト
  const todos: Todo[] = data?.todos || [];

  // 期限切れTODOの件数を計算
  const overdueCount = todos.filter(
    (todo) => todo.deadline_status === "overdue" && !todo.completed
  ).length;

  return (
    <Box width="100%">
      <Stack spacing={3} alignItems="center" mb={4}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(67, 233, 123, 0.2)",
            mb: 1,
          }}
        >
          <ListAltIcon sx={{ color: "#fff", fontSize: 32 }} />
        </Box>
        <Typography
          variant="h5"
          fontWeight={900}
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: 'Inter, "Noto Sans JP", sans-serif',
          }}
        >
          TODO一覧
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={`${todos.length}件のTODO`}
            color="primary"
            variant="outlined"
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: "0.5px",
              background: "#eef2ff",
            }}
          />
          {/* 期限切れ通知バッジ */}
          {overdueCount > 0 && (
            <Badge
              badgeContent={overdueCount}
              color="error"
              sx={{
                "& .MuiBadge-badge": { fontSize: "0.9rem", fontWeight: 700 },
              }}
            >
              <Chip
                icon={<ErrorIcon />}
                label="期限切れ"
                color="error"
                variant="filled"
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.5px",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.7 },
                    "100%": { opacity: 1 },
                  },
                }}
                onClick={() =>
                  setFilters({
                    ...filters,
                    deadlineStatus: "overdue",
                    completed: false,
                  })
                }
              />
            </Badge>
          )}
        </Box>
        {/* フィルター・ソートコントロール */}
        <Card
          sx={{
            p: 3,
            width: "100%",
            maxWidth: 800,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
            sx={{ color: "#6366f1" }}
          >
            フィルター・ソート
          </Typography>
          <Grid container spacing={2} alignItems="center">
            {/* 優先度フィルター */}
            <Grid item xs={12} sm={6} md={2.4}>
              <Typography
                fontWeight={700}
                color="#6366f1"
                mb={0.5}
                fontSize="0.95rem"
              >
                優先度
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.priority || ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    const parsePriority = (v: string): Priority | null => {
                      if (v === "") return null;
                      switch (v.toLowerCase()) {
                        case "high":
                          return Priority.High;
                        case "medium":
                          return Priority.Medium;
                        case "low":
                          return Priority.Low;
                        default:
                          throw new Error(`Unknown priority: ${v}`);
                      }
                    };

                    // 使用例
                    setFilters({ ...filters, priority: parsePriority(v) });
                  }}
                  displayEmpty
                >
                  <MenuItem value="">すべて</MenuItem>
                  <MenuItem value={Priority.High}>高</MenuItem>
                  <MenuItem value={Priority.Medium}>中</MenuItem>
                  <MenuItem value={Priority.Low}>低</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* カテゴリフィルター */}
            <Grid item xs={12} sm={6} md={2.4}>
              <Typography
                fontWeight={700}
                color="#6366f1"
                mb={0.5}
                fontSize="0.95rem"
              >
                カテゴリ
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.categoryId || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      categoryId: e.target.value || null,
                    })
                  }
                  displayEmpty
                >
                  <MenuItem value="">すべて</MenuItem>
                  {categories.map((category: Category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {category.color && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: category.color,
                            }}
                          />
                        )}
                        {category.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* 期限状況フィルター */}
            <Grid item xs={12} sm={6} md={2.4}>
              <Typography
                fontWeight={700}
                color="#6366f1"
                mb={0.5}
                fontSize="0.95rem"
              >
                期限状況
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.deadlineStatus || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      deadlineStatus: (e.target.value as any) || null,
                    })
                  }
                  displayEmpty
                >
                  <MenuItem value="">すべて</MenuItem>
                  <MenuItem value="overdue">期限切れ</MenuItem>
                  <MenuItem value="due_today">今日期限</MenuItem>
                  <MenuItem value="due_this_week">今週期限</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* 完了状況フィルター */}
            <Grid item xs={12} sm={6} md={2.4}>
              <Typography
                fontWeight={700}
                color="#6366f1"
                mb={0.5}
                fontSize="0.95rem"
              >
                完了状況
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={
                    filters.completed === null ||
                    filters.completed === undefined
                      ? ""
                      : filters.completed.toString()
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters({
                      ...filters,
                      completed: value === "" ? null : value === "true",
                    });
                  }}
                  displayEmpty
                >
                  <MenuItem value="">すべて</MenuItem>
                  <MenuItem value="false">未完了</MenuItem>
                  <MenuItem value="true">完了</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* 並び順セレクト */}
            <Grid item xs={12} sm={6} md={2.4}>
              <Typography
                fontWeight={700}
                color="#6366f1"
                mb={0.5}
                fontSize="0.95rem"
              >
                並び順
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={`${sortOptions.field}_${sortOptions.direction}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    const lastUnderscore = value.lastIndexOf("_");
                    const field = value.substring(0, lastUnderscore);
                    const direction = value.substring(lastUnderscore + 1);
                    setSortOptions({
                      field: field as "priority" | "deadline" | "created_at",
                      direction: direction as "asc" | "desc",
                    });
                  }}
                  displayEmpty
                >
                  <MenuItem value="created_at_desc">
                    作成日時（新しい順）
                  </MenuItem>
                  <MenuItem value="created_at_asc">作成日時（古い順）</MenuItem>
                  <MenuItem value="priority_desc">優先度（高い順）</MenuItem>
                  <MenuItem value="priority_asc">優先度（低い順）</MenuItem>
                  <MenuItem value="deadline_asc">期限（近い順）</MenuItem>
                  <MenuItem value="deadline_desc">期限（遠い順）</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {/* フィルタークリアボタン */}
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => {
                setFilters({
                  priority: null,
                  deadlineStatus: null,
                  completed: null,
                  categoryId: null,
                });
                setSortOptions({ field: "created_at", direction: "desc" });
              }}
              sx={{ fontWeight: 600 }}
            >
              フィルターをクリア
            </Button>
          </Box>
        </Card>
      </Stack>
      {/* TODOリスト表示部 */}
      {todos.length === 0 ? (
        <Box py={6} textAlign="center">
          <Typography variant="h6" color="text.secondary">
            まだTODOがありません
          </Typography>
          <Typography variant="body2" color="text.secondary">
            上記のフォームから新しいTODOを追加して、素晴らしいアイデアを形にしましょう
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {todos.map((todo) => (
            <Grid item xs={12} md={10} key={todo.id as string}>
              <Card
                elevation={4}
                sx={{
                  maxWidth: 700,
                  mx: "auto",
                  p: 3,
                  borderRadius: 4,
                  background: todo.completed
                    ? "linear-gradient(90deg, #e0ffe8 0%, #f0fff4 100%)"
                    : "linear-gradient(90deg, #f1f5ff 0%, #e0e7ff 100%)",
                  border: todo.completed
                    ? "2px solid #43e97b"
                    : "2px solid #a5b4fc",
                  boxShadow: "0 8px 32px 0 rgba(102, 126, 234, 0.10)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Stack spacing={1}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="h6"
                        fontWeight={800}
                        sx={{
                          color: todo.completed ? "#38a169" : "#3730a3",
                          textDecoration: todo.completed
                            ? "line-through"
                            : "none",
                          letterSpacing: "-0.5px",
                        }}
                      >
                        {todo.title}
                      </Typography>
                      {/* カテゴリインジケーター */}
                      {todo.category && (
                        <Chip
                          label={todo.category.name}
                          size="small"
                          sx={{
                            backgroundColor: todo.category.color || "#6b7280",
                            color: "white",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                          }}
                        />
                      )}
                      {/* 優先度インジケーター */}
                      <Chip
                        icon={getPriorityIcon(todo.priority)}
                        label={
                          todo.priority === Priority.High
                            ? "高"
                            : todo.priority === Priority.Medium
                            ? "中"
                            : "低"
                        }
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(todo.priority),
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                        }}
                      />
                      {/* 期限状況インジケーター */}
                      {todo.deadline_status !== "normal" &&
                        getDeadlineStatusIcon(todo.deadline_status) && (
                          <Chip
                            icon={getDeadlineStatusIcon(todo.deadline_status)}
                            label={
                              todo.deadline_status === "overdue"
                                ? "期限切れ"
                                : todo.deadline_status === "due_today"
                                ? "今日期限"
                                : todo.deadline_status === "due_soon"
                                ? "期限間近"
                                : ""
                            }
                            size="small"
                            sx={{
                              backgroundColor: getDeadlineStatusColor(
                                todo.deadline_status
                              ),
                              color: "white",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                            }}
                          />
                        )}
                    </Box>
                    <Chip
                      icon={
                        todo.completed ? (
                          <CheckCircleIcon />
                        ) : (
                          <HourglassEmptyIcon />
                        )
                      }
                      label={todo.completed ? "完了" : "進行中"}
                      color={todo.completed ? "success" : "warning"}
                      variant="filled"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        letterSpacing: "0.5px",
                        px: 2,
                      }}
                    />
                  </Box>
                  {todo.description && (
                    <Typography
                      variant="body1"
                      color={todo.completed ? "green" : "primary.dark"}
                      fontWeight={500}
                      mb={1}
                    >
                      {todo.description}
                    </Typography>
                  )}
                  {/* 期限表示 */}
                  {todo.deadline && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <AccessTimeIcon
                        sx={{
                          fontSize: 16,
                          color: getDeadlineStatusColor(todo.deadline_status),
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: getDeadlineStatusColor(todo.deadline_status),
                          fontWeight: 600,
                        }}
                      >
                        期限: {formatDeadline(todo.deadline)}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Box display="flex" gap={2} alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        🆔 {todo.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        👤 ユーザー: {todo.user_id}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        sx={{ fontWeight: 700, borderRadius: 2, px: 2 }}
                        onClick={() => navigate(`/todos/edit/${todo.id}`)}
                      >
                        編集
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{ fontWeight: 700, borderRadius: 2, px: 2 }}
                        onClick={() => {
                          setSelectedId(todo.id);
                          setOpen(true);
                        }}
                      >
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
      {/* 削除ダイアログ */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>本当に削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            このTODOを本当に削除してもよろしいですか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            キャンセル
          </Button>
          <Button
            onClick={async () => {
              if (selectedId) {
                await deleteTodo({ variables: { id: selectedId } });
                setOpen(false);
                setSelectedId(null);
              }
            }}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// デフォルトエクスポート
export default TodoList;
