/**
 * Multi-column sorting utility.
 * Supports ascending/descending on multiple fields with type-aware comparison.
 */

import { EmployeeRow, SortConfig } from '@/types';

/**
 * Compares two values with type awareness (string vs number vs date).
 * Returns negative, zero, or positive for sort ordering.
 */
function compareValues(a: unknown, b: unknown, field: string): number {
  /* Handle null/undefined */
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  /* Date fields */
  if (field === 'createdAt') {
    return new Date(a as string).getTime() - new Date(b as string).getTime();
  }

  /* Numeric comparison */
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  /* String comparison (case-insensitive) */
  return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
}

/**
 * Sorts an array of row IDs according to multiple sort configurations.
 * Sort configs are applied in order — the first config is the primary sort,
 * subsequent configs break ties.
 *
 * @param rowIds - Array of row IDs to sort
 * @param rows - Record of all rows keyed by ID
 * @param sortConfigs - Ordered array of sort configurations
 * @returns New sorted array of row IDs (does not mutate input)
 */
export function multiColumnSort(
  rowIds: string[],
  rows: Record<string, EmployeeRow>,
  sortConfigs: SortConfig[]
): string[] {
  if (sortConfigs.length === 0) return rowIds;

  return [...rowIds].sort((idA, idB) => {
    const rowA = rows[idA];
    const rowB = rows[idB];

    for (const config of sortConfigs) {
      const field = config.field as keyof EmployeeRow;
      const valA = rowA[field];
      const valB = rowB[field];
      const comparison = compareValues(valA, valB, config.field);

      if (comparison !== 0) {
        return config.direction === 'desc' ? -comparison : comparison;
      }
    }

    return 0;
  });
}
