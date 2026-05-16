'use client';

/**
 * DataTableContainer — the top-level orchestrator component.
 * Initializes data, coordinates all sub-components, and manages
 * the overall table layout and lifecycle.
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { setRows, setStatus, saveDraft } from '@/redux/actions/tableActions';
import { hideSnackbar, setTheme } from '@/redux/actions/uiActions';
import {
  selectTableStatus,
  selectTableError,
  selectFilteredRowCount,
  selectEditingRowIds,
  selectEditDrafts,
} from '@/redux/selectors/tableSelectors';
import { selectHasActiveFilters } from '@/redux/selectors/filterSelectors';
import { selectSnackbar, selectThemeMode, selectPaginationMode } from '@/redux/selectors/uiSelectors';
import { clearAllFilters } from '@/redux/actions/filterActions';
import { generateMockData, normalizeRows } from '@/utils/generateMockData';
import { exportSelectedToCSV } from '@/utils/csvExport';
import { selectFilteredAndSortedRowIds, selectRows } from '@/redux/selectors/tableSelectors';
import { validateRow } from '@/utils/validation';
import { showSnackbar } from '@/redux/actions/uiActions';
import Toolbar from '@/components/toolbar/Toolbar';
import ColumnFilterPanel from '@/components/filters/ColumnFilterPanel';
import VirtualizedTable from './VirtualizedTable';
import PaginatedTable from './PaginatedTable';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import UnsavedChangesGuard from '@/components/common/UnsavedChangesGuard';
import KeyboardShortcutsHelp from '@/components/common/KeyboardShortcutsHelp';

export default function DataTableContainer() {
  const dispatch = useAppDispatch();
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* Redux state */
  const status = useAppSelector(selectTableStatus);
  const error = useAppSelector(selectTableError);
  const filteredCount = useAppSelector(selectFilteredRowCount);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);
  const snackbar = useAppSelector(selectSnackbar);
  const themeMode = useAppSelector(selectThemeMode);
  const paginationMode = useAppSelector(selectPaginationMode);
  const editingRowIds = useAppSelector(selectEditingRowIds);
  const editDrafts = useAppSelector(selectEditDrafts);
  const filteredRowIds = useAppSelector(selectFilteredAndSortedRowIds);
  const rows = useAppSelector(selectRows);

  /* Local state */
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [tableHeight, setTableHeight] = useState(600);
  const [savedTheme, setSavedTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');

  /* Hydrate theme from localStorage */
  useEffect(() => {
    if (savedTheme !== themeMode) {
      dispatch(setTheme(savedTheme));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Persist theme changes */
  useEffect(() => {
    setSavedTheme(themeMode);
  }, [themeMode, setSavedTheme]);

  /* Initialize mock data on mount */
  useEffect(() => {
    dispatch(setStatus('loading'));

    /* Simulate async data loading */
    const timer = setTimeout(() => {
      const mockData = generateMockData(10000);
      const { byId, allIds } = normalizeRows(mockData);
      dispatch(setRows(byId, allIds));
    }, 800);

    return () => clearTimeout(timer);
  }, [dispatch]);

  /* Calculate table height based on viewport */
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight;
      setTableHeight(Math.max(400, vh - 280));
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  /* Keyboard shortcuts */
  const handleSaveAll = useCallback(() => {
    let savedCount = 0;
    for (const rowId of editingRowIds) {
      const draft = editDrafts[rowId];
      if (draft) {
        const validation = validateRow(draft);
        if (validation.isValid) {
          dispatch(saveDraft(rowId));
          savedCount++;
        }
      }
    }
    if (savedCount > 0) {
      dispatch(showSnackbar({ message: `Saved ${savedCount} row(s)`, severity: 'success' }));
    }
  }, [dispatch, editingRowIds, editDrafts]);

  const handleExport = useCallback(() => {
    if (filteredRowIds.length > 0) {
      exportSelectedToCSV(filteredRowIds, rows, `export-${new Date().toISOString().slice(0, 10)}.csv`);
      dispatch(showSnackbar({ message: `Exported ${filteredRowIds.length} rows`, severity: 'success' }));
    }
  }, [dispatch, filteredRowIds, rows]);

  const handleFocusSearch = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  useKeyboardShortcuts({
    onSaveAll: handleSaveAll,
    onSearch: handleFocusSearch,
    onExport: handleExport,
  });

  /* Handlers */
  const handleClearFilters = useCallback(() => {
    dispatch(clearAllFilters());
  }, [dispatch]);

  const handleCloseSnackbar = useCallback(() => {
    dispatch(hideSnackbar());
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(setStatus('loading'));
    setTimeout(() => {
      const mockData = generateMockData(10000);
      const { byId, allIds } = normalizeRows(mockData);
      dispatch(setRows(byId, allIds));
    }, 800);
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <UnsavedChangesGuard />

      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Toolbar */}
        <Toolbar
          searchInputRef={searchInputRef}
          onShowShortcuts={() => setShortcutsOpen(true)}
        />

        {/* Column filters */}
        <ColumnFilterPanel />

        {/* Main content */}
        {status === 'loading' && <LoadingSkeleton />}

        {status === 'error' && (
          <ErrorState error={error} onRetry={handleRetry} />
        )}

        {status === 'idle' && filteredCount === 0 && (
          <EmptyState hasFilters={hasActiveFilters} onClearFilters={handleClearFilters} />
        )}

        {status === 'idle' && filteredCount > 0 && (
          paginationMode ? (
            <PaginatedTable />
          ) : (
            <VirtualizedTable height={tableHeight} />
          )
        )}
      </Box>

      {/* Global snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Keyboard shortcuts dialog */}
      <KeyboardShortcutsHelp
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </ErrorBoundary>
  );
}
