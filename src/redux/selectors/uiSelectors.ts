/**
 * Selectors for UI state.
 */

import { RootState } from '@/types';
import { createSelector } from 'reselect';
import { COLUMNS } from '@/data/columns';

export const selectUIState = (state: RootState) => state.ui;
export const selectThemeMode = (state: RootState) => state.ui.themeMode;
export const selectPaginationMode = (state: RootState) => state.ui.paginationMode;
export const selectPage = (state: RootState) => state.ui.page;
export const selectRowsPerPage = (state: RootState) => state.ui.rowsPerPage;
export const selectColumnVisibility = (state: RootState) => state.ui.columnVisibility;
export const selectSnackbar = (state: RootState) => state.ui.snackbar;
export const selectFilterPanelOpen = (state: RootState) => state.ui.filterPanelOpen;

/** Visible column definitions based on visibility settings */
export const selectVisibleColumns = createSelector(
  [selectColumnVisibility],
  (visibility) => {
    return COLUMNS.filter((col) => {
      /* Always show selection and actions columns */
      if (col.type === 'selection' || col.type === 'actions') return true;
      return visibility[col.field] !== false;
    });
  }
);

/** Total width of visible columns */
export const selectVisibleColumnsWidth = createSelector(
  [selectVisibleColumns],
  (columns) => columns.reduce((sum, col) => sum + col.width, 0)
);
