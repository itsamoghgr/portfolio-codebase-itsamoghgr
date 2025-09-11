'use client';

import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  useTheme as useMuiTheme,
  alpha
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = useMuiTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Resume', id: 'resume' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton 
              onClick={() => scrollToSection(item.id)}
              sx={{ 
                py: 2,
                mx: 2,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  textAlign: 'center',
                  '& .MuiListItemText-primary': {
                    fontWeight: 500,
                    fontSize: '15px',
                    fontFamily: 'Inter, sans-serif'
                  }
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{
          background: isDarkMode 
            ? 'rgba(10, 10, 10, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          color: theme.palette.text.primary,
          padding: { xs: '12px 0', md: '16px 0' },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1100,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
            : '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: { xs: '24px', sm: '28px' },
              margin: 0,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0078ff 0%, #64ffda 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease'
              }
            }}
            onClick={() => scrollToSection('home')}
          >
            AR.
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button 
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                sx={{ 
                  color: theme.palette.text.primary,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  textTransform: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {item.label}
              </Button>
            ))}
            
            <IconButton
              onClick={toggleTheme}
              sx={{
                ml: 2,
                color: theme.palette.text.primary,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: theme.palette.text.primary,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2)
                }
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                color: theme.palette.text.primary
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: theme.palette.background.paper,
            backdropFilter: 'blur(20px)',
            borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;