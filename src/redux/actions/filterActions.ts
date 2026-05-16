/**
 * Action creators for filter/sort state changes.
 */

import { ColumnFilter, SortConfig, SortDirection } from '@/types';
import {
  SET_GLOBAL_SEARCH, SET_COLUMN_FILTER, CLEAR_COLUMN_FILTER,
  CLEAR_ALL_FILTERS, ADD_SORT_CONFIG, REMOVE_SORT_CONFIG,
  TOGGLE_SORT_DIRECTION, CLEAR_ALL_SORTS,
} from '../actionTypes/filterActionTypes';

export const setGlobalSearch = (search: string) => ({
  type: SET_GLOBAL_SEARCH,
  payload: search,
});

export const setColumnFilter = (field: string, filter: ColumnFilter) => ({
  type: SET_COLUMN_FILTER,
  payload: { field, filter },
});

export const clearColumnFilter = (field: string) => ({
  type: CLEAR_COLUMN_FILTER,
  payload: field,
});

export const clearAllFilters = () => ({
  type: CLEAR_ALL_FILTERS,
});

export const addSortConfig = (config: SortConfig) => ({
  type: ADD_SORT_CONFIG,
  payload: config,
});

export const removeSortConfig = (field: string) => ({
  type: REMOVE_SORT_CONFIG,
  payload: field,
});

export const toggleSortDirection = (field: string) => ({
  type: TOGGLE_SORT_DIRECTION,
  payload: field,
});

export const clearAllSorts = () => ({
  type: CLEAR_ALL_SORTS,
});

export type FilterAction =
  | ReturnType<typeof setGlobalSearch>
  | ReturnType<typeof setColumnFilter>
  | ReturnType<typeof clearColumnFilter>
  | ReturnType<typeof clearAllFilters>
  | ReturnType<typeof addSortConfig>
  | ReturnType<typeof removeSortConfig>
  | ReturnType<typeof toggleSortDirection>
  | ReturnType<typeof clearAllSorts>;
