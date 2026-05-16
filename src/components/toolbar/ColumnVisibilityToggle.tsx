'use client';

/**
 * ColumnVisibilityToggle — dropdown menu to show/hide table columns.
 */

import React, { useState, useCallback } from 'react';
import {
  IconButton, Tooltip, Menu, MenuItem, Checkbox,
  ListItemText, Typography, Divider, Box,
} from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { toggleColumnVisibility } from '@/redux/actions/uiActions';
import { selectColumnVisibility } from '@/redux/selectors/uiSelectors';
import { COLUMNS } from '@/data/columns';

function ColumnVisibilityToggle() {
  const dispatch = useAppDispatch();
  const visibility = useAppSelector(selectColumnVisibility);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => setAnchorEl(null), []);

  const handleToggle = useCallback(
    (field: string) => {
      dispatch(toggleColumnVisibility(field));
    },
    [dispatch]
  );

  /* Only show toggleable columns (not selection/actions) */
  const toggleableColumns = COLUMNS.filter(
    (col) => col.type !== 'selection' && col.type !== 'actions'
  );

  return (
    <>
      <Tooltip title="Toggle columns" arrow>
        <IconButton size="small" onClick={handleOpen} color="inherit">
          <ViewColumnIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: { minWidth: 200, maxHeight: 400 },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Visible Columns
          </Typography>
        </Box>
        <Divider />
        {toggleableColumns.map((col) => (
          <MenuItem
            key={col.field}
            onClick={() => handleToggle(col.field)}
            dense
          >
            <Checkbox
              checked={visibility[col.field] !== false}
              size="small"
              sx={{ p: 0.5, mr: 1 }}
            />
            <ListItemText primary={col.headerName} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default React.memo(ColumnVisibilityToggle);
