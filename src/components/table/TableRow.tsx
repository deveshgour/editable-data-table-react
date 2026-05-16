'use client';

/**
 * TableRow — a single row in the data table.
 * React.memo'd with a custom comparator to minimize re-renders.
 *
 * Handles both view and edit modes:
 * - View: displays formatted cell values
 * - Edit: renders EditableCell components for editable fields
 *
 * Receives data via the react-window itemData pattern for performance.
 */

import React, { useCallback } from 'react';
import { Box, Checkbox, Chip, Typography } from '@mui/material';
import { EmployeeRow, ColumnDefinition, TableRowData } from '@/types';
import EditableCell from './EditableCell';
import RowActions from './RowActions';

interface TableRowProps {
  index: number;
  style: React.CSSProperties;
  data: TableRowData;
}

/** Status badge color mapping */
const statusColors: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  Active: 'success',
  Inactive: 'default',
  'On Leave': 'warning',
  Terminated: 'error',
};

function TableRowComponent({ index, style, data }: TableRowProps) {
  const {
    rowIds, rows, editDrafts, editingRowIds, selectedRowIds,
    visibleColumns, onStartEditing, onCancelEditing, onSaveRow,
    onUndoRow, onUpdateDraft, onToggleSelection,
  } = data;

  const rowId = rowIds[index];
  if (!rowId) return null;

  const isEditing = editingRowIds.includes(rowId);
  const isSelected = selectedRowIds.includes(rowId);
  const draft = editDrafts[rowId];
  const row: EmployeeRow = isEditing && draft ? draft : rows[rowId];
  if (!row) return null;

  const isDirty = !!editDrafts[rowId] || isEditing;

  const handleUpdateDraft = useCallback(
    (field: string, value: string | number) => {
      onUpdateDraft(rowId, field, value);
    },
    [rowId, onUpdateDraft]
  );

  const handleSave = useCallback(() => onSaveRow(rowId), [rowId, onSaveRow]);
  const handleCancel = useCallback(() => onCancelEditing(rowId), [rowId, onCancelEditing]);

  const renderCell = (col: ColumnDefinition) => {
    const fieldValue = row[col.field as keyof EmployeeRow];

    /* Selection column */
    if (col.type === 'selection') {
      return (
        <Box key={col.field} sx={{ width: col.width, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Checkbox
            size="small"
            checked={isSelected}
            onChange={() => onToggleSelection(rowId)}
            sx={{ p: 0.5 }}
          />
        </Box>
      );
    }

    /* Actions column */
    if (col.type === 'actions') {
      return (
        <Box key={col.field} sx={{ width: col.width, flexShrink: 0, display: 'flex', alignItems: 'center', px: 1 }}>
          <RowActions
            rowId={rowId}
            isEditing={isEditing}
            hasOriginal={!!data.editDrafts[rowId] || !!rows[rowId]}
            onStartEditing={onStartEditing}
            onSave={onSaveRow}
            onCancel={onCancelEditing}
            onUndo={onUndoRow}
          />
        </Box>
      );
    }

    /* Status chip column */
    if (col.type === 'status') {
      return (
        <Box key={col.field} sx={{ width: col.width, flexShrink: 0, px: 1.5, display: 'flex', alignItems: 'center' }}>
          <Chip
            label={String(fieldValue)}
            size="small"
            color={statusColors[String(fieldValue)] || 'default'}
            variant="outlined"
            sx={{ fontSize: '0.75rem', height: 24 }}
          />
        </Box>
      );
    }

    /* Date column */
    if (col.type === 'date') {
      return (
        <Box key={col.field} sx={{ width: col.width, flexShrink: 0, px: 1.5, overflow: 'hidden' }}>
          <Typography variant="body2" noWrap>
            {new Date(String(fieldValue)).toLocaleDateString()}
          </Typography>
        </Box>
      );
    }

    /* Editable cell */
    if (col.editable && (col.type === 'text' || col.type === 'numeric')) {
      return (
        <EditableCell
          key={col.field}
          value={fieldValue as string | number}
          field={col.field}
          type={col.type}
          isEditing={isEditing}
          width={col.width}
          onUpdate={handleUpdateDraft}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      );
    }

    /* Read-only text cell */
    return (
      <Box key={col.field} sx={{ width: col.width, flexShrink: 0, px: 1.5, overflow: 'hidden' }}>
        <Typography variant="body2" noWrap>
          {String(fieldValue)}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: isEditing
          ? 'action.selected'
          : isSelected
            ? 'action.hover'
            : index % 2 === 0
              ? 'background.paper'
              : 'action.hover',
        borderLeft: isDirty ? '3px solid' : '3px solid transparent',
        borderLeftColor: isDirty ? 'warning.main' : 'transparent',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        cursor: 'default',
        minWidth: 'fit-content',
      }}
    >
      {visibleColumns.map(renderCell)}
    </Box>
  );
}

/* Custom comparator to avoid re-renders when only irrelevant data changes */
function areEqual(prev: TableRowProps, next: TableRowProps): boolean {
  if (prev.index !== next.index) return false;
  if (prev.style !== next.style) return false;

  const prevId = prev.data.rowIds[prev.index];
  const nextId = next.data.rowIds[next.index];
  if (prevId !== nextId) return false;

  /* Check if the row data itself changed */
  if (prev.data.rows[prevId] !== next.data.rows[nextId]) return false;

  /* Check draft status */
  if (prev.data.editDrafts[prevId] !== next.data.editDrafts[nextId]) return false;

  /* Check editing status */
  const prevEditing = prev.data.editingRowIds.includes(prevId);
  const nextEditing = next.data.editingRowIds.includes(nextId);
  if (prevEditing !== nextEditing) return false;

  /* Check selection status */
  const prevSelected = prev.data.selectedRowIds.includes(prevId);
  const nextSelected = next.data.selectedRowIds.includes(nextId);
  if (prevSelected !== nextSelected) return false;

  /* Check visible columns */
  if (prev.data.visibleColumns !== next.data.visibleColumns) return false;

  return true;
}

export default React.memo(TableRowComponent, areEqual);
