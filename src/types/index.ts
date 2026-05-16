/**
 * Core TypeScript types for the Advanced Editable Data Table application.
 * All shared interfaces, enums, and type aliases are centralized here.
 */

/* ──────────────────────────── Employee Row ──────────────────────────── */

export interface EmployeeRow {
  id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  quantity: number;
  experience: number;
  status: EmployeeStatus;
  createdAt: string; // ISO 8601
}

export type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave' | 'Terminated';

/** Fields that can be edited inline */
export type EditableField = 'name' | 'email' | 'department' | 'salary' | 'quantity' | 'experience';

/* ──────────────────────────── Column Definition ──────────────────────────── */

export type ColumnType = 'text' | 'numeric' | 'status' | 'date' | 'actions' | 'selection';

export interface ColumnDefinition {
  field: string;
  headerName: string;
  type: ColumnType;
  width: number;
  minWidth?: number;
  editable: boolean;
  filterable: boolean;
  sortable: boolean;
}

/* ──────────────────────────── Filtering ──────────────────────────── */

export interface TextColumnFilter {
  type: 'text';
  value: string;
}

export interface NumericColumnFilter {
  type: 'numeric';
  min: number | null;
  max: number | null;
}

export type ColumnFilter = TextColumnFilter | NumericColumnFilter;

/* ──────────────────────────── Sorting ──────────────────────────── */

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

/* ──────────────────────────── Validation ──────────────────────────── */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/* ──────────────────────────── Redux State ──────────────────────────── */

export interface TableState {
  rows: Record<string, EmployeeRow>;
  rowIds: string[];
  editDrafts: Record<string, EmployeeRow>;
  editingRowIds: string[];
  selectedRowIds: string[];
  originalRows: Record<string, EmployeeRow>;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

export interface FilterState {
  globalSearch: string;
  columnFilters: Record<string, ColumnFilter>;
  sortConfig: SortConfig[];
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export interface UIState {
  themeMode: 'light' | 'dark';
  paginationMode: boolean;
  page: number;
  rowsPerPage: number;
  columnVisibility: Record<string, boolean>;
  snackbar: SnackbarState;
  filterPanelOpen: boolean;
}

export interface RootState {
  table: TableState;
  filter: FilterState;
  ui: UIState;
}

/* ──────────────────────────── Component Props ──────────────────────────── */

export interface TableRowData {
  rowIds: string[];
  rows: Record<string, EmployeeRow>;
  editDrafts: Record<string, EmployeeRow>;
  editingRowIds: string[];
  selectedRowIds: string[];
  columns: ColumnDefinition[];
  visibleColumns: ColumnDefinition[];
  onStartEditing: (id: string) => void;
  onCancelEditing: (id: string) => void;
  onSaveRow: (id: string) => void;
  onUndoRow: (id: string) => void;
  onUpdateDraft: (id: string, field: string, value: string | number) => void;
  onToggleSelection: (id: string) => void;
}
