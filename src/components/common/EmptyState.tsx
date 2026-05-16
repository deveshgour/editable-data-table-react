'use client';

/**
 * Empty state component displayed when no rows match the current filters.
 */

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

interface EmptyStateProps {
  onClearFilters?: () => void;
  hasFilters: boolean;
}

function EmptyState({ onClearFilters, hasFilters }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 10,
        px: 4,
        textAlign: 'center',
      }}
    >
      <SearchOffIcon
        sx={{
          fontSize: 80,
          color: 'text.disabled',
          mb: 3,
          opacity: 0.5,
        }}
      />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {hasFilters ? 'No matching records' : 'No data available'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {hasFilters
          ? 'Try adjusting your search terms or clearing the filters to see more results.'
          : 'There are no records to display at this time.'}
      </Typography>
      {hasFilters && onClearFilters && (
        <Button
          variant="outlined"
          onClick={onClearFilters}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Clear All Filters
        </Button>
      )}
    </Box>
  );
}

export default React.memo(EmptyState);
