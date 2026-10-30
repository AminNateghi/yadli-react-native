import type {
  ExpenseRecord,
  ExpensesStatistics,
  PersianExpensesStatistics,
  StatisticsPeriods,
} from "./statistics-types";
import {
  dateOf,
  inPeriod,
  isPersianMonth,
  isPersianYear,
  sum,
} from "./statistics-utils";

export function calculateExpensesStatistics(
  expenses: ExpenseRecord[],
  periods: StatisticsPeriods,
  totalDistanceKm: number,
  elapsedDays: number,
): ExpensesStatistics {
  const amounts = expenses.map((record) => record.amount);
  const elapsedMonths = elapsedDays / (365.2425 / 12);
  const totalExpenses = sum(expenses, (record) => record.amount);

  const expenseIn = (period: { start: Date; end: Date }) =>
    expenses.filter((record) =>
      inPeriod(dateOf(record.date), period.start, period.end),
    );

  const costsIn = (start: Date, end: Date) =>
    sum(
      expenses.filter((record) => inPeriod(dateOf(record.date), start, end)),
      (record) => record.amount,
    );

  return {
    totalExpenses,
    expenseRecordsLength: expenses.length,
    lengthThisYear: expenseIn(periods.thisYear).length,
    lengthPreviousYear: expenseIn(periods.previousYear).length,
    lengthThisMonth: expenseIn(periods.thisMonth).length,
    lengthPreviousMonth: expenseIn(periods.previousMonth).length,
    expenseCostThisYear: costsIn(periods.thisYear.start, periods.thisYear.end),
    expenseCostPreviousYear: costsIn(
      periods.previousYear.start,
      periods.previousYear.end,
    ),
    expenseCostThisMonth: costsIn(
      periods.thisMonth.start,
      periods.thisMonth.end,
    ),
    expenseCostPreviousMonth: costsIn(
      periods.previousMonth.start,
      periods.previousMonth.end,
    ),
    minExpenseAmount: amounts.length ? Math.min(...amounts) : 0,
    maxExpenseAmount: amounts.length ? Math.max(...amounts) : 0,
    averageCostPerKilometer:
      totalDistanceKm > 0 ? totalExpenses / totalDistanceKm : 0,
    averageCostPerDay: elapsedDays > 0 ? totalExpenses / elapsedDays : 0,
    averageCostPerMonth: elapsedMonths > 0 ? totalExpenses / elapsedMonths : 0,
  };
}

export function calculatePersianExpensesStatistics(
  expenses: ExpenseRecord[],
  periods: StatisticsPeriods,
  totalDistanceKm: number,
  elapsedDays: number,
): PersianExpensesStatistics {
  const { year, month } = periods.persian;
  const previous = periods.previousPersianMonth;
  const amounts = expenses.map((record) => record.amount);
  const elapsedMonths = elapsedDays / (365.2425 / 12);
  const totalExpenses = sum(expenses, (record) => record.amount);
  const costsInPersianYear = (targetYear: number) =>
    sum(
      expenses.filter((record) =>
        isPersianYear(dateOf(record.date), targetYear),
      ),
      (record) => record.amount,
    );
  const costsInPersianMonth = (targetYear: number, targetMonth: number) =>
    sum(
      expenses.filter((record) =>
        isPersianMonth(dateOf(record.date), targetYear, targetMonth),
      ),
      (record) => record.amount,
    );

  const inYear = (record: ExpenseRecord, targetYear: number) =>
    isPersianYear(dateOf(record.date), targetYear);
  const inMonth = (
    record: ExpenseRecord,
    targetYear: number,
    targetMonth: number,
  ) => isPersianMonth(dateOf(record.date), targetYear, targetMonth);
  const thisYear = expenses.filter((record) => inYear(record, year));
  const previousYear = expenses.filter((record) => inYear(record, year - 1));
  const thisMonth = expenses.filter((record) => inMonth(record, year, month));
  const previousMonth = expenses.filter((record) =>
    inMonth(
      record,
      periods.previousPersianMonth.year,
      periods.previousPersianMonth.month,
    ),
  );

  return {
    year,
    month,
    totalExpenses,
    expenseRecordsLength: expenses.length,
    lengthThisYear: thisYear.length,
    lengthPreviousYear: previousYear.length,
    lengthThisMonth: thisMonth.length,
    lengthPreviousMonth: previousMonth.length,
    expenseCostThisYear: costsInPersianYear(year),
    expenseCostPreviousYear: costsInPersianYear(year - 1),
    expenseCostThisMonth: costsInPersianMonth(year, month),
    expenseCostPreviousMonth: costsInPersianMonth(
      previous.year,
      previous.month,
    ),
    minExpenseAmount: amounts.length ? Math.min(...amounts) : 0,
    maxExpenseAmount: amounts.length ? Math.max(...amounts) : 0,
    averageCostPerKilometer:
      totalDistanceKm > 0 ? totalExpenses / totalDistanceKm : 0,
    averageCostPerDay: elapsedDays > 0 ? totalExpenses / elapsedDays : 0,
    averageCostPerMonth: elapsedMonths > 0 ? totalExpenses / elapsedMonths : 0,
  };
}
