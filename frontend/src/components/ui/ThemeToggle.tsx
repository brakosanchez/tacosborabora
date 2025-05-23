import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { LightMode, DarkMode, SettingsBrightness } from '@mui/icons-material';
import { useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  mode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
}

export default function ThemeToggle({ mode, onThemeChange }: ThemeToggleProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (selectedMode: ThemeMode) => {
    onThemeChange(selectedMode);
    handleClose();
  };

  // Determinar qué icono mostrar
  const getThemeIcon = () => {
    switch (mode) {
      case 'light':
        return <LightMode />;
      case 'dark':
        return <DarkMode />;
      default:
        return <SettingsBrightness />;
    }
  };

  return (
    <>
      <Tooltip title="Cambiar tema">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'theme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {getThemeIcon()}
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        id="theme-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={() => handleThemeSelect('light')}
          selected={mode === 'light'}
        >
          <LightMode sx={{ mr: 1 }} /> Claro
        </MenuItem>
        <MenuItem 
          onClick={() => handleThemeSelect('dark')}
          selected={mode === 'dark'}
        >
          <DarkMode sx={{ mr: 1 }} /> Oscuro
        </MenuItem>
        <MenuItem 
          onClick={() => handleThemeSelect('system')}
          selected={mode === 'system'}
        >
          <SettingsBrightness sx={{ mr: 1 }} /> Sistema
        </MenuItem>
      </Menu>
    </>
  );
}
