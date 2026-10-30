import type {
  DistanceStatistics,
  ExpenseRecord,
  FuelRecord,
  PersianDistanceStatistics,
  ServiceRecord,
  StatisticsPeriods,
} from "./statistics-types";
import {
  DAY_MS,
  dateOf,
  inPeriod,
  isPersianMonth,
  isPersianYear,
} from "./statistics-utils";

type OdometerRecord = { date: Date; odometer: number };

function getOdometerRecords(
  fuels: FuelRecord[],
  services: ServiceRecord[],
  expenses: ExpenseRecord[],
): OdometerRecord[] {
  return [
    ...fuels.map((record) => ({
      date: dateOf(record.date),
      odometer: record.odometer,
    })),
    ...services.map((record) => ({
      date: dateOf(record.date),
      odometer: record.odometer,
    })),
    ...expenses.map((record) => ({
      date: dateOf(record.date),
      odometer: record.odometer,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());
}

function distanceFromRecords(records: OdometerRecord[]): number {
  if (records.length === 0) return 0;
  const values = records.map((record) => record.odometer);
  return Math.max(0, Math.max(...values) - Math.min(...values));
}

export function calculateDistanceStatistics(
  fuels: FuelRecord[],
  services: ServiceRecord[],
  expenses: ExpenseRecord[],
  periods: StatisticsPeriods,
): DistanceStatistics {
  const allRecords = getOdometerRecords(fuels, services, expenses);
  const validRecords = allRecords.filter((record) =>
    Number.isFinite(record.date.getTime()),
  );
  const totalDistanceKm = distanceFromRecords(allRecords);
  const firstDate = validRecords[0]?.date ?? null;
  const lastDate = validRecords[validRecords.length - 1]?.date ?? null;
  const elapsedDays =
    firstDate && lastDate
      ? Math.max(1, (lastDate.getTime() - firstDate.getTime()) / DAY_MS)
      : 0;
  const elapsedMonths = elapsedDays / (365.2425 / 12);
  const elapsedYears = elapsedDays / 365.2425;

  const distanceIn = (start: Date, end: Date) => {
    const records = validRecords.filter((record) =>
      inPeriod(record.date, start, end),
    );
    return records.length < 2 ? 0 : distanceFromRecords(records);
  };

  return {
    latestOdometer: allRecords.length
      ? Math.max(...allRecords.map((record) => record.odometer))
      : 0,
    totalDistanceKm,
    distanceThisYear: distanceIn(periods.thisYear.start, periods.thisYear.end),
    distancePreviousYear: distanceIn(
      periods.previousYear.start,
      periods.previousYear.end,
    ),
    distanceThisMonth: distanceIn(
      periods.thisMonth.start,
      periods.thisMonth.end,
    ),
    distancePreviousMonth: distanceIn(
      periods.previousMonth.start,
      periods.previousMonth.end,
    ),
    averageMileagePerDay: elapsedDays > 0 ? totalDistanceKm / elapsedDays : 0,
    averageMileagePerMonth:
      elapsedMonths > 0 ? totalDistanceKm / elapsedMonths : 0,
    averageMileagePerYear:
      elapsedYears > 0 ? totalDistanceKm / elapsedYears : 0,
  };
}

export function calculatePersianDistanceStatistics(
  fuels: FuelRecord[],
  services: ServiceRecord[],
  expenses: ExpenseRecord[],
  periods: StatisticsPeriods,
): PersianDistanceStatistics {
  const { year, month } = periods.persian;
  const previous = periods.previousPersianMonth;
  const records = getOdometerRecords(fuels, services, expenses).filter(
    (record) => Number.isFinite(record.date.getTime()),
  );
  const distanceIn = (predicate: (date: Date) => boolean) =>
    distanceFromRecords(records.filter((record) => predicate(record.date)));

  return {
    year,
    month,
    distanceThisYear: distanceIn((date) => isPersianYear(date, year)),
    distancePreviousYear: distanceIn((date) => isPersianYear(date, year - 1)),
    distanceThisMonth: distanceIn((date) => isPersianMonth(date, year, month)),
    distancePreviousMonth: distanceIn((date) =>
      isPersianMonth(date, previous.year, previous.month),
    ),
  };
}
