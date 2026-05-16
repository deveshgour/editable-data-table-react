'use client';

/**
 * NumericRangeFilter — min/max range filter for numeric columns.
 */

import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useDebounce } from '@/hooks/useDebounce';

interface NumericRangeFilterProps {
  field: string;
  label: string;
  min: number | null;
  max: number | null;
  onChange: (field: string, min: number | null, max: number | null) => void;
}

function NumericRangeFilter({ field, label, min, max, onChange }: NumericRangeFilterProps) {
  const [localMin, setLocalMin] = useState<string>(min !== null ? String(min) : '');
  const [localMax, setLocalMax] = useState<string>(max !== null ? String(max) : '');

  const debouncedMin = useDebounce(localMin, 300);
  const debouncedMax = useDebounce(localMax, 300);

  useEffect(() => {
    const parsedMin = debouncedMin !== '' ? Number(debouncedMin) : null;
    const parsedMax = debouncedMax !== '' ? Number(debouncedMax) : null;

    if (parsedMin !== min || parsedMax !== max) {
      onChange(field, parsedMin, parsedMax);
    }
  }, [debouncedMin, debouncedMax, field, min, max, onChange]);

  /* Sync with external values */
  useEffect(() => {
    setLocalMin(min !== null ? String(min) : '');
    setLocalMax(max !== null ? String(max) : '');
  }, [min, max]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          placeholder="Min"
          type="number"
          size="small"
          variant="outlined"
          sx={{
            width: 100,
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
            '& .MuiInputBase-input': { py: 0.75 },
          }}
        />
        <Typography variant="body2" color="text.secondary">—</Typography>
        <TextField
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          placeholder="Max"
          type="number"
          size="small"
          variant="outlined"
          sx={{
            width: 100,
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
            '& .MuiInputBase-input': { py: 0.75 },
          }}
        />
      </Box>
    </Box>
  );
}

export default React.memo(NumericRangeFilter);
