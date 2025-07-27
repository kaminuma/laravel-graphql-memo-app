import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
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
} from "@mui/material";
import { useRegisterUserMutation } from "../generated/graphql";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const [registerUser, { loading }] = useRegisterUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password || !passwordConfirmation) {
      setError("すべての項目を入力してください");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("パスワードが一致しません");
      return;
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    try {
      await registerUser({
        variables: {
          name: name.trim(),
          email: email.trim(),
          password,
          password_confirmation: passwordConfirmation,
        },
      });

      // 登録成功後はログイン画面に遷移（成功メッセージ付き）
      navigate("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "登録に失敗しました");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 2,
      }}
    >
      <Card
        elevation={8}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" fontWeight={900} color="primary">
            新規登録
          </Typography>

          <Typography color="text.secondary" textAlign="center">
            新しいアカウントを作成してTODOを管理しましょう
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Stack spacing={3}>
              <TextField
                label="お名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { fontWeight: 600 } }}
              />

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
                helperText="8文字以上で入力してください"
              />

              <TextField
                label="パスワード（確認）"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "登録"}
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  既にアカウントをお持ちの方は{" "}
                  <MuiLink component={Link} to="/login" color="primary">
                    ログイン
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

export default RegisterPage;
