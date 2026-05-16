'use client';

/**
 * BulkActions — appears when rows are selected.
 * Provides delete and export actions for selected rows.
 */

import React, { useState, useCallback } from 'react';
import {
  Box, Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { selectSelectedRowIds, selectRows } from '@/redux/selectors/tableSelectors';
import { bulkDelete, deselectAllRows } from '@/redux/actions/tableActions';
import { showSnackbar } from '@/redux/actions/uiActions';
import { exportSelectedToCSV } from '@/utils/csvExport';

function BulkActions() {
  const dispatch = useAppDispatch();
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const rows = useAppSelector(selectRows);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const selectedCount = selectedRowIds.length;
  if (selectedCount === 0) return null;

  const handleExportSelected = () => {
    exportSelectedToCSV(selectedRowIds, rows, 'selected-export.csv');
    dispatch(showSnackbar({
      message: `Exported ${selectedCount} selected rows`,
      severity: 'success',
    }));
  };

  const handleDeleteConfirm = () => {
    dispatch(bulkDelete(selectedRowIds));
    dispatch(showSnackbar({
      message: `Deleted ${selectedCount} rows`,
      severity: 'success',
    }));
    setDeleteDialogOpen(false);
  };

  const handleDeselectAll = () => {
    dispatch(deselectAllRows());
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          {selectedCount} selected
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportSelected}
          sx={{
            color: 'inherit',
            borderColor: 'rgba(255,255,255,0.5)',
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { borderColor: 'rgba(255,255,255,0.8)' },
          }}
        >
          Export
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => setDeleteDialogOpen(true)}
          sx={{
            color: 'inherit',
            borderColor: 'rgba(255,255,255,0.5)',
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { borderColor: 'rgba(255,255,255,0.8)' },
          }}
        >
          Delete
        </Button>
        <Button
          size="small"
          onClick={handleDeselectAll}
          sx={{
            color: 'inherit',
            textTransform: 'none',
            fontSize: '0.75rem',
          }}
        >
          Clear
        </Button>
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedCount} selected row{selectedCount > 1 ? 's' : ''}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default React.memo(BulkActions);
