/**
 * Action type constants for filter/sort-related Redux actions.
 */

export const SET_GLOBAL_SEARCH = 'filter/SET_GLOBAL_SEARCH' as const;
export const SET_COLUMN_FILTER = 'filter/SET_COLUMN_FILTER' as const;
export const CLEAR_COLUMN_FILTER = 'filter/CLEAR_COLUMN_FILTER' as const;
export const CLEAR_ALL_FILTERS = 'filter/CLEAR_ALL_FILTERS' as const;
export const ADD_SORT_CONFIG = 'filter/ADD_SORT_CONFIG' as const;
export const REMOVE_SORT_CONFIG = 'filter/REMOVE_SORT_CONFIG' as const;
export const TOGGLE_SORT_DIRECTION = 'filter/TOGGLE_SORT_DIRECTION' as const;
export const CLEAR_ALL_SORTS = 'filter/CLEAR_ALL_SORTS' as const;
