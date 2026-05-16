/**
 * Filter reducer — manages global search, column-level filters,
 * and multi-column sort configurations.
 */

import { FilterState } from '@/types';
import { FilterAction } from '../actions/filterActions';
import {
  SET_GLOBAL_SEARCH, SET_COLUMN_FILTER, CLEAR_COLUMN_FILTER,
  CLEAR_ALL_FILTERS, ADD_SORT_CONFIG, REMOVE_SORT_CONFIG,
  TOGGLE_SORT_DIRECTION, CLEAR_ALL_SORTS,
} from '../actionTypes/filterActionTypes';

const initialState: FilterState = {
  globalSearch: '',
  columnFilters: {},
  sortConfig: [],
};

export default function filterReducer(
  state: FilterState = initialState,
  action: FilterAction
): FilterState {
  switch (action.type) {
    case SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };

    case SET_COLUMN_FILTER:
      return {
        ...state,
        columnFilters: {
          ...state.columnFilters,
          [action.payload.field]: action.payload.filter,
        },
      };

    case CLEAR_COLUMN_FILTER: {
      const newFilters = { ...state.columnFilters };
      delete newFilters[action.payload];
      return { ...state, columnFilters: newFilters };
    }

    case CLEAR_ALL_FILTERS:
      return { ...state, globalSearch: '', columnFilters: {} };

    case ADD_SORT_CONFIG: {
      /* Replace existing sort for same field, or add new */
      const existingIndex = state.sortConfig.findIndex(
        (s) => s.field === action.payload.field
      );

      if (existingIndex >= 0) {
        const newSortConfig = [...state.sortConfig];
        newSortConfig[existingIndex] = action.payload;
        return { ...state, sortConfig: newSortConfig };
      }

      return {
        ...state,
        sortConfig: [...state.sortConfig, action.payload],
      };
    }

    case REMOVE_SORT_CONFIG:
      return {
        ...state,
        sortConfig: state.sortConfig.filter((s) => s.field !== action.payload),
      };

    case TOGGLE_SORT_DIRECTION: {
      const field = action.payload;
      const existing = state.sortConfig.find((s) => s.field === field);

      if (!existing) {
        /* Not sorted yet — add ascending */
        return {
          ...state,
          sortConfig: [...state.sortConfig, { field, direction: 'asc' }],
        };
      }

      if (existing.direction === 'asc') {
        /* Ascending → Descending */
        return {
          ...state,
          sortConfig: state.sortConfig.map((s) =>
            s.field === field ? { ...s, direction: 'desc' as const } : s
          ),
        };
      }

      /* Descending → Remove sort (cycle: asc → desc → none) */
      return {
        ...state,
        sortConfig: state.sortConfig.filter((s) => s.field !== field),
      };
    }

    case CLEAR_ALL_SORTS:
      return { ...state, sortConfig: [] };

    default:
      return state;
  }
}
