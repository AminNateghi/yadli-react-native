import type {
  PersianServicesStatistics,
  ServiceRecord,
  ServicesStatistics,
  StatisticsPeriods,
} from "./statistics-types";
import {
  dateOf,
  inPeriod,
  isPersianMonth,
  isPersianYear,
  sum,
} from "./statistics-utils";

export function calculateServicesStatistics(
  services: ServiceRecord[],
  periods: StatisticsPeriods,
  totalDistanceKm: number,
  elapsedDays: number,
): ServicesStatistics {
  const amounts = services.map((record) => record.cost);
  const elapsedMonths = elapsedDays / (365.2425 / 12);
  const totalServiceCost = sum(services, (record) => record.cost);

  const serviceIn = (period: { start: Date; end: Date }) =>
    services.filter((record) =>
      inPeriod(dateOf(record.date), period.start, period.end),
    );

  const costsIn = (start: Date, end: Date) =>
    sum(
      services.filter((record) => inPeriod(dateOf(record.date), start, end)),
      (record) => record.cost,
    );

  return {
    totalServiceCost,
    serviceRecordsLength: services.length,
    lengthThisYear: serviceIn(periods.thisYear).length,
    lengthPreviousYear: serviceIn(periods.previousYear).length,
    lengthThisMonth: serviceIn(periods.thisMonth).length,
    lengthPreviousMonth: serviceIn(periods.previousMonth).length,

    serviceCostThisYear: costsIn(periods.thisYear.start, periods.thisYear.end),
    serviceCostPreviousYear: costsIn(
      periods.previousYear.start,
      periods.previousYear.end,
    ),
    serviceCostThisMonth: costsIn(
      periods.thisMonth.start,
      periods.thisMonth.end,
    ),
    serviceCostPreviousMonth: costsIn(
      periods.previousMonth.start,
      periods.previousMonth.end,
    ),
    minServiceAmount: amounts.length ? Math.min(...amounts) : 0,
    maxServiceAmount: amounts.length ? Math.max(...amounts) : 0,
    averageCostPerKilometer:
      totalDistanceKm > 0 ? totalServiceCost / totalDistanceKm : 0,
    averageCostPerDay: elapsedDays > 0 ? totalServiceCost / elapsedDays : 0,
    averageCostPerMonth:
      elapsedMonths > 0 ? totalServiceCost / elapsedMonths : 0,
  };
}

export function calculatePersianServicesStatistics(
  services: ServiceRecord[],
  periods: StatisticsPeriods,
  totalDistanceKm: number,
  elapsedDays: number,
): PersianServicesStatistics {
  const { year, month } = periods.persian;
  const previous = periods.previousPersianMonth;
  const amounts = services.map((record) => record.cost);
  const elapsedMonths = elapsedDays / (365.2425 / 12);
  const totalServiceCost = sum(services, (record) => record.cost);
  const costsInPersianYear = (targetYear: number) =>
    sum(
      services.filter((record) =>
        isPersianYear(dateOf(record.date), targetYear),
      ),
      (record) => record.cost,
    );
  const costsInPersianMonth = (targetYear: number, targetMonth: number) =>
    sum(
      services.filter((record) =>
        isPersianMonth(dateOf(record.date), targetYear, targetMonth),
      ),
      (record) => record.cost,
    );

  const inYear = (record: ServiceRecord, targetYear: number) =>
    isPersianYear(dateOf(record.date), targetYear);
  const inMonth = (
    record: ServiceRecord,
    targetYear: number,
    targetMonth: number,
  ) => isPersianMonth(dateOf(record.date), targetYear, targetMonth);
  const thisYear = services.filter((record) => inYear(record, year));
  const previousYear = services.filter((record) => inYear(record, year - 1));
  const thisMonth = services.filter((record) => inMonth(record, year, month));
  const previousMonth = services.filter((record) =>
    inMonth(
      record,
      periods.previousPersianMonth.year,
      periods.previousPersianMonth.month,
    ),
  );

  return {
    year,
    month,
    totalServiceCost,
    lengthThisYear: thisYear.length,
    lengthPreviousYear: previousYear.length,
    lengthThisMonth: thisMonth.length,
    lengthPreviousMonth: previousMonth.length,
    serviceRecordsLength: services.length,
    serviceCostThisYear: costsInPersianYear(year),
    serviceCostPreviousYear: costsInPersianYear(year - 1),
    serviceCostThisMonth: costsInPersianMonth(year, month),
    serviceCostPreviousMonth: costsInPersianMonth(
      previous.year,
      previous.month,
    ),
    minServiceAmount: amounts.length ? Math.min(...amounts) : 0,
    maxServiceAmount: amounts.length ? Math.max(...amounts) : 0,
    averageCostPerKilometer:
      totalDistanceKm > 0 ? totalServiceCost / totalDistanceKm : 0,
    averageCostPerDay: elapsedDays > 0 ? totalServiceCost / elapsedDays : 0,
    averageCostPerMonth:
      elapsedMonths > 0 ? totalServiceCost / elapsedMonths : 0,
  };
}
