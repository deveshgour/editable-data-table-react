'use client';

/**
 * ExportCSV — toolbar button for exporting filtered data to CSV.
 */

import React, { useCallback } from 'react';
import { Button, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { selectFilteredAndSortedRowIds, selectRows } from '@/redux/selectors/tableSelectors';
import { showSnackbar } from '@/redux/actions/uiActions';
import { exportSelectedToCSV } from '@/utils/csvExport';

function ExportCSV() {
  const dispatch = useAppDispatch();
  const filteredRowIds = useAppSelector(selectFilteredAndSortedRowIds);
  const rows = useAppSelector(selectRows);

  const handleExport = useCallback(() => {
    if (filteredRowIds.length === 0) {
      dispatch(showSnackbar({ message: 'No data to export', severity: 'warning' }));
      return;
    }

    exportSelectedToCSV(filteredRowIds, rows, `employees-export-${new Date().toISOString().slice(0, 10)}.csv`);
    dispatch(showSnackbar({
      message: `Exported ${filteredRowIds.length} rows to CSV`,
      severity: 'success',
    }));
  }, [dispatch, filteredRowIds, rows]);

  return (
    <Tooltip title="Export to CSV (Ctrl+E)" arrow>
      <Button
        variant="outlined"
        size="small"
        startIcon={<FileDownloadIcon />}
        onClick={handleExport}
        sx={{ borderRadius: 2, textTransform: 'none' }}
      >
        Export
      </Button>
    </Tooltip>
  );
}

export default React.memo(ExportCSV);
