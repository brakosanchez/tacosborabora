'use client';

import { Box, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import Button from '@/components/ui/Button';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

interface NavbarProps {
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export default function Navbar({ currentTheme, onThemeChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Menú', href: '/menu' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Contacto', href: '/contacto' },
  ];

  const handleAuthClick = () => {
    window.location.href = '/login';
  };

  return (
    <AppBar position="sticky" sx={{
      background: 'transparent',
      backdropFilter: 'blur(8px)',
      boxShadow: 'none',
      borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
    }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <a href="/" style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Typography
            variant="h4"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.light',
              },
            }}
          >
            Tacos Bora Bora
          </Typography>
        </a>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {menuItems.map((item) => (
            <a key={item.label} href={item.href} style={{
              textDecoration: 'none',
              color: 'inherit'
            }}>
              <Button
                variant="text"
                color="inherit"
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'none',
                  },
                }}
              >
                {item.label}
              </Button>
            </a>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAuthClick}
            sx={{
              textTransform: 'uppercase',
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Iniciar sesión
          </Button>
        </Box>

        {/* Mobile Menu Toggle */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={() => setMobileMenuOpen(true)}
          sx={{ display: { xs: 'flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: 4,
            gap: 2,
            display: { xs: 'flex', md: 'none' },
          }}
        >
          <IconButton
            color="inherit"
            aria-label="close"
            onClick={() => setMobileMenuOpen(false)}
            sx={{ alignSelf: 'flex-end' }}
          >
            <CloseIcon />
          </IconButton>
          {menuItems.map((item) => (
            <a key={item.label} href={item.href} style={{
              textDecoration: 'none',
              color: 'inherit',
              width: '100%'
            }}>
              <Button
                variant="text"
                color="inherit"
                fullWidth
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {item.label}
              </Button>
            </a>
          ))}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAuthClick}
            sx={{
              textTransform: 'uppercase',
              fontWeight: 600,
              borderRadius: 2,
              mt: 2,
            }}
          >
            Iniciar sesión
          </Button>
        </Box>
      )}
    </AppBar>
  );
}
