/**
 * Filtering utilities for global search and column-level filters.
 * Supports text substring search and numeric range filtering.
 */

import { EmployeeRow, ColumnFilter, TextColumnFilter, NumericColumnFilter } from '@/types';

/**
 * Applies a global search across all searchable fields of a row.
 * Returns true if any field contains the search term (case-insensitive).
 */
export function matchesGlobalSearch(row: EmployeeRow, searchTerm: string): boolean {
  if (!searchTerm.trim()) return true;

  const term = searchTerm.toLowerCase();
  const searchableValues = [
    row.id,
    row.name,
    row.email,
    row.department,
    String(row.salary),
    String(row.quantity),
    String(row.experience),
    row.status,
  ];

  return searchableValues.some((val) => val.toLowerCase().includes(term));
}

/**
 * Applies a single column filter to a row.
 * Supports text (substring) and numeric (min/max range) filter types.
 */
export function matchesColumnFilter(
  row: EmployeeRow,
  field: string,
  filter: ColumnFilter
): boolean {
  const value = row[field as keyof EmployeeRow];

  if (filter.type === 'text') {
    const textFilter = filter as TextColumnFilter;
    if (!textFilter.value.trim()) return true;
    return String(value).toLowerCase().includes(textFilter.value.toLowerCase());
  }

  if (filter.type === 'numeric') {
    const numFilter = filter as NumericColumnFilter;
    const numValue = Number(value);

    if (isNaN(numValue)) return false;
    if (numFilter.min !== null && numValue < numFilter.min) return false;
    if (numFilter.max !== null && numValue > numFilter.max) return false;
    return true;
  }

  return true;
}

/**
 * Filters an array of row IDs based on global search and column-level filters.
 * Returns a new array containing only the IDs of matching rows.
 *
 * @param rowIds - Array of row IDs to filter
 * @param rows - Record of all rows keyed by ID
 * @param globalSearch - Global search term
 * @param columnFilters - Column-specific filters
 * @returns Filtered array of row IDs
 */
export function filterRows(
  rowIds: string[],
  rows: Record<string, EmployeeRow>,
  globalSearch: string,
  columnFilters: Record<string, ColumnFilter>
): string[] {
  const activeFilters = Object.entries(columnFilters).filter(([, filter]) => {
    if (filter.type === 'text') return filter.value.trim() !== '';
    if (filter.type === 'numeric') return filter.min !== null || filter.max !== null;
    return false;
  });

  return rowIds.filter((id) => {
    const row = rows[id];
    if (!row) return false;

    /* Global search check */
    if (!matchesGlobalSearch(row, globalSearch)) return false;

    /* Column filter checks */
    for (const [field, filter] of activeFilters) {
      if (!matchesColumnFilter(row, field, filter)) return false;
    }

    return true;
  });
}
