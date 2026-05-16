'use client';

/**
 * ThemeRegistry — MUI theme provider with dark/light mode support.
 * Uses Emotion cache for Next.js App Router SSR compatibility.
 */

import React, { useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectThemeMode } from '@/redux/selectors/uiSelectors';

interface ThemeRegistryProps {
  children: React.ReactNode;
}

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  const mode = useAppSelector(selectThemeMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1' },
                secondary: { main: '#f472b6', light: '#f9a8d4', dark: '#ec4899' },
                background: {
                  default: '#0f0f23',
                  paper: '#1a1a2e',
                },
                divider: 'rgba(255, 255, 255, 0.08)',
                text: {
                  primary: '#e2e8f0',
                  secondary: '#94a3b8',
                },
                success: { main: '#34d399' },
                warning: { main: '#fbbf24' },
                error: { main: '#f87171' },
                info: { main: '#60a5fa' },
              }
            : {
                primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
                secondary: { main: '#ec4899', light: '#f472b6', dark: '#db2777' },
                background: {
                  default: '#f8fafc',
                  paper: '#ffffff',
                },
                divider: 'rgba(0, 0, 0, 0.08)',
                text: {
                  primary: '#1e293b',
                  secondary: '#64748b',
                },
                success: { main: '#10b981' },
                warning: { main: '#f59e0b' },
                error: { main: '#ef4444' },
                info: { main: '#3b82f6' },
              }),
        },
        typography: {
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          h4: { fontWeight: 700, letterSpacing: '-0.02em' },
          h5: { fontWeight: 600, letterSpacing: '-0.01em' },
          subtitle2: { fontWeight: 600 },
          body2: { fontSize: '0.875rem' },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 8,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              autoComplete: 'off',
            },
          },
          MuiTooltip: {
            defaultProps: {
              arrow: true,
            },
            styleOverrides: {
              tooltip: {
                fontSize: '0.75rem',
                borderRadius: 6,
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600,
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
