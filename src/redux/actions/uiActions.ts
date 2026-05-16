/**
 * Action creators for UI state changes.
 */

import { SnackbarState } from '@/types';
import {
  TOGGLE_THEME, SET_THEME, SET_PAGE, SET_ROWS_PER_PAGE,
  TOGGLE_PAGINATION_MODE, TOGGLE_COLUMN_VISIBILITY,
  SET_COLUMN_VISIBILITY, SHOW_SNACKBAR, HIDE_SNACKBAR,
  TOGGLE_FILTER_PANEL,
} from '../actionTypes/uiActionTypes';

export const toggleTheme = () => ({
  type: TOGGLE_THEME,
});

export const setTheme = (mode: 'light' | 'dark') => ({
  type: SET_THEME,
  payload: mode,
});

export const setPage = (page: number) => ({
  type: SET_PAGE,
  payload: page,
});

export const setRowsPerPage = (rowsPerPage: number) => ({
  type: SET_ROWS_PER_PAGE,
  payload: rowsPerPage,
});

export const togglePaginationMode = () => ({
  type: TOGGLE_PAGINATION_MODE,
});

export const toggleColumnVisibility = (field: string) => ({
  type: TOGGLE_COLUMN_VISIBILITY,
  payload: field,
});

export const setColumnVisibility = (visibility: Record<string, boolean>) => ({
  type: SET_COLUMN_VISIBILITY,
  payload: visibility,
});

export const showSnackbar = (snackbar: Omit<SnackbarState, 'open'>) => ({
  type: SHOW_SNACKBAR,
  payload: snackbar,
});

export const hideSnackbar = () => ({
  type: HIDE_SNACKBAR,
});

export const toggleFilterPanel = () => ({
  type: TOGGLE_FILTER_PANEL,
});

export type UIAction =
  | ReturnType<typeof toggleTheme>
  | ReturnType<typeof setTheme>
  | ReturnType<typeof setPage>
  | ReturnType<typeof setRowsPerPage>
  | ReturnType<typeof togglePaginationMode>
  | ReturnType<typeof toggleColumnVisibility>
  | ReturnType<typeof setColumnVisibility>
  | ReturnType<typeof showSnackbar>
  | ReturnType<typeof hideSnackbar>
  | ReturnType<typeof toggleFilterPanel>;
