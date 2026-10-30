import type {
  DateValue,
  ExpenseRecord,
  FuelRecord,
  Period,
  ServiceRecord,
  StatisticsPeriods,
} from "./statistics-types";

export const DAY_MS = 24 * 60 * 60 * 1000;

export function dateOf(value: DateValue): Date {
  return value instanceof Date ? value : new Date(value);
}

export function periodBounds(year: number, month?: number): Period {
  const start = month === undefined
    ? new Date(year, 0, 1)
    : new Date(year, month, 1);
  const end = month === undefined
    ? new Date(year + 1, 0, 1)
    : new Date(year, month + 1, 1);
  return { start, end };
}

export function inPeriod(date: Date, start: Date, end: Date): boolean {
  const time = date.getTime();
  return Number.isFinite(time) && time >= start.getTime() && time < end.getTime();
}

export function sum<T>(items: T[], value: (item: T) => number): number {
  return items.reduce((total, item) => total + value(item), 0);
}

const persianDateFormatter = new Intl.DateTimeFormat(
  "en-US-u-ca-persian-nu-latn",
  { year: "numeric", month: "numeric" },
);

export function persianYearMonth(date: Date) {
  const parts = persianDateFormatter.formatToParts(date);
  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
  };
}

export function isPersianYear(date: Date, year: number): boolean {
  return persianYearMonth(date).year === year;
}

export function isPersianMonth(date: Date, year: number, month: number): boolean {
  const parts = persianYearMonth(date);
  return parts.year === year && parts.month === month;
}

export function previousPersianMonth(year: number, month: number) {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

export function createStatisticsPeriods(now = new Date()): StatisticsPeriods {
  const year = now.getFullYear();
  const month = now.getMonth();
  const persian = persianYearMonth(now);
  return {
    now,
    year,
    month,
    thisYear: periodBounds(year),
    previousYear: periodBounds(year - 1),
    thisMonth: periodBounds(year, month),
    previousMonth: periodBounds(year, month - 1),
    persian,
    previousPersianMonth: previousPersianMonth(persian.year, persian.month),
  };
}

export type AllCostRecord = { date: Date; cost: number };

export function createAllCostRecords(
  fuels: FuelRecord[],
  services: ServiceRecord[],
  expenses: ExpenseRecord[],
): AllCostRecord[] {
  return [
    ...fuels.map((record) => ({ date: dateOf(record.date), cost: record.totalCost })),
    ...services.map((record) => ({ date: dateOf(record.date), cost: record.cost })),
    ...expenses.map((record) => ({ date: dateOf(record.date), cost: record.amount })),
  ];
}

export function sumCostsInPeriod(
  records: AllCostRecord[],
  start: Date,
  end: Date,
): number {
  return sum(records.filter((record) => inPeriod(record.date, start, end)), (record) => record.cost);
}

export function sumPersianCosts(
  records: AllCostRecord[],
  predicate: (date: Date) => boolean,
): number {
  return sum(records.filter((record) => predicate(record.date)), (record) => record.cost);
}
