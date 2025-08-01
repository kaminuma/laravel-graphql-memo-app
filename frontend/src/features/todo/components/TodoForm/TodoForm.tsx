import React, { useState, FormEvent, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useGetCategoriesQuery,
  GetTodosDocument,
  Priority,
  Todo,
  GetTodosQuery,
} from "../../../../generated/graphql";
import { useAuth } from "../../../../shared/contexts/AuthContext";
import {
  CreateTodoMutation,
  CreateTodoMutationVariables,
  GetCategoriesQuery,
  InputMaybe,
  UpdateTodoMutation,
  UpdateTodoMutationVariables,
} from "../../../../generated/graphql";
import {
  Card,
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Checkbox,
  CircularProgress,
  Alert,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

type TodoFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<Todo>;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const TodoForm: React.FC<TodoFormProps> = ({
  mode,
  initialValues,
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState<string>(initialValues?.title || "");
  const [description, setDescription] = useState<string>(
    initialValues?.description || ""
  );
  const [completed, setCompleted] = useState<boolean>(
    initialValues?.completed ?? false
  );
  const [deadline, setDeadline] = useState<string>(
    initialValues?.deadline || ""
  );
  const [priority, setPriority] = useState<Priority>(
    initialValues?.priority || Priority.Medium
  );
  const [categoryId, setCategoryId] = useState<string>(
    initialValues?.category_id?.toString() || ""
  );
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch categories
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const [createTodo, { loading: creating }] = useCreateTodoMutation({
    update(cache, { data }) {
      const newTodo = data?.createTodo;
      if (newTodo) {
        // Read the current list of todos from the cache for the default query
        const existingTodosData = cache.readQuery<GetTodosQuery>({
          query: GetTodosDocument,
          variables: {
            completed: null,
            priority: null,
            deadline_status: null,
            sort_by: "created_at",
            sort_direction: "desc",
            category_id: null,
          },
        });

        if (existingTodosData && existingTodosData.todos) {
          // Write the updated list back to the cache
          cache.writeQuery<GetTodosQuery>({
            query: GetTodosDocument,
            variables: {
              completed: null,
              priority: null,
              deadline_status: null,
              sort_by: "created_at",
              sort_direction: "desc",
              category_id: null,
            },
            data: {
              todos: [newTodo, ...existingTodosData.todos],
            },
          });
        }
      }
    },
  });
  const [updateTodo, { loading: updating }] = useUpdateTodoMutation({
    refetchQueries: [{ query: GetTodosDocument }],
  });

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      setTitle(initialValues.title || "");
      setDescription(initialValues.description || "");
      setCompleted(initialValues.completed ?? false);
      setDeadline(initialValues.deadline || "");
      setPriority(initialValues.priority || Priority.Medium);
      setCategoryId(initialValues.category_id?.toString() || "");
    }
  }, [mode, initialValues]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
    try {
      if (mode === "create") {
        if (!user) {
          setError("ログインが必要です");
          return;
        }
        await createTodo({
          variables: {
            title: title.trim(),
            description: description.trim(),
            user_id: user.id.toString(),
            deadline: deadline || null,
            priority: toPriorityEnum(priority),
            category_id: categoryId || null,
          },
        });
        setTitle("");
        setDescription("");
        setDeadline("");
        setPriority(Priority.Medium);
        setCategoryId("");
      } else if (mode === "edit" && initialValues?.id) {
        await updateTodo({
          variables: {
            id: initialValues.id,
            title: title.trim(),
            description: description.trim(),
            completed,
            deadline: deadline || null,
            priority: toPriorityEnum(priority),
            category_id: categoryId || null,
          },
        });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("TODOの登録/更新に失敗しました");
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: { xs: 2, sm: 4 },
        borderRadius: 4,
        background: "linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
            mb: 1,
          }}
        >
          {mode === "create" ? (
            <AddIcon sx={{ color: "#fff", fontSize: 28 }} />
          ) : (
            <EditIcon sx={{ color: "#fff", fontSize: 28 }} />
          )}
        </Box>
        <Typography
          variant="h5"
          fontWeight={900}
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          {mode === "create" ? "新しいTODOを追加" : "TODOを編集"}
        </Typography>
        <Typography color="text.secondary" fontWeight={500} mb={1}>
          {mode === "create"
            ? "素晴らしいアイデアを形にしましょう"
            : "TODOの内容を編集できます"}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Stack spacing={2}>
            <TextField
              label="タイトル"
              placeholder="例: 買い物に行く"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              required
              fullWidth
              size="medium"
              variant="outlined"
              InputLabelProps={{ style: { fontWeight: 700, color: "#6366f1" } }}
            />
            <TextField
              label="説明"
              placeholder="例: 牛乳、パン、卵を買う"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              size="medium"
              variant="outlined"
              InputLabelProps={{ style: { fontWeight: 700, color: "#6366f1" } }}
            />
            <TextField
              label="期限"
              type="datetime-local"
              value={deadline}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDeadline(e.target.value)
              }
              fullWidth
              size="medium"
              variant="outlined"
              InputLabelProps={{
                style: { fontWeight: 700, color: "#6366f1" },
                shrink: true,
              }}
              helperText="期限を設定しない場合は空のままにしてください"
            />
            <FormControl fullWidth size="medium" variant="outlined">
              <InputLabel
                id="priority-label"
                style={{ fontWeight: 700, color: "#6366f1" }}
              >
                優先度
              </InputLabel>
              <Select
                labelId="priority-label"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                label="優先度"
              >
                <MenuItem value="high">高</MenuItem>
                <MenuItem value="medium">中</MenuItem>
                <MenuItem value="low">低</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="medium" variant="outlined">
              <InputLabel
                id="category-label"
                style={{ fontWeight: 700, color: "#6366f1" }}
              >
                カテゴリ（任意）
              </InputLabel>
              <Select
                labelId="category-label"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as string)}
                label="カテゴリ（任意）"
              >
                <MenuItem value="">なし</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {category.color != null && category.color !== "" && (
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
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
            {mode === "edit" && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={completed}
                    onChange={() => setCompleted(!completed)}
                    color="success"
                    sx={{ fontWeight: 700 }}
                    inputProps={{ "aria-label": "完了状態" }}
                  />
                }
                label={completed ? "未完了にする" : "完了にする"}
              />
            )}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-start"
              alignItems="center"
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={mode === "create" ? <AddIcon /> : <EditIcon />}
                disabled={creating || updating}
                sx={{
                  fontWeight: 800,
                  px: 4,
                  borderRadius: 3,
                  letterSpacing: "0.5px",
                }}
              >
                {creating || updating
                  ? mode === "create"
                    ? "登録中..."
                    : "更新中..."
                  : mode === "create"
                  ? "TODOを登録"
                  : "TODOを更新"}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={onCancel}
                  sx={{ fontWeight: 700, borderRadius: 3 }}
                >
                  キャンセル
                </Button>
              )}
              {(creating || updating) && (
                <CircularProgress size={28} color="primary" />
              )}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
};

export default TodoForm;

function toPriorityEnum(priority: string): InputMaybe<Priority> | undefined {
  switch (priority.toLowerCase()) {
    case "high":
      return Priority.High;
    case "medium":
      return Priority.Medium;
    case "low":
      return Priority.Low;
    default:
      return undefined; // or throw error
  }
}
