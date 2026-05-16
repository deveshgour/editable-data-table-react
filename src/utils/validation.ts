/**
 * Validation utilities for inline cell editing.
 * Provides email, numeric, and required-field validation
 * with user-friendly error messages.
 */

import { EmployeeRow, ValidationResult, ValidationError } from '@/types';

/* ──────────────────────── Individual Validators ──────────────────────── */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateRequired(value: unknown, fieldName: string): ValidationError | null {
  if (value === null || value === undefined || String(value).trim() === '') {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  return null;
}

export function validateEmail(value: string): ValidationError | null {
  if (!value || value.trim() === '') {
    return { field: 'email', message: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(value.trim())) {
    return { field: 'email', message: 'Invalid email format' };
  }
  return null;
}

export function validateNumeric(
  value: unknown,
  fieldName: string,
  options: { min?: number; max?: number; integer?: boolean } = {}
): ValidationError | null {
  const num = Number(value);

  if (value === '' || value === null || value === undefined || isNaN(num)) {
    return { field: fieldName, message: `${fieldName} must be a valid number` };
  }

  if (options.integer && !Number.isInteger(num)) {
    return { field: fieldName, message: `${fieldName} must be a whole number` };
  }

  if (options.min !== undefined && num < options.min) {
    return { field: fieldName, message: `${fieldName} must be at least ${options.min}` };
  }

  if (options.max !== undefined && num > options.max) {
    return { field: fieldName, message: `${fieldName} must be at most ${options.max}` };
  }

  return null;
}

/* ──────────────────────── Row-Level Validation ──────────────────────── */

/**
 * Validates an entire employee row, returning all errors.
 * Used before committing a draft edit to the store.
 */
export function validateRow(row: Partial<EmployeeRow>): ValidationResult {
  const errors: ValidationError[] = [];

  /* Name — required, non-empty */
  const nameErr = validateRequired(row.name, 'Name');
  if (nameErr) errors.push(nameErr);

  /* Email — required + format */
  const emailErr = validateEmail(row.email || '');
  if (emailErr) errors.push(emailErr);

  /* Department — required */
  const deptErr = validateRequired(row.department, 'Department');
  if (deptErr) errors.push(deptErr);

  /* Salary — numeric, positive */
  const salaryErr = validateNumeric(row.salary, 'Salary', { min: 0 });
  if (salaryErr) errors.push(salaryErr);

  /* Quantity — numeric, non-negative integer */
  const qtyErr = validateNumeric(row.quantity, 'Quantity', { min: 0, integer: true });
  if (qtyErr) errors.push(qtyErr);

  /* Experience — numeric, 0-50 range */
  const expErr = validateNumeric(row.experience, 'Experience', { min: 0, max: 50 });
  if (expErr) errors.push(expErr);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a single field value.
 * Returns an error message string or null if valid.
 */
export function validateField(field: string, value: string | number): string | null {
  switch (field) {
    case 'name':
    case 'department': {
      const err = validateRequired(value, field);
      return err ? err.message : null;
    }
    case 'email': {
      const err = validateEmail(String(value));
      return err ? err.message : null;
    }
    case 'salary': {
      const err = validateNumeric(value, 'Salary', { min: 0 });
      return err ? err.message : null;
    }
    case 'quantity': {
      const err = validateNumeric(value, 'Quantity', { min: 0, integer: true });
      return err ? err.message : null;
    }
    case 'experience': {
      const err = validateNumeric(value, 'Experience', { min: 0, max: 50 });
      return err ? err.message : null;
    }
    default:
      return null;
  }
}
