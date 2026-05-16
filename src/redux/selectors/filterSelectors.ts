/**
 * Selectors for filter/sort state.
 */

import { createSelector } from 'reselect';
import { RootState } from '@/types';

export const selectFilterState = (state: RootState) => state.filter;
export const selectGlobalSearch = (state: RootState) => state.filter.globalSearch;
export const selectColumnFilters = (state: RootState) => state.filter.columnFilters;
export const selectSortConfig = (state: RootState) => state.filter.sortConfig;

/** Whether any filters or sorts are active */
export const selectHasActiveFilters = createSelector(
  [selectGlobalSearch, selectColumnFilters, selectSortConfig],
  (search, columnFilters, sortConfig) => {
    if (search.trim() !== '') return true;
    if (Object.keys(columnFilters).length > 0) return true;
    if (sortConfig.length > 0) return true;
    return false;
  }
);

/** Get sort direction for a specific field */
export const selectSortDirectionForField = (field: string) =>
  createSelector(
    [selectSortConfig],
    (sortConfig) => {
      const config = sortConfig.find((s) => s.field === field);
      return config ? config.direction : null;
    }
  );

/** Get sort index for a field (for multi-sort display) */
export const selectSortIndexForField = (field: string) =>
  createSelector(
    [selectSortConfig],
    (sortConfig) => {
      const index = sortConfig.findIndex((s) => s.field === field);
      return index >= 0 ? index + 1 : null;
    }
  );
