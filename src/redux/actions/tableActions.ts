/**
 * Action creators for table-related state changes.
 * Each creator returns a strongly typed action object.
 */

import { EmployeeRow } from '@/types';
import {
  SET_ROWS, SET_STATUS, SET_ERROR,
  START_EDITING, UPDATE_DRAFT, SAVE_DRAFT, CANCEL_EDITING, UNDO_ROW,
  TOGGLE_ROW_SELECTION, SELECT_ALL_ROWS, DESELECT_ALL_ROWS, BULK_DELETE,
} from '../actionTypes/tableActionTypes';

export const setRows = (rows: Record<string, EmployeeRow>, rowIds: string[]) => ({
  type: SET_ROWS,
  payload: { rows, rowIds },
});

export const setStatus = (status: 'idle' | 'loading' | 'error') => ({
  type: SET_STATUS,
  payload: status,
});

export const setError = (error: string | null) => ({
  type: SET_ERROR,
  payload: error,
});

export const startEditing = (rowId: string) => ({
  type: START_EDITING,
  payload: rowId,
});

export const updateDraft = (rowId: string, field: string, value: string | number) => ({
  type: UPDATE_DRAFT,
  payload: { rowId, field, value },
});

export const saveDraft = (rowId: string) => ({
  type: SAVE_DRAFT,
  payload: rowId,
});

export const cancelEditing = (rowId: string) => ({
  type: CANCEL_EDITING,
  payload: rowId,
});

export const undoRow = (rowId: string) => ({
  type: UNDO_ROW,
  payload: rowId,
});

export const toggleRowSelection = (rowId: string) => ({
  type: TOGGLE_ROW_SELECTION,
  payload: rowId,
});

export const selectAllRows = (rowIds: string[]) => ({
  type: SELECT_ALL_ROWS,
  payload: rowIds,
});

export const deselectAllRows = () => ({
  type: DESELECT_ALL_ROWS,
});

export const bulkDelete = (rowIds: string[]) => ({
  type: BULK_DELETE,
  payload: rowIds,
});

/** Union type of all table actions — used to type the reducer */
export type TableAction =
  | ReturnType<typeof setRows>
  | ReturnType<typeof setStatus>
  | ReturnType<typeof setError>
  | ReturnType<typeof startEditing>
  | ReturnType<typeof updateDraft>
  | ReturnType<typeof saveDraft>
  | ReturnType<typeof cancelEditing>
  | ReturnType<typeof undoRow>
  | ReturnType<typeof toggleRowSelection>
  | ReturnType<typeof selectAllRows>
  | ReturnType<typeof deselectAllRows>
  | ReturnType<typeof bulkDelete>;
