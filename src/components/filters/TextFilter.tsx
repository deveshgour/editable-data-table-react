'use client';

/**
 * TextFilter — column-level text search filter with debounce.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useDebounce } from '@/hooks/useDebounce';

interface TextFilterProps {
  field: string;
  label: string;
  value: string;
  onChange: (field: string, value: string) => void;
}

function TextFilter({ field, label, value, onChange }: TextFilterProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(field, debouncedValue);
    }
  }, [debouncedValue, field, value, onChange]);

  /* Sync with external value */
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange(field, '');
  }, [field, onChange]);

  return (
    <TextField
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      label={label}
      size="small"
      variant="outlined"
      fullWidth
      sx={{
        minWidth: 140,
        '& .MuiOutlinedInput-root': { borderRadius: 2 },
      }}
      InputProps={{
        endAdornment: localValue ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}

export default React.memo(TextFilter);
