import React from 'react';
import { Container, Paper, Box, Stack, Typography, List, ListItem, Chip } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import ApiIcon from '@mui/icons-material/Api';
import ReactIcon from '@mui/icons-material/IntegrationInstructions';

const AboutPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', py: 4 }}>
      <Container maxWidth="md">
        <Stack spacing={4}>
          {/* Header */}
          <Paper elevation={6} sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', textAlign: 'center', borderRadius: 4, p: { xs: 2, sm: 4 } }}>
            <Typography variant="h3" fontWeight={900} sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
              📖 アプリケーションについて
            </Typography>
            <Typography variant="h6" color="text.secondary">
              モダンな技術スタックで構築されたTODOアプリケーション
            </Typography>
          </Paper>

          {/* Features */}
          <Paper elevation={3} sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', borderRadius: 4, p: { xs: 2, sm: 4 } }}>
            <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
              🚀 主な機能
            </Typography>
            <List>
              <ListItem>TODOの作成・編集・削除</ListItem>
              <ListItem>完了状態の管理</ListItem>
              <ListItem>リアルタイムでのデータ更新</ListItem>
              <ListItem>美しいモダンなUI/UX</ListItem>
              <ListItem>レスポンシブデザイン</ListItem>
            </List>
          </Paper>

          {/* Tech Stack */}
          <Paper elevation={3} sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', borderRadius: 4, p: { xs: 2, sm: 4 } }}>
            <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
              🛠️ 技術スタック
            </Typography>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <ReactIcon color="primary" />
                <Typography fontWeight={600}>Frontend</Typography>
                <Chip label="React 18" color="primary" variant="outlined" />
                <Chip label="TypeScript" color="primary" variant="outlined" />
                <Chip label="Material UI" color="primary" variant="outlined" />
                <Chip label="Apollo Client" color="primary" variant="outlined" />
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <ApiIcon color="secondary" />
                <Typography fontWeight={600}>API</Typography>
                <Chip label="GraphQL" color="secondary" variant="outlined" />
                <Chip label="Apollo Server" color="secondary" variant="outlined" />
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CodeIcon color="error" />
                <Typography fontWeight={600}>Backend</Typography>
                <Chip label="Laravel 12" color="error" variant="outlined" />
                <Chip label="PHP 8.2" color="error" variant="outlined" />
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <StorageIcon color="success" />
                <Typography fontWeight={600}>Database</Typography>
                <Chip label="MySQL 8.0" color="success" variant="outlined" />
              </Box>
            </Stack>
          </Paper>

          {/* Architecture */}
          <Paper elevation={3} sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', borderRadius: 4, p: { xs: 2, sm: 4 } }}>
            <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
              🏗️ アーキテクチャ
            </Typography>
            <List>
              <ListItem>
                <Typography fontWeight={600}>フロントエンド:</Typography>
                <Typography variant="body2" color="text.secondary">React + TypeScript + Material UI で美しいユーザーインターフェースを構築</Typography>
              </ListItem>
              <ListItem>
                <Typography fontWeight={600}>API:</Typography>
                <Typography variant="body2" color="text.secondary">GraphQL で効率的なデータ取得と更新を実現</Typography>
              </ListItem>
              <ListItem>
                <Typography fontWeight={600}>バックエンド:</Typography>
                <Typography variant="body2" color="text.secondary">Laravel で堅牢なビジネスロジックとデータベース操作を実装</Typography>
              </ListItem>
              <ListItem>
                <Typography fontWeight={600}>データベース:</Typography>
                <Typography variant="body2" color="text.secondary">MySQL でリレーショナルデータの永続化</Typography>
              </ListItem>
            </List>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default AboutPage;
