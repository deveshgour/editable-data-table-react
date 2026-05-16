'use client';

/**
 * EditableCell — inline editable cell component for the data table.
 * Uses local state for keystrokes and dispatches to Redux on blur
 * for optimal performance in virtualized lists.
 *
 * Supports text and numeric field types with inline validation.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TextField, Typography, Box } from '@mui/material';
import { validateField } from '@/utils/validation';

interface EditableCellProps {
  value: string | number;
  field: string;
  type: 'text' | 'numeric';
  isEditing: boolean;
  width: number;
  onUpdate: (field: string, value: string | number) => void;
  onSave: () => void;
  onCancel: () => void;
}

function EditableCell({
  value,
  field,
  type,
  isEditing,
  width,
  onUpdate,
  onSave,
  onCancel,
}: EditableCellProps) {
  const [localValue, setLocalValue] = useState<string>(String(value));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Sync local value when the upstream value changes */
  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      /* Live validation feedback */
      const validationError = validateField(field, type === 'numeric' ? Number(newValue) : newValue);
      setError(validationError);
    },
    [field, type]
  );

  const handleBlur = useCallback(() => {
    const finalValue = type === 'numeric' ? Number(localValue) : localValue;
    onUpdate(field, finalValue);
  }, [field, localValue, type, onUpdate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleBlur();
        onSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
      /* Stop propagation to prevent global shortcuts from firing */
      e.stopPropagation();
    },
    [handleBlur, onSave, onCancel]
  );

  /* View mode — display formatted value */
  if (!isEditing) {
    const displayValue =
      type === 'numeric' && field === 'salary'
        ? `$${Number(value).toLocaleString()}`
        : String(value);

    return (
      <Box
        sx={{
          width,
          px: 1.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        <Typography variant="body2" noWrap title={displayValue}>
          {displayValue}
        </Typography>
      </Box>
    );
  }

  /* Edit mode — render input */
  return (
    <Box sx={{ width, px: 0.5, flexShrink: 0 }}>
      <TextField
        inputRef={inputRef}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        type={type === 'numeric' ? 'number' : 'text'}
        error={!!error}
        helperText={error}
        size="small"
        variant="outlined"
        fullWidth
        autoComplete="off"
        sx={{
          '& .MuiInputBase-input': {
            py: 0.5,
            px: 1,
            fontSize: '0.875rem',
          },
          '& .MuiFormHelperText-root': {
            mx: 0,
            fontSize: '0.7rem',
          },
        }}
      />
    </Box>
  );
}

export default React.memo(EditableCell);
