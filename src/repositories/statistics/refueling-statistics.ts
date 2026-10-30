import type {
  FuelConsumptionRecord,
  FuelRecord,
  PersianRefuelingStatistics,
  RefuelingStatistics,
  StatisticsPeriods,
} from "./statistics-types";
import { dateOf, isPersianMonth, isPersianYear, inPeriod, sum } from "./statistics-utils";

export function calculateRefuelingStatistics(
  fuels: FuelRecord[],
  periods: StatisticsPeriods,
): RefuelingStatistics {
  const sortedFuels = [...fuels].sort(
    (a, b) => dateOf(a.date).getTime() - dateOf(b.date).getTime(),
  );
  const consumptionRecords: FuelConsumptionRecord[] = [];

  for (let index = 1; index < sortedFuels.length; index++) {
    const previous = sortedFuels[index - 1];
    const current = sortedFuels[index];
    const distanceKm = current.odometer - previous.odometer;

    if (previous.fullTank && current.fullTank && distanceKm > 0 && current.liters > 0) {
      consumptionRecords.push({
        fromDate: dateOf(previous.date),
        toDate: dateOf(current.date),
        distanceKm,
        liters: current.liters,
        kmPerLiter: distanceKm / current.liters,
      });
    }
  }

  const totalConsumptionDistance = sum(consumptionRecords, (record) => record.distanceKm);
  const totalConsumptionLiters = sum(consumptionRecords, (record) => record.liters);
  const averageLiterPerKm = totalConsumptionLiters > 0
    ? Number((totalConsumptionDistance / totalConsumptionLiters).toFixed(2))
    : 0;

  const consumptionValues = consumptionRecords.map((record) => record.kmPerLiter);
  const liters = fuels.map((record) => record.liters);
  const prices = fuels.map((record) => record.pricePerLiter);
  const fuelsIn = (period: { start: Date; end: Date }) =>
    fuels.filter((record) => inPeriod(dateOf(record.date), period.start, period.end));
  const thisYear = fuelsIn(periods.thisYear);
  const previousYear = fuelsIn(periods.previousYear);
  const thisMonth = fuelsIn(periods.thisMonth);
  const previousMonth = fuelsIn(periods.previousMonth);

  return {
    totalFillUps: fuels.length,
    totalGas: sum(fuels, (record) => record.liters),
    totalFuelCost: sum(fuels, (record) => record.totalCost),
    fillUpsThisYear: thisYear.length,
    fillUpsPreviousYear: previousYear.length,
    fillUpsThisMonth: thisMonth.length,
    fillUpsPreviousMonth: previousMonth.length,
    gasThisYear: sum(thisYear, (record) => record.liters),
    gasPreviousYear: sum(previousYear, (record) => record.liters),
    gasThisMonth: sum(thisMonth, (record) => record.liters),
    gasPreviousMonth: sum(previousMonth, (record) => record.liters),
    // These four fields preserve the original implementation: they are total
    // fuel spend for the period (liters multiplied by unit price), not averages.
    gasPriceThisYear: sum(thisYear, (record) => record.liters * record.pricePerLiter),
    gasPricePreviousYear: sum(previousYear, (record) => record.liters * record.pricePerLiter),
    gasPriceThisMonth: sum(thisMonth, (record) => record.liters * record.pricePerLiter),
    gasPricePreviousMonth: sum(previousMonth, (record) => record.liters * record.pricePerLiter),
    minFillUpLiter: fuels.length ? Math.min(...liters) : 0,
    maxFillUpLiter: fuels.length ? Math.max(...liters) : 0,
    bestGasPrice: fuels.length ? Math.min(...prices) : 0,
    worstGasPrice: fuels.length ? Math.max(...prices) : 0,
    averageLiterPerKm,
    // Preserved exactly from the existing implementation.
    bestFuelConsumption: consumptionValues.length ? Number(Math.min(...consumptionValues).toFixed(2)) : 0,
    worstFuelConsumption: consumptionValues.length ? Number(Math.max(...consumptionValues).toFixed(2)) : 0,
  };
}

export function calculatePersianRefuelingStatistics(
  fuels: FuelRecord[],
  periods: StatisticsPeriods,
): PersianRefuelingStatistics {
  const { year, month } = periods.persian;
  const previous = periods.previousPersianMonth;
  const inYear = (record: FuelRecord, targetYear: number) => isPersianYear(dateOf(record.date), targetYear);
  const inMonth = (record: FuelRecord, targetYear: number, targetMonth: number) =>
    isPersianMonth(dateOf(record.date), targetYear, targetMonth);
  const thisYear = fuels.filter((record) => inYear(record, year));
  const previousYear = fuels.filter((record) => inYear(record, year - 1));
  const thisMonth = fuels.filter((record) => inMonth(record, year, month));
  const previousMonth = fuels.filter((record) => inMonth(record, previous.year, previous.month));

  return {
    year,
    month,
    fillUpsThisYear: thisYear.length,
    fillUpsPreviousYear: previousYear.length,
    fillUpsThisMonth: thisMonth.length,
    fillUpsPreviousMonth: previousMonth.length,
    gasThisYear: sum(thisYear, (record) => record.liters),
    gasPreviousYear: sum(previousYear, (record) => record.liters),
    gasThisMonth: sum(thisMonth, (record) => record.liters),
    gasPreviousMonth: sum(previousMonth, (record) => record.liters),
    gasPriceThisMonth: sum(thisMonth, (record) => record.liters * record.pricePerLiter),
    gasPricePreviousMonth: sum(previousMonth, (record) => record.liters * record.pricePerLiter),
    gasPriceThisYear: sum(thisYear, (record) => record.liters * record.pricePerLiter),
    gasPricePreviousYear: sum(previousYear, (record) => record.liters * record.pricePerLiter),
  };
}
