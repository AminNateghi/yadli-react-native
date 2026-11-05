import type { AllCostRecord } from "./statistics-utils";
import type {
  GeneralStatistics,
  PersianGeneralStatistics,
  StatisticsPeriods,
} from "./statistics-types";
import {
  isPersianMonth,
  isPersianYear,
  sumCostsInPeriod,
  sumPersianCosts,
} from "./statistics-utils";

export function calculateGeneralStatistics(
  allCosts: AllCostRecord[],
  totalDistanceKm: number,
  elapsedDays: number,
  totalReminders: number,
  periods: StatisticsPeriods,
): GeneralStatistics {
  const totalSpent = allCosts.reduce((total, record) => total + record.cost, 0);
  const elapsedMonths = elapsedDays / (365.2425 / 12);

  return {
    totalSpent,
    totalReminders,
    totalCostThisYear: sumCostsInPeriod(
      allCosts,
      periods.thisYear.start,
      periods.thisYear.end,
    ),
    totalCostPreviousYear: sumCostsInPeriod(
      allCosts,
      periods.previousYear.start,
      periods.previousYear.end,
    ),
    totalCostThisMonth: sumCostsInPeriod(
      allCosts,
      periods.thisMonth.start,
      periods.thisMonth.end,
    ),
    totalCostPreviousMonth: sumCostsInPeriod(
      allCosts,
      periods.previousMonth.start,
      periods.previousMonth.end,
    ),
    averageCostPerKilometer:
      totalDistanceKm > 0 ? totalSpent / totalDistanceKm : 0,
    averageCostPerDay: elapsedDays > 0 ? totalSpent / elapsedDays : 0,
    averageCostPerMonth: elapsedMonths > 0 ? totalSpent / elapsedMonths : 0,
  };
}

export function calculatePersianGeneralStatistics(
  allCosts: AllCostRecord[],
  periods: StatisticsPeriods,
): PersianGeneralStatistics {
  const { year, month } = periods.persian;
  const previous = periods.previousPersianMonth;
  return {
    year,
    month,
    totalCostThisYear: sumPersianCosts(allCosts, (date) =>
      isPersianYear(date, year),
    ),
    totalCostPreviousYear: sumPersianCosts(allCosts, (date) =>
      isPersianYear(date, year - 1),
    ),
    totalCostThisMonth: sumPersianCosts(allCosts, (date) =>
      isPersianMonth(date, year, month),
    ),
    totalCostPreviousMonth: sumPersianCosts(allCosts, (date) =>
      isPersianMonth(date, previous.year, previous.month),
    ),
  };
}
