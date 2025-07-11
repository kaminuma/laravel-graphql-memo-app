import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import HomePage from './pages/HomePage';
import TodoPage from './pages/TodoPage';
import AboutPage from './pages/AboutPage';
import Navigation from './components/Navigation/Navigation';
import TodoEditPage from './pages/TodoEditPage';

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URL || 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
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
          <Router>
            <Navigation />
            <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', p: 0 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/todos" element={<TodoPage />} />
                <Route path="/todos/edit/:id" element={<TodoEditPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Container>
          </Router>
        </ApolloProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App; 