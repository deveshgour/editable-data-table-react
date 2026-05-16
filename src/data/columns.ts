/**
 * Column definitions for the data table.
 * Each column specifies its field mapping, display properties,
 * and capabilities (editable, filterable, sortable).
 */

import { ColumnDefinition } from '@/types';

export const COLUMNS: ColumnDefinition[] = [
  {
    field: 'selection',
    headerName: '',
    type: 'selection',
    width: 50,
    editable: false,
    filterable: false,
    sortable: false,
  },
  {
    field: 'id',
    headerName: 'ID',
    type: 'text',
    width: 90,
    editable: false,
    filterable: false,
    sortable: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    type: 'text',
    width: 180,
    editable: true,
    filterable: true,
    sortable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    type: 'text',
    width: 240,
    editable: true,
    filterable: true,
    sortable: true,
  },
  {
    field: 'department',
    headerName: 'Department',
    type: 'text',
    width: 150,
    editable: true,
    filterable: true,
    sortable: true,
  },
  {
    field: 'salary',
    headerName: 'Salary',
    type: 'numeric',
    width: 130,
    editable: true,
    filterable: true,
    sortable: true,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'numeric',
    width: 110,
    editable: true,
    filterable: true,
    sortable: true,
  },
  {
    field: 'experience',
    headerName: 'Experience (yrs)',
    type: 'numeric',
    width: 140,
    editable: true,
    filterable: true,
    sortable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    type: 'status',
    width: 120,
    editable: false,
    filterable: true,
    sortable: true,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    type: 'date',
    width: 140,
    editable: false,
    filterable: false,
    sortable: true,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    type: 'actions',
    width: 160,
    editable: false,
    filterable: false,
    sortable: false,
  },
];

/** Total width of all columns */
export const TOTAL_TABLE_WIDTH = COLUMNS.reduce((sum, col) => sum + col.width, 0);

/** Default visible columns — all visible by default */
export const DEFAULT_COLUMN_VISIBILITY: Record<string, boolean> = COLUMNS.reduce(
  (acc, col) => {
    acc[col.field] = true;
    return acc;
  },
  {} as Record<string, boolean>
);

/** Row height for virtualized table */
export const ROW_HEIGHT = 52;

/** Header height */
export const HEADER_HEIGHT = 56;
