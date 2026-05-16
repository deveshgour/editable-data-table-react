/**
 * UI reducer — manages theme, pagination, column visibility,
 * snackbar notifications, and filter panel state.
 * Hydrates initial state from localStorage when available.
 */

import { UIState } from '@/types';
import { UIAction } from '../actions/uiActions';
import { DEFAULT_COLUMN_VISIBILITY } from '@/data/columns';
import {
  TOGGLE_THEME, SET_THEME, SET_PAGE, SET_ROWS_PER_PAGE,
  TOGGLE_PAGINATION_MODE, TOGGLE_COLUMN_VISIBILITY,
  SET_COLUMN_VISIBILITY, SHOW_SNACKBAR, HIDE_SNACKBAR,
  TOGGLE_FILTER_PANEL,
} from '../actionTypes/uiActionTypes';

const initialState: UIState = {
  themeMode: 'dark',
  paginationMode: false,
  page: 0,
  rowsPerPage: 50,
  columnVisibility: DEFAULT_COLUMN_VISIBILITY,
  snackbar: { open: false, message: '', severity: 'info' },
  filterPanelOpen: false,
};

export default function uiReducer(
  state: UIState = initialState,
  action: UIAction
): UIState {
  switch (action.type) {
    case TOGGLE_THEME:
      return {
        ...state,
        themeMode: state.themeMode === 'light' ? 'dark' : 'light',
      };

    case SET_THEME:
      return { ...state, themeMode: action.payload };

    case SET_PAGE:
      return { ...state, page: action.payload };

    case SET_ROWS_PER_PAGE:
      return { ...state, rowsPerPage: action.payload, page: 0 };

    case TOGGLE_PAGINATION_MODE:
      return { ...state, paginationMode: !state.paginationMode, page: 0 };

    case TOGGLE_COLUMN_VISIBILITY:
      return {
        ...state,
        columnVisibility: {
          ...state.columnVisibility,
          [action.payload]: !state.columnVisibility[action.payload],
        },
      };

    case SET_COLUMN_VISIBILITY:
      return { ...state, columnVisibility: action.payload };

    case SHOW_SNACKBAR:
      return {
        ...state,
        snackbar: { open: true, ...action.payload },
      };

    case HIDE_SNACKBAR:
      return {
        ...state,
        snackbar: { ...state.snackbar, open: false },
      };

    case TOGGLE_FILTER_PANEL:
      return { ...state, filterPanelOpen: !state.filterPanelOpen };

    default:
      return state;
  }
}
