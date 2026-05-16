'use client';

/**
 * PaginatedTable — fallback table mode that uses traditional pagination
 * instead of virtualization. Useful for smaller datasets or when
 * users prefer page-based navigation.
 */

import React, { useMemo, useCallback } from 'react';
import { Box, Paper, TablePagination } from '@mui/material';
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
import { selectVisibleColumns, selectPage, selectRowsPerPage } from '@/redux/selectors/uiSelectors';
import {
  startEditing, cancelEditing, saveDraft,
  undoRow, updateDraft, toggleRowSelection,
  selectAllRows, deselectAllRows,
} from '@/redux/actions/tableActions';
import { toggleSortDirection } from '@/redux/actions/filterActions';
import { setPage, setRowsPerPage, showSnackbar } from '@/redux/actions/uiActions';
import { validateRow } from '@/utils/validation';
import { COLUMNS } from '@/data/columns';
import { ROW_HEIGHT } from '@/data/columns';
import { TableRowData } from '@/types';
import TableHeader from './TableHeader';
import TableRowComponent from './TableRow';

export default function PaginatedTable() {
  const dispatch = useAppDispatch();

  const filteredRowIds = useAppSelector(selectFilteredAndSortedRowIds);
  const rows = useAppSelector(selectRows);
  const editDrafts = useAppSelector(selectEditDrafts);
  const editingRowIds = useAppSelector(selectEditingRowIds);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const sortConfig = useAppSelector(selectSortConfig);
  const visibleColumns = useAppSelector(selectVisibleColumns);
  const page = useAppSelector(selectPage);
  const rowsPerPage = useAppSelector(selectRowsPerPage);

  /* Compute paginated slice */
  const paginatedRowIds = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRowIds.slice(start, start + rowsPerPage);
  }, [filteredRowIds, page, rowsPerPage]);

  /* Handlers */
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
    (id: string, field: string, value: string | number) => dispatch(updateDraft(id, field, value)),
    [dispatch]
  );

  const handleToggleSelection = useCallback(
    (id: string) => dispatch(toggleRowSelection(id)),
    [dispatch]
  );

  const handleToggleSelectAll = useCallback(() => {
    const allSelected = filteredRowIds.length > 0 &&
      filteredRowIds.every((id) => selectedRowIds.includes(id));
    if (allSelected) dispatch(deselectAllRows());
    else dispatch(selectAllRows(filteredRowIds));
  }, [dispatch, filteredRowIds, selectedRowIds]);

  const handleToggleSort = useCallback(
    (field: string) => dispatch(toggleSortDirection(field)),
    [dispatch]
  );

  const handlePageChange = useCallback(
    (_: unknown, newPage: number) => dispatch(setPage(newPage)),
    [dispatch]
  );

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setRowsPerPage(parseInt(e.target.value, 10)));
    },
    [dispatch]
  );

  const itemData: TableRowData = useMemo(
    () => ({
      rowIds: paginatedRowIds,
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
      paginatedRowIds, rows, editDrafts, editingRowIds, selectedRowIds,
      visibleColumns, handleStartEditing, handleCancelEditing,
      handleSaveRow, handleUndoRow, handleUpdateDraft, handleToggleSelection,
    ]
  );

  const allSelected = filteredRowIds.length > 0 &&
    filteredRowIds.every((id) => selectedRowIds.includes(id));
  const someSelected = selectedRowIds.length > 0 && !allSelected;

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
        <Box>
          {paginatedRowIds.map((_, index) => (
            <TableRowComponent
              key={paginatedRowIds[index]}
              index={index}
              style={{ height: ROW_HEIGHT }}
              data={itemData}
            />
          ))}
        </Box>
      </Box>
      <TablePagination
        component="div"
        count={filteredRowIds.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[25, 50, 100, 250]}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      />
    </Paper>
  );
}
