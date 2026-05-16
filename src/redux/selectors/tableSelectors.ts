/**
 * Memoized selectors for table data.
 * Uses reselect's createSelector for automatic memoization
 * of expensive filtering, sorting, and pagination computations.
 */

import { createSelector } from 'reselect';
import { RootState, EmployeeRow } from '@/types';
import { filterRows } from '@/utils/filtering';
import { multiColumnSort } from '@/utils/sorting';

/* ─── Base Selectors ─── */

export const selectTableState = (state: RootState) => state.table;
export const selectRows = (state: RootState) => state.table.rows;
export const selectRowIds = (state: RootState) => state.table.rowIds;
export const selectEditDrafts = (state: RootState) => state.table.editDrafts;
export const selectEditingRowIds = (state: RootState) => state.table.editingRowIds;
export const selectSelectedRowIds = (state: RootState) => state.table.selectedRowIds;
export const selectOriginalRows = (state: RootState) => state.table.originalRows;
export const selectTableStatus = (state: RootState) => state.table.status;
export const selectTableError = (state: RootState) => state.table.error;

/* ─── Filter Inputs ─── */

const selectGlobalSearch = (state: RootState) => state.filter.globalSearch;
const selectColumnFilters = (state: RootState) => state.filter.columnFilters;
const selectSortConfig = (state: RootState) => state.filter.sortConfig;

/* ─── Derived Selectors ─── */

/**
 * Core selector: applies global search + column filters → then sorts.
 * This is the most expensive computation and is heavily memoized.
 */
export const selectFilteredAndSortedRowIds = createSelector(
  [selectRowIds, selectRows, selectGlobalSearch, selectColumnFilters, selectSortConfig],
  (rowIds, rows, globalSearch, columnFilters, sortConfig) => {
    /* Step 1: Filter */
    const filteredIds = filterRows(rowIds, rows, globalSearch, columnFilters);

    /* Step 2: Sort */
    return multiColumnSort(filteredIds, rows, sortConfig);
  }
);

/** Total count of filtered rows (for display and pagination) */
export const selectFilteredRowCount = createSelector(
  [selectFilteredAndSortedRowIds],
  (ids) => ids.length
);

/** Paginated slice of the filtered+sorted IDs */
export const selectPaginatedRowIds = createSelector(
  [
    selectFilteredAndSortedRowIds,
    (state: RootState) => state.ui.page,
    (state: RootState) => state.ui.rowsPerPage,
  ],
  (ids, page, rowsPerPage) => {
    const start = page * rowsPerPage;
    return ids.slice(start, start + rowsPerPage);
  }
);

/** Whether there are any unsaved edits in the draft store */
export const selectHasUnsavedChanges = createSelector(
  [selectEditDrafts],
  (drafts) => Object.keys(drafts).length > 0
);

/** IDs of rows that have been modified but not yet saved */
export const selectDirtyRowIds = createSelector(
  [selectOriginalRows, selectRows],
  (originalRows, currentRows) => {
    return Object.keys(originalRows).filter((id) => {
      const original = originalRows[id];
      const current = currentRows[id];
      if (!original || !current) return false;
      return JSON.stringify(original) !== JSON.stringify(current);
    });
  }
);

/** Returns rows for the current view (mapped from IDs to full row data) */
export const selectVisibleRowData = createSelector(
  [selectFilteredAndSortedRowIds, selectRows],
  (ids, rows) => ids.map((id) => rows[id]).filter(Boolean)
);

/** Count of selected rows */
export const selectSelectedCount = createSelector(
  [selectSelectedRowIds],
  (ids) => ids.length
);

/** Total row count (unfiltered) */
export const selectTotalRowCount = createSelector(
  [selectRowIds],
  (ids) => ids.length
);
