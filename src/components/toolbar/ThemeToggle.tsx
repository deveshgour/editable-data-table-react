'use client';

/**
 * ThemeToggle — dark/light mode toggle button.
 * Persists preference to localStorage.
 */

import React, { useCallback } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { toggleTheme } from '@/redux/actions/uiActions';
import { selectThemeMode } from '@/redux/selectors/uiSelectors';

function ThemeToggle() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);

  const handleToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return (
    <Tooltip title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`} arrow>
      <IconButton onClick={handleToggle} size="small" color="inherit">
        {themeMode === 'dark' ? (
          <LightModeIcon sx={{ fontSize: 20 }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: 20 }} />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default React.memo(ThemeToggle);
