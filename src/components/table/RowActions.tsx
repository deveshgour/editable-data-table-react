'use client';

/**
 * RowActions — compact action buttons for each table row.
 * Provides Edit, Save, Cancel, and Undo operations.
 */

import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import UndoIcon from '@mui/icons-material/Undo';

interface RowActionsProps {
  rowId: string;
  isEditing: boolean;
  hasOriginal: boolean;
  onStartEditing: (id: string) => void;
  onSave: (id: string) => void;
  onCancel: (id: string) => void;
  onUndo: (id: string) => void;
}

function RowActions({
  rowId,
  isEditing,
  hasOriginal,
  onStartEditing,
  onSave,
  onCancel,
  onUndo,
}: RowActionsProps) {
  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', gap: 0.25, alignItems: 'center' }}>
        <Tooltip title="Save (Enter)" arrow>
          <IconButton
            size="small"
            color="success"
            onClick={() => onSave(rowId)}
            aria-label="Save row"
          >
            <SaveIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel (Esc)" arrow>
          <IconButton
            size="small"
            color="error"
            onClick={() => onCancel(rowId)}
            aria-label="Cancel editing"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.25, alignItems: 'center' }}>
      <Tooltip title="Edit row" arrow>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onStartEditing(rowId)}
          aria-label="Edit row"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {hasOriginal && (
        <Tooltip title="Undo changes" arrow>
          <IconButton
            size="small"
            color="warning"
            onClick={() => onUndo(rowId)}
            aria-label="Undo changes"
          >
            <UndoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

export default React.memo(RowActions);
