/**
 * Table reducer — manages employee row data, edit drafts, selection,
 * and undo state using manual immutable spread-based updates.
 */

import { TableState, EmployeeRow } from '@/types';
import { TableAction } from '../actions/tableActions';
import {
  SET_ROWS, SET_STATUS, SET_ERROR,
  START_EDITING, UPDATE_DRAFT, SAVE_DRAFT, CANCEL_EDITING, UNDO_ROW,
  TOGGLE_ROW_SELECTION, SELECT_ALL_ROWS, DESELECT_ALL_ROWS, BULK_DELETE,
} from '../actionTypes/tableActionTypes';

const initialState: TableState = {
  rows: {},
  rowIds: [],
  editDrafts: {},
  editingRowIds: [],
  selectedRowIds: [],
  originalRows: {},
  status: 'idle',
  error: null,
};

export default function tableReducer(
  state: TableState = initialState,
  action: TableAction
): TableState {
  switch (action.type) {
    /* ─── Data Loading ─── */
    case SET_ROWS:
      return {
        ...state,
        rows: action.payload.rows,
        rowIds: action.payload.rowIds,
        status: 'idle',
        error: null,
      };

    case SET_STATUS:
      return { ...state, status: action.payload };

    case SET_ERROR:
      return { ...state, error: action.payload, status: 'error' };

    /* ─── Editing Lifecycle ─── */
    case START_EDITING: {
      const rowId = action.payload;
      const row = state.rows[rowId];
      if (!row || state.editingRowIds.includes(rowId)) return state;

      return {
        ...state,
        editingRowIds: [...state.editingRowIds, rowId],
        editDrafts: { ...state.editDrafts, [rowId]: { ...row } },
        originalRows: { ...state.originalRows, [rowId]: { ...row } },
      };
    }

    case UPDATE_DRAFT: {
      const { rowId, field, value } = action.payload;
      const draft = state.editDrafts[rowId];
      if (!draft) return state;

      return {
        ...state,
        editDrafts: {
          ...state.editDrafts,
          [rowId]: { ...draft, [field]: value },
        },
      };
    }

    case SAVE_DRAFT: {
      const rowId = action.payload;
      const draft = state.editDrafts[rowId];
      if (!draft) return state;

      /* Commit the draft to main rows */
      const newEditDrafts = { ...state.editDrafts };
      delete newEditDrafts[rowId];

      return {
        ...state,
        rows: { ...state.rows, [rowId]: { ...draft } },
        editDrafts: newEditDrafts,
        editingRowIds: state.editingRowIds.filter((id) => id !== rowId),
      };
    }

    case CANCEL_EDITING: {
      const rowId = action.payload;
      const newEditDrafts = { ...state.editDrafts };
      delete newEditDrafts[rowId];
      const newOriginalRows = { ...state.originalRows };
      delete newOriginalRows[rowId];

      return {
        ...state,
        editDrafts: newEditDrafts,
        originalRows: newOriginalRows,
        editingRowIds: state.editingRowIds.filter((id) => id !== rowId),
      };
    }

    case UNDO_ROW: {
      const rowId = action.payload;
      const original = state.originalRows[rowId];
      if (!original) return state;

      const newOriginalRows = { ...state.originalRows };
      delete newOriginalRows[rowId];
      const newEditDrafts = { ...state.editDrafts };
      delete newEditDrafts[rowId];

      return {
        ...state,
        rows: { ...state.rows, [rowId]: { ...original } },
        originalRows: newOriginalRows,
        editDrafts: newEditDrafts,
        editingRowIds: state.editingRowIds.filter((id) => id !== rowId),
      };
    }

    /* ─── Selection ─── */
    case TOGGLE_ROW_SELECTION: {
      const rowId = action.payload;
      const isSelected = state.selectedRowIds.includes(rowId);

      return {
        ...state,
        selectedRowIds: isSelected
          ? state.selectedRowIds.filter((id) => id !== rowId)
          : [...state.selectedRowIds, rowId],
      };
    }

    case SELECT_ALL_ROWS:
      return { ...state, selectedRowIds: [...action.payload] };

    case DESELECT_ALL_ROWS:
      return { ...state, selectedRowIds: [] };

    /* ─── Bulk Operations ─── */
    case BULK_DELETE: {
      const idsToDelete = new Set(action.payload);
      const newRows = { ...state.rows };
      const newEditDrafts = { ...state.editDrafts };
      const newOriginalRows = { ...state.originalRows };

      for (const id of action.payload) {
        delete newRows[id];
        delete newEditDrafts[id];
        delete newOriginalRows[id];
      }

      return {
        ...state,
        rows: newRows,
        rowIds: state.rowIds.filter((id) => !idsToDelete.has(id)),
        editDrafts: newEditDrafts,
        originalRows: newOriginalRows,
        editingRowIds: state.editingRowIds.filter((id) => !idsToDelete.has(id)),
        selectedRowIds: [],
      };
    }

    default:
      return state;
  }
}
