/**
 * Action type constants for table-related Redux actions.
 * Using string constants with a 'table/' prefix for namespacing.
 */

export const SET_ROWS = 'table/SET_ROWS' as const;
export const SET_STATUS = 'table/SET_STATUS' as const;
export const SET_ERROR = 'table/SET_ERROR' as const;
export const START_EDITING = 'table/START_EDITING' as const;
export const UPDATE_DRAFT = 'table/UPDATE_DRAFT' as const;
export const SAVE_DRAFT = 'table/SAVE_DRAFT' as const;
export const CANCEL_EDITING = 'table/CANCEL_EDITING' as const;
export const UNDO_ROW = 'table/UNDO_ROW' as const;
export const TOGGLE_ROW_SELECTION = 'table/TOGGLE_ROW_SELECTION' as const;
export const SELECT_ALL_ROWS = 'table/SELECT_ALL_ROWS' as const;
export const DESELECT_ALL_ROWS = 'table/DESELECT_ALL_ROWS' as const;
export const BULK_DELETE = 'table/BULK_DELETE' as const;
