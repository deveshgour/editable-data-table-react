'use client';

/**
 * TableHeader — sticky header row with sort indicators and select-all checkbox.
 * Clicking a sortable column header toggles the sort (asc → desc → none).
 */

import React, { useCallback } from 'react';
import { Box, Checkbox, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { ColumnDefinition, SortDirection } from '@/types';

interface TableHeaderProps {
  columns: ColumnDefinition[];
  sortConfig: { field: string; direction: SortDirection }[];
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSort: (field: string) => void;
}

function TableHeader({
  columns,
  sortConfig,
  allSelected,
  someSelected,
  onToggleSelectAll,
  onToggleSort,
}: TableHeaderProps) {
  const getSortDirection = useCallback(
    (field: string): SortDirection | null => {
      const config = sortConfig.find((s) => s.field === field);
      return config ? config.direction : null;
    },
    [sortConfig]
  );

  const getSortIndex = useCallback(
    (field: string): number | null => {
      const index = sortConfig.findIndex((s) => s.field === field);
      return index >= 0 ? index + 1 : null;
    },
    [sortConfig]
  );

  const renderSortIcon = (field: string) => {
    const direction = getSortDirection(field);
    const index = getSortIndex(field);

    if (!direction) {
      return (
        <SwapVertIcon
          sx={{
            fontSize: 16,
            opacity: 0,
            transition: 'opacity 0.2s',
            '.header-cell:hover &': { opacity: 0.5 },
          }}
        />
      );
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
        {direction === 'asc' ? (
          <ArrowUpwardIcon sx={{ fontSize: 16, color: 'primary.main' }} />
        ) : (
          <ArrowDownwardIcon sx={{ fontSize: 16, color: 'primary.main' }} />
        )}
        {sortConfig.length > 1 && index && (
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.6rem',
              color: 'primary.main',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {index}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 56,
        borderBottom: '2px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        minWidth: 'fit-content',
      }}
    >
      {columns.map((col) => {
        if (col.type === 'selection') {
          return (
            <Box
              key={col.field}
              sx={{
                width: col.width,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Checkbox
                size="small"
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={onToggleSelectAll}
                sx={{ p: 0.5 }}
              />
            </Box>
          );
        }

        if (col.type === 'actions') {
          return (
            <Box
              key={col.field}
              sx={{
                width: col.width,
                flexShrink: 0,
                px: 1.5,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                {col.headerName}
              </Typography>
            </Box>
          );
        }

        return (
          <Box
            key={col.field}
            className="header-cell"
            onClick={col.sortable ? () => onToggleSort(col.field) : undefined}
            sx={{
              width: col.width,
              flexShrink: 0,
              px: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: col.sortable ? 'pointer' : 'default',
              userSelect: 'none',
              '&:hover': col.sortable
                ? { bgcolor: 'action.hover', borderRadius: 1 }
                : undefined,
              transition: 'background-color 0.15s ease',
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" noWrap>
              {col.headerName}
            </Typography>
            {col.sortable && renderSortIcon(col.field)}
          </Box>
        );
      })}
    </Box>
  );
}

export default React.memo(TableHeader);
