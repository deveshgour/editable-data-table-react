'use client';

/**
 * ColumnFilterPanel — expandable panel with per-column filters.
 * Shows text filters for string columns, numeric range for numeric columns.
 */

import React, { useCallback } from 'react';
import { Box, Button, Collapse, Paper, Typography } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  selectColumnFilters,
  selectHasActiveFilters,
} from '@/redux/selectors/filterSelectors';
import { selectFilterPanelOpen } from '@/redux/selectors/uiSelectors';
import { setColumnFilter, clearColumnFilter, clearAllFilters } from '@/redux/actions/filterActions';
import { COLUMNS } from '@/data/columns';
import { TextColumnFilter, NumericColumnFilter } from '@/types';
import TextFilter from './TextFilter';
import NumericRangeFilter from './NumericRangeFilter';

function ColumnFilterPanel() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectFilterPanelOpen);
  const columnFilters = useAppSelector(selectColumnFilters);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);

  const filterableColumns = COLUMNS.filter((col) => col.filterable);

  const handleTextChange = useCallback(
    (field: string, value: string) => {
      if (value.trim() === '') {
        dispatch(clearColumnFilter(field));
      } else {
        dispatch(setColumnFilter(field, { type: 'text', value }));
      }
    },
    [dispatch]
  );

  const handleNumericChange = useCallback(
    (field: string, min: number | null, max: number | null) => {
      if (min === null && max === null) {
        dispatch(clearColumnFilter(field));
      } else {
        dispatch(setColumnFilter(field, { type: 'numeric', min, max }));
      }
    },
    [dispatch]
  );

  const handleClearAll = useCallback(() => {
    dispatch(clearAllFilters());
  }, [dispatch]);

  return (
    <Collapse in={isOpen}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Column Filters
          </Typography>
          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={<ClearAllIcon />}
              onClick={handleClearAll}
              sx={{ textTransform: 'none' }}
            >
              Clear All Filters
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {filterableColumns.map((col) => {
            if (col.type === 'text' || col.type === 'status') {
              const filter = columnFilters[col.field] as TextColumnFilter | undefined;
              return (
                <TextFilter
                  key={col.field}
                  field={col.field}
                  label={col.headerName}
                  value={filter?.value || ''}
                  onChange={handleTextChange}
                />
              );
            }

            if (col.type === 'numeric') {
              const filter = columnFilters[col.field] as NumericColumnFilter | undefined;
              return (
                <NumericRangeFilter
                  key={col.field}
                  field={col.field}
                  label={col.headerName}
                  min={filter?.min ?? null}
                  max={filter?.max ?? null}
                  onChange={handleNumericChange}
                />
              );
            }

            return null;
          })}
        </Box>
      </Paper>
    </Collapse>
  );
}

export default React.memo(ColumnFilterPanel);
