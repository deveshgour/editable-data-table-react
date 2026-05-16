'use client';

/**
 * VirtualizedTable — renders the data table using react-window's FixedSizeList
 * for efficient rendering of 10,000+ rows.
 *
 * Only ~20 rows are rendered in the DOM at any time.
 * The itemData prop is memoized to avoid unnecessary re-renders.
 */

import React, { useMemo, useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Box, Paper } from '@mui/material';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  selectFilteredAndSortedRowIds,
  selectRows,
  selectEditDrafts,
  selectEditingRowIds,
  selectSelectedRowIds,
} from '@/redux/selectors/tableSelectors';
import { selectSortConfig } from '@/redux/selectors/filterSelectors';
import { selectVisibleColumns } from '@/redux/selectors/uiSelectors';
import {
  startEditing, cancelEditing, saveDraft,
  undoRow, updateDraft, toggleRowSelection,
  selectAllRows, deselectAllRows,
} from '@/redux/actions/tableActions';
import { toggleSortDirection } from '@/redux/actions/filterActions';
import { showSnackbar } from '@/redux/actions/uiActions';
import { validateRow } from '@/utils/validation';
import { ROW_HEIGHT, HEADER_HEIGHT } from '@/data/columns';
import { COLUMNS } from '@/data/columns';
import { TableRowData } from '@/types';
import TableHeader from './TableHeader';
import TableRowComponent from './TableRow';

interface VirtualizedTableProps {
  height: number;
}

export default function VirtualizedTable({ height }: VirtualizedTableProps) {
  const dispatch = useAppDispatch();
  const listRef = useRef<List>(null);

  /* Selectors */
  const filteredRowIds = useAppSelector(selectFilteredAndSortedRowIds);
  const rows = useAppSelector(selectRows);
  const editDrafts = useAppSelector(selectEditDrafts);
  const editingRowIds = useAppSelector(selectEditingRowIds);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const sortConfig = useAppSelector(selectSortConfig);
  const visibleColumns = useAppSelector(selectVisibleColumns);

  /* Handlers — memoized to preserve referential equality */
  const handleStartEditing = useCallback(
    (id: string) => dispatch(startEditing(id)),
    [dispatch]
  );

  const handleCancelEditing = useCallback(
    (id: string) => dispatch(cancelEditing(id)),
    [dispatch]
  );

  const handleSaveRow = useCallback(
    (id: string) => {
      const draft = editDrafts[id];
      if (!draft) return;

      const validation = validateRow(draft);
      if (!validation.isValid) {
        const errorMessages = validation.errors.map((e) => e.message).join(', ');
        dispatch(showSnackbar({ message: `Validation failed: ${errorMessages}`, severity: 'error' }));
        return;
      }

      dispatch(saveDraft(id));
      dispatch(showSnackbar({ message: 'Row saved successfully', severity: 'success' }));
    },
    [dispatch, editDrafts]
  );

  const handleUndoRow = useCallback(
    (id: string) => {
      dispatch(undoRow(id));
      dispatch(showSnackbar({ message: 'Changes reverted', severity: 'info' }));
    },
    [dispatch]
  );

  const handleUpdateDraft = useCallback(
    (id: string, field: string, value: string | number) => {
      dispatch(updateDraft(id, field, value));
    },
    [dispatch]
  );

  const handleToggleSelection = useCallback(
    (id: string) => dispatch(toggleRowSelection(id)),
    [dispatch]
  );

  const handleToggleSelectAll = useCallback(() => {
    const allSelected = filteredRowIds.length > 0 &&
      filteredRowIds.every((id) => selectedRowIds.includes(id));

    if (allSelected) {
      dispatch(deselectAllRows());
    } else {
      dispatch(selectAllRows(filteredRowIds));
    }
  }, [dispatch, filteredRowIds, selectedRowIds]);

  const handleToggleSort = useCallback(
    (field: string) => dispatch(toggleSortDirection(field)),
    [dispatch]
  );

  /* Memoized itemData for react-window */
  const itemData: TableRowData = useMemo(
    () => ({
      rowIds: filteredRowIds,
      rows,
      editDrafts,
      editingRowIds,
      selectedRowIds,
      columns: COLUMNS,
      visibleColumns,
      onStartEditing: handleStartEditing,
      onCancelEditing: handleCancelEditing,
      onSaveRow: handleSaveRow,
      onUndoRow: handleUndoRow,
      onUpdateDraft: handleUpdateDraft,
      onToggleSelection: handleToggleSelection,
    }),
    [
      filteredRowIds, rows, editDrafts, editingRowIds, selectedRowIds,
      visibleColumns, handleStartEditing, handleCancelEditing,
      handleSaveRow, handleUndoRow, handleUpdateDraft, handleToggleSelection,
    ]
  );

  const allSelected = filteredRowIds.length > 0 &&
    filteredRowIds.every((id) => selectedRowIds.includes(id));
  const someSelected = selectedRowIds.length > 0 && !allSelected;

  const tableHeight = height - HEADER_HEIGHT;
  
  const tableWidth = useMemo(
    () => visibleColumns.reduce((sum, col) => sum + (col.width || 150), 0),
    [visibleColumns]
  );

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
      <Box sx={{ overflowX: 'auto' }}>
        <TableHeader
          columns={visibleColumns}
          sortConfig={sortConfig}
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSort={handleToggleSort}
        />
        <List
          ref={listRef}
          height={tableHeight}
          width="100%"
          itemCount={filteredRowIds.length}
          itemSize={ROW_HEIGHT}
          itemData={itemData}
          overscanCount={5}
          style={{ minWidth: tableWidth, overflowX: 'hidden' }}
        >
          {TableRowComponent}
        </List>
      </Box>
    </Paper>
  );
}
