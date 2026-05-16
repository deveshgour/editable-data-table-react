/**
 * Generates a realistic mock dataset of employee records.
 * Uses a seeded pseudo-random number generator for deterministic output,
 * ensuring consistent data across sessions for testing.
 */

import { EmployeeRow, EmployeeStatus } from '@/types';

/* ──────────────────────── Seed Data ──────────────────────── */

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Steven', 'Ashley',
  'Paul', 'Dorothy', 'Andrew', 'Kimberly', 'Joshua', 'Emily', 'Kenneth', 'Donna',
  'Kevin', 'Michelle', 'Brian', 'Carol', 'George', 'Amanda', 'Timothy', 'Melissa',
  'Ronald', 'Deborah', 'Edward', 'Stephanie', 'Jason', 'Rebecca', 'Jeffrey', 'Sharon',
  'Ryan', 'Laura', 'Jacob', 'Cynthia', 'Gary', 'Kathleen', 'Nicholas', 'Amy',
  'Eric', 'Angela', 'Jonathan', 'Shirley', 'Stephen', 'Anna', 'Larry', 'Brenda',
  'Justin', 'Pamela', 'Scott', 'Emma', 'Brandon', 'Nicole', 'Benjamin', 'Helen',
  'Raj', 'Priya', 'Amit', 'Sneha', 'Wei', 'Mei', 'Hiroshi', 'Yuki',
  'Carlos', 'Maria', 'Ahmed', 'Fatima', 'Olga', 'Dmitri', 'Sven', 'Ingrid',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
  'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
  'Mitchell', 'Carter', 'Roberts', 'Patel', 'Kumar', 'Singh', 'Chen', 'Wang',
  'Kim', 'Tanaka', 'Müller', 'Schmidt', 'Petrov', 'Ivanov', 'Johansson', 'Larsson',
];

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
  'Human Resources', 'Finance', 'Operations', 'Legal', 'Customer Support',
  'Data Science', 'DevOps', 'Quality Assurance', 'Research', 'Business Development',
];

const STATUSES: EmployeeStatus[] = ['Active', 'Inactive', 'On Leave', 'Terminated'];

const EMAIL_DOMAINS = [
  'company.com', 'corp.io', 'enterprise.co', 'workspace.dev', 'team.org',
];

/* ──────────────────────── Seeded RNG ──────────────────────── */

/**
 * Simple seeded pseudo-random number generator (Mulberry32).
 * Produces deterministic sequences for reproducible test data.
 */
function createSeededRng(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ──────────────────────── Generator ──────────────────────── */

/**
 * Generates a dataset of `count` employee rows with realistic data.
 * Default count: 10,000 rows. Uses a deterministic seed for consistency.
 */
export function generateMockData(count: number = 10000, seed: number = 42): EmployeeRow[] {
  const rng = createSeededRng(seed);

  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  const randomInt = (min: number, max: number): number =>
    Math.floor(rng() * (max - min + 1)) + min;

  const rows: EmployeeRow[] = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const name = `${firstName} ${lastName}`;

    /* Generate a unique email */
    let email: string;
    let attempt = 0;
    do {
      const suffix = attempt > 0 ? `${attempt}` : '';
      email = `${firstName.toLowerCase()}${suffix}.${lastName.toLowerCase()}@${pick(EMAIL_DOMAINS)}`;
      attempt++;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    const department = pick(DEPARTMENTS);
    const experience = randomInt(0, 30);
    const baseSalary = 35000 + experience * 3000;
    const salary = randomInt(baseSalary, baseSalary + 25000);
    const quantity = randomInt(1, 500);

    /* Weight statuses: 70% Active, 10% each for others */
    const statusRoll = rng();
    const status: EmployeeStatus =
      statusRoll < 0.7 ? 'Active' :
      statusRoll < 0.8 ? 'Inactive' :
      statusRoll < 0.9 ? 'On Leave' : 'Terminated';

    /* Random creation date in the past 5 years */
    const daysAgo = randomInt(1, 1825);
    const createdAt = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000
    ).toISOString();

    rows.push({
      id: `EMP-${String(i + 1).padStart(5, '0')}`,
      name,
      email,
      department,
      salary,
      quantity,
      experience,
      status,
      createdAt,
    });
  }

  return rows;
}

/**
 * Normalizes an array of rows into a Record keyed by id + an ordered id array.
 * Used for efficient O(1) lookups in the Redux store.
 */
export function normalizeRows(rows: EmployeeRow[]): {
  byId: Record<string, EmployeeRow>;
  allIds: string[];
} {
  const byId: Record<string, EmployeeRow> = {};
  const allIds: string[] = [];

  for (const row of rows) {
    byId[row.id] = row;
    allIds.push(row.id);
  }

  return { byId, allIds };
}
