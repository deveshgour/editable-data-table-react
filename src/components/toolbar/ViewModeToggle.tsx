'use client';

/**
 * ViewModeToggle — switches between virtualized scroll and paginated table modes.
 */

import React, { useCallback } from 'react';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { togglePaginationMode } from '@/redux/actions/uiActions';
import { selectPaginationMode } from '@/redux/selectors/uiSelectors';

function ViewModeToggle() {
  const dispatch = useAppDispatch();
  const paginationMode = useAppSelector(selectPaginationMode);

  const handleChange = useCallback(() => {
    dispatch(togglePaginationMode());
  }, [dispatch]);

  return (
    <ToggleButtonGroup
      value={paginationMode ? 'paginated' : 'virtual'}
      exclusive
      onChange={handleChange}
      size="small"
    >
      <ToggleButton value="virtual">
        <Tooltip title="Virtual scroll" arrow>
          <ViewStreamIcon sx={{ fontSize: 18 }} />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="paginated">
        <Tooltip title="Paginated" arrow>
          <TableRowsIcon sx={{ fontSize: 18 }} />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default React.memo(ViewModeToggle);
