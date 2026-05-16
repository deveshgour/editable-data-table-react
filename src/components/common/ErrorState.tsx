'use client';

/**
 * Error state component — displayed when data loading fails.
 */

import React from 'react';
import { Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorStateProps {
  error: string | null;
  onRetry?: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'error.main',
        bgcolor: 'background.paper',
        maxWidth: 500,
        mx: 'auto',
        mt: 4,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Failed to Load Data
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {error || 'An unexpected error occurred while loading the data.'}
      </Typography>
      {onRetry && (
        <Button variant="contained" color="error" onClick={onRetry} size="large">
          Retry
        </Button>
      )}
    </Paper>
  );
}

export default React.memo(ErrorState);
