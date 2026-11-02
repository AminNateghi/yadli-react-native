import { useMemo } from "react";
import { useServices } from "../service-repository";
import { useFuels } from "../fuel-repository";
import { useExpenses } from "../expense-repository";
import { useReminders } from "../reminder-repository";
import { getReminders } from "@/utils/service-reminders";

import { calculateGeneralStatistics, calculatePersianGeneralStatistics } from "./general-statistics";
import { calculateRefuelingStatistics, calculatePersianRefuelingStatistics } from "./refueling-statistics";
import { calculatePersianServicesStatistics, calculateServicesStatistics } from "./services-statistics";
import { calculateExpensesStatistics, calculatePersianExpensesStatistics } from "./expenses-statistics";
import { calculateDistanceStatistics, calculatePersianDistanceStatistics } from "./distance-statistics";
import { createAllCostRecords, createStatisticsPeriods, dateOf } from "./statistics-utils";
import {
  EMPTY_PERSIAN_STATISTICS,
  EMPTY_STATISTICS,
  type ExpenseRecord,
  type FuelRecord,
  type ServiceRecord,
  type Statistics,
  type PersianStatistics,
} from "./statistics-types";

export function useStatistics(): {
  statistics: Statistics;
  persianStatistics: PersianStatistics;
  totalReminders: number;
} {
  const { data: listOfServices } = useServices();
  const { data: listOfFuels } = useFuels();
  const { data: listOfExpenses } = useExpenses();
  const { data: listOfReminders } = useReminders();

  const totalReminders = useMemo(() => {
    if (
      !listOfReminders ||
      !listOfServices ||
      !listOfFuels ||
      !listOfExpenses
    ) {
      return 0;
    }

    return getReminders(listOfReminders, {
      services: listOfServices,
      fuels: listOfFuels,
      expense: listOfExpenses,
    }).filter((reminder) => reminder.urgency >= 0.8).length;
  }, [listOfReminders, listOfServices, listOfFuels, listOfExpenses]);

  const { statistics, persianStatistics } = useMemo(() => {
    if (!listOfExpenses || !listOfFuels || !listOfServices) {
      return {
        statistics: EMPTY_STATISTICS,
        persianStatistics: EMPTY_PERSIAN_STATISTICS,
      };
    }

    // The casts only describe the fields consumed by the calculators. The
    // repository records may contain additional application-specific fields.
    const fuels = listOfFuels as FuelRecord[];
    const services = listOfServices as ServiceRecord[];
    const expenses = listOfExpenses as ExpenseRecord[];
    const periods = createStatisticsPeriods();

    const refueling = calculateRefuelingStatistics(fuels, periods);
    const distance = calculateDistanceStatistics(fuels, services, expenses, periods);
    const allCosts = createAllCostRecords(fuels, services, expenses);

    const datedRecords = [
      ...fuels.map((record) => ({ date: dateOf(record.date) })),
      ...services.map((record) => ({ date: dateOf(record.date) })),
      ...expenses.map((record) => ({ date: dateOf(record.date) })),
    ].filter((record) => Number.isFinite(record.date.getTime()));
    const firstDate = datedRecords.length ? datedRecords.reduce((a, b) => a.date < b.date ? a : b).date : null;
    const lastDate = datedRecords.length ? datedRecords.reduce((a, b) => a.date > b.date ? a : b).date : null;
    const elapsedDays = firstDate && lastDate
      ? Math.max(1, (lastDate.getTime() - firstDate.getTime()) / (24 * 60 * 60 * 1000))
      : 0;

    const general = calculateGeneralStatistics(
      allCosts,
      distance.totalDistanceKm,
      elapsedDays,
      totalReminders,
      periods,
    );
    const serviceStats = calculateServicesStatistics(
      services,
      periods,
      distance.totalDistanceKm,
      elapsedDays,
    );
    const expenseStats = calculateExpensesStatistics(
      expenses,
      periods,
      distance.totalDistanceKm,
      elapsedDays,
    );

    return {
      statistics: {
        general,
        refueling,
        services: serviceStats,
        expenses: expenseStats,
        distance,
      },
      persianStatistics: {
        general: calculatePersianGeneralStatistics(allCosts, periods),
        refueling: calculatePersianRefuelingStatistics(fuels, periods),
        services: calculatePersianServicesStatistics(
          services,
          periods,
          distance.totalDistanceKm,
          elapsedDays,
        ),
        expenses: calculatePersianExpensesStatistics(
          expenses,
          periods,
          distance.totalDistanceKm,
          elapsedDays,
        ),
        distance: calculatePersianDistanceStatistics(fuels, services, expenses, periods),
      },
    };
  }, [listOfExpenses, listOfFuels, listOfServices, totalReminders]);

  return { totalReminders, statistics, persianStatistics };
}
