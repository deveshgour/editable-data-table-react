'use client';

/**
 * Toolbar — main toolbar containing search, filters, export, view controls,
 * theme toggle, column visibility, and row count display.
 */

import React, { useCallback, useRef } from 'react';
import { Box, Typography, Chip, IconButton, Tooltip, Divider } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  selectFilteredRowCount,
  selectTotalRowCount,
  selectHasUnsavedChanges,
} from '@/redux/selectors/tableSelectors';
import { selectHasActiveFilters } from '@/redux/selectors/filterSelectors';
import { toggleFilterPanel } from '@/redux/actions/uiActions';
import GlobalSearch from './GlobalSearch';
import ExportCSV from './ExportCSV';
import ThemeToggle from './ThemeToggle';
import ColumnVisibilityToggle from './ColumnVisibilityToggle';
import ViewModeToggle from './ViewModeToggle';
import BulkActions from './BulkActions';

interface ToolbarProps {
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onShowShortcuts: () => void;
}

function Toolbar({ searchInputRef, onShowShortcuts }: ToolbarProps) {
  const dispatch = useAppDispatch();
  const filteredCount = useAppSelector(selectFilteredRowCount);
  const totalCount = useAppSelector(selectTotalRowCount);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);
  const hasUnsavedChanges = useAppSelector(selectHasUnsavedChanges);

  const handleToggleFilterPanel = useCallback(() => {
    dispatch(toggleFilterPanel());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        mb: 2,
      }}
    >
      {/* Main toolbar row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <GlobalSearch inputRef={searchInputRef} />

        <Tooltip title="Column filters" arrow>
          <IconButton
            onClick={handleToggleFilterPanel}
            size="small"
            color={hasActiveFilters ? 'primary' : 'default'}
            sx={{
              border: '1px solid',
              borderColor: hasActiveFilters ? 'primary.main' : 'divider',
              borderRadius: 2,
            }}
          >
            <FilterListIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <ExportCSV />
        <ViewModeToggle />

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Bulk actions */}
        <BulkActions />

        {/* Status indicators */}
        {hasUnsavedChanges && (
          <Chip
            label="Unsaved changes"
            size="small"
            color="warning"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        )}

        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {filteredCount === totalCount
            ? `${totalCount.toLocaleString()} rows`
            : `${filteredCount.toLocaleString()} of ${totalCount.toLocaleString()} rows`}
        </Typography>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <ColumnVisibilityToggle />
        <ThemeToggle />

        <Tooltip title="Keyboard shortcuts" arrow>
          <IconButton size="small" onClick={onShowShortcuts} color="inherit">
            <KeyboardIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default React.memo(Toolbar);
