import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import HomePage from './pages/HomePage';
import TodoPage from './pages/TodoPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navigation from './components/Navigation/Navigation';
import TodoEditPage from './pages/TodoEditPage';
import { AuthProvider } from './contexts/AuthContext';

// 環境に応じてGraphQLエンドポイントを設定
const getGraphQLEndpoint = () => {
  // Cypressテスト環境の場合はlocalhostを使用
  if ((window as any).Cypress) {
    return 'http://localhost:8000/graphql';
  }
  // 通常の環境では環境変数またはデフォルト値を使用
  return process.env.REACT_APP_API_URL || 'http://localhost:8000/graphql';
};

const client = new ApolloClient({
  uri: getGraphQLEndpoint(),
  cache: new InMemoryCache(),
  credentials: 'include',
});

const theme = createTheme({
  palette: {
    primary: { main: '#6366f1' },
    secondary: { main: '#818cf8' },
    background: { default: '#f8fafc' },
  },
  typography: {
    fontFamily: 'Inter, "Noto Sans JP", sans-serif',
    fontWeightBold: 900,
  },
  shape: {
    borderRadius: 16,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <Router>
              <Navigation />
              <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', p: 0 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/todos" element={<TodoPage />} />
                  <Route path="/todos/edit/:id" element={<TodoEditPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Container>
            </Router>
          </AuthProvider>
        </ApolloProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App; 