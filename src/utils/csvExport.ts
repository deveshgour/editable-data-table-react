/**
 * CSV export utility using PapaParse.
 * Exports filtered/selected rows as a downloadable CSV file.
 */

import Papa from 'papaparse';
import { EmployeeRow } from '@/types';

/**
 * Converts an array of employee rows to CSV and triggers a browser download.
 *
 * @param rows - Array of row data to export
 * @param filename - Download filename (default: 'data-export.csv')
 */
export function exportToCSV(
  rows: EmployeeRow[],
  filename: string = 'data-export.csv'
): void {
  if (rows.length === 0) return;

  /* Map rows to plain objects with formatted values */
  const data = rows.map((row) => ({
    ID: row.id,
    Name: row.name,
    Email: row.email,
    Department: row.department,
    Salary: row.salary,
    Quantity: row.quantity,
    'Experience (years)': row.experience,
    Status: row.status,
    'Created At': new Date(row.createdAt).toLocaleDateString(),
  }));

  const csv = Papa.unparse(data, {
    quotes: true,
    header: true,
    columns: ['ID', 'Name', 'Email', 'Department', 'Salary', 'Quantity', 'Experience (years)', 'Status', 'Created At'],
  });

  /* Trigger download */
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports selected rows from a record map given an array of IDs.
 */
export function exportSelectedToCSV(
  rowIds: string[],
  rows: Record<string, EmployeeRow>,
  filename?: string
): void {
  const selectedRows = rowIds.map((id) => rows[id]).filter(Boolean);
  exportToCSV(selectedRows, filename);
}
