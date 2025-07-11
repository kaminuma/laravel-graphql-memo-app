import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link, useLocation } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

const navItems = [
  { path: '/', label: 'ホーム', icon: <HomeIcon sx={{ fontSize: 20, mr: 0.5 }} /> },
  { path: '/todos', label: 'TODO', icon: <ListAltIcon sx={{ fontSize: 20, mr: 0.5 }} /> },
  { path: '/about', label: 'About', icon: <InfoIcon sx={{ fontSize: 20, mr: 0.5 }} /> },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <AppBar position="sticky" color="inherit" elevation={2} sx={{ mb: 2, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: { xs: 1, sm: 3 } }}>
        {/* Logo */}
        <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.3rem', sm: '1.7rem' },
              letterSpacing: '-1px',
              mr: 2,
            }}
          >
            ✨ TODO App
          </Typography>
        </Box>
        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              variant={location.pathname === item.path ? 'contained' : 'text'}
              color={location.pathname === item.path ? 'primary' : 'inherit'}
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 3,
                px: 2,
                background: location.pathname === item.path
                  ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
                  : 'transparent',
                color: location.pathname === item.path ? '#fff' : '#6366f1',
                boxShadow: location.pathname === item.path ? '0 2px 8px rgba(102, 126, 234, 0.10)' : 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.18)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 