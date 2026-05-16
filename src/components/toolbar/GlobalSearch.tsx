'use client';

/**
 * GlobalSearch — debounced search input for filtering across all columns.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDebounce } from '@/hooks/useDebounce';
import { setGlobalSearch } from '@/redux/actions/filterActions';
import { selectGlobalSearch } from '@/redux/selectors/filterSelectors';

interface GlobalSearchProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

function GlobalSearch({ inputRef }: GlobalSearchProps) {
  const dispatch = useAppDispatch();
  const currentSearch = useAppSelector(selectGlobalSearch);
  const [localValue, setLocalValue] = useState(currentSearch);
  const debouncedValue = useDebounce(localValue, 300);

  /* Dispatch debounced value to Redux */
  useEffect(() => {
    if (debouncedValue !== currentSearch) {
      dispatch(setGlobalSearch(debouncedValue));
    }
  }, [debouncedValue, currentSearch, dispatch]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue('');
    dispatch(setGlobalSearch(''));
  }, [dispatch]);

  return (
    <TextField
      inputRef={inputRef}
      value={localValue}
      onChange={handleChange}
      placeholder="Search all columns..."
      size="small"
      variant="outlined"
      sx={{
        minWidth: 250,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          </InputAdornment>
        ),
        endAdornment: localValue ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear} edge="end">
              <ClearIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}

export default React.memo(GlobalSearch);
