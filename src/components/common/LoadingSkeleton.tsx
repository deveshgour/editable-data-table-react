'use client';

/**
 * Loading skeleton / shimmer UI for the data table.
 * Renders a realistic table placeholder during initial data loading.
 */

import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';

interface LoadingSkeletonProps {
  rowCount?: number;
  columnCount?: number;
}

function LoadingSkeleton({ rowCount = 10, columnCount = 8 }: LoadingSkeletonProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Toolbar skeleton */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Skeleton variant="rounded" width={250} height={40} animation="wave" />
        <Skeleton variant="rounded" width={120} height={40} animation="wave" />
        <Skeleton variant="rounded" width={120} height={40} animation="wave" />
        <Box sx={{ flex: 1 }} />
        <Skeleton variant="circular" width={40} height={40} animation="wave" />
        <Skeleton variant="circular" width={40} height={40} animation="wave" />
      </Box>

      {/* Header skeleton */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          p: 1.5,
          px: 2,
          bgcolor: 'action.hover',
        }}
      >
        {Array.from({ length: columnCount }).map((_, i) => (
          <Skeleton
            key={`header-${i}`}
            variant="text"
            width={i === 0 ? 40 : 80 + Math.random() * 80}
            height={24}
            animation="wave"
          />
        ))}
      </Box>

      {/* Row skeletons */}
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <Box
          key={`row-${rowIdx}`}
          sx={{
            display: 'flex',
            gap: 1,
            p: 1.5,
            px: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            opacity: 1 - rowIdx * 0.06,
          }}
        >
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            <Skeleton
              key={`cell-${rowIdx}-${colIdx}`}
              variant="text"
              width={colIdx === 0 ? 40 : 60 + Math.random() * 100}
              height={20}
              animation="wave"
            />
          ))}
        </Box>
      ))}
    </Paper>
  );
}

export default React.memo(LoadingSkeleton);
