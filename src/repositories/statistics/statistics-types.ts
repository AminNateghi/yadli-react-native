export type DateValue = Date | number | string;

export type FuelRecord = {
  date: DateValue;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  fullTank: boolean;
};

export type ServiceRecord = {
  date: DateValue;
  odometer: number;
  cost: number;
};

export type ExpenseRecord = {
  date: DateValue;
  odometer: number;
  amount: number;
};

export type FuelConsumptionRecord = {
  fromDate: Date;
  toDate: Date;
  distanceKm: number;
  liters: number;
  kmPerLiter: number;
};

export type RefuelingInterval = {
  fromDate: Date;
  toDate: Date;
  fromOdometer: number;
  toOdometer: number;
  distanceKm: number;
  fuelConsumptionLPer100Km: number | null;
};

export type Period = { start: Date; end: Date };

export type StatisticsPeriods = {
  now: Date;
  year: number;
  month: number;
  thisYear: Period;
  previousYear: Period;
  thisMonth: Period;
  previousMonth: Period;
  persian: { year: number; month: number };
  previousPersianMonth: { year: number; month: number };
};

export type GeneralStatistics = {
  totalSpent: number;
  totalReminders: number;
  totalCostThisYear: number;
  totalCostPreviousYear: number;
  totalCostThisMonth: number;
  totalCostPreviousMonth: number;
  averageCostPerKilometer: number;
  averageCostPerDay: number;
  averageCostPerMonth: number;
};

export type RefuelingStatistics = {
  totalFillUps: number;
  totalGas: number;
  totalFuelCost: number;
  fillUpsThisYear: number;
  fillUpsPreviousYear: number;
  fillUpsThisMonth: number;
  fillUpsPreviousMonth: number;
  gasThisYear: number;
  gasPreviousYear: number;
  gasThisMonth: number;
  gasPreviousMonth: number;
  gasPriceThisMonth: number;
  gasPricePreviousMonth: number;
  gasPriceThisYear: number;
  gasPricePreviousYear: number;
  minFillUpLiter: number;
  maxFillUpLiter: number;
  bestGasPrice: number;
  worstGasPrice: number;
  averageLiterPerKm: number;
  bestFuelConsumption: number;
  worstFuelConsumption: number;
  refuelingIntervals: RefuelingInterval[];
  daysUntilNextRefueling: number | null;
};

export type ServicesStatistics = {
  totalServiceCost: number;
  serviceRecordsLength: number;
  lengthThisYear: number;
  lengthPreviousYear: number;
  lengthThisMonth: number;
  lengthPreviousMonth: number;
  serviceCostThisYear: number;
  serviceCostPreviousYear: number;
  serviceCostThisMonth: number;
  serviceCostPreviousMonth: number;
  minServiceAmount: number;
  maxServiceAmount: number;
  averageCostPerKilometer: number;
  averageCostPerDay: number;
  averageCostPerMonth: number;
};

export type ExpensesStatistics = {
  totalExpenses: number;
  expenseRecordsLength: number;
  lengthThisYear: number;
  lengthPreviousYear: number;
  lengthThisMonth: number;
  lengthPreviousMonth: number;
  expenseCostThisYear: number;
  expenseCostPreviousYear: number;
  expenseCostThisMonth: number;
  expenseCostPreviousMonth: number;
  minExpenseAmount: number;
  maxExpenseAmount: number;
  averageCostPerKilometer: number;
  averageCostPerDay: number;
  averageCostPerMonth: number;
};

export type PersianServicesStatistics = ServicesStatistics & {
  year: number;
  month: number;
};

export type PersianExpensesStatistics = ExpensesStatistics & {
  year: number;
  month: number;
};

export type DistanceStatistics = {
  latestOdometer: number;
  totalDistanceKm: number;
  distanceThisYear: number;
  distancePreviousYear: number;
  distanceThisMonth: number;
  distancePreviousMonth: number;
  averageMileagePerDay: number;
  averageMileagePerMonth: number;
  averageMileagePerYear: number;
};

export type Statistics = {
  general: GeneralStatistics;
  refueling: RefuelingStatistics;
  services: ServicesStatistics;
  expenses: ExpensesStatistics;
  distance: DistanceStatistics;
};

export type PersianGeneralStatistics = {
  year: number;
  month: number;
  totalCostThisYear: number;
  totalCostPreviousYear: number;
  totalCostThisMonth: number;
  totalCostPreviousMonth: number;
};

export type PersianRefuelingStatistics = {
  year: number;
  month: number;
  fillUpsThisYear: number;
  fillUpsPreviousYear: number;
  fillUpsThisMonth: number;
  fillUpsPreviousMonth: number;
  gasThisYear: number;
  gasPreviousYear: number;
  gasThisMonth: number;
  gasPreviousMonth: number;
  gasPriceThisMonth: number;
  gasPricePreviousMonth: number;
  gasPriceThisYear: number;
  gasPricePreviousYear: number;
};

export type PersianDistanceStatistics = {
  year: number;
  month: number;
  distanceThisYear: number;
  distancePreviousYear: number;
  distanceThisMonth: number;
  distancePreviousMonth: number;
};

export type PersianStatistics = {
  general: PersianGeneralStatistics;
  refueling: PersianRefuelingStatistics;
  services: PersianServicesStatistics;
  expenses: PersianExpensesStatistics;
  distance: PersianDistanceStatistics;
};

export const EMPTY_STATISTICS: Statistics = {
  general: {
    totalSpent: 0,
    totalReminders: 0,
    totalCostThisYear: 0,
    totalCostPreviousYear: 0,
    totalCostThisMonth: 0,
    totalCostPreviousMonth: 0,
    averageCostPerKilometer: 0,
    averageCostPerDay: 0,
    averageCostPerMonth: 0,
  },
  refueling: {
    totalFillUps: 0,
    totalGas: 0,
    totalFuelCost: 0,
    fillUpsThisYear: 0,
    fillUpsPreviousYear: 0,
    fillUpsThisMonth: 0,
    fillUpsPreviousMonth: 0,
    gasThisYear: 0,
    gasPreviousYear: 0,
    gasThisMonth: 0,
    gasPreviousMonth: 0,
    gasPriceThisMonth: 0,
    gasPricePreviousMonth: 0,
    gasPriceThisYear: 0,
    gasPricePreviousYear: 0,
    minFillUpLiter: 0,
    maxFillUpLiter: 0,
    bestGasPrice: 0,
    worstGasPrice: 0,
    averageLiterPerKm: 0,
    bestFuelConsumption: 0,
    worstFuelConsumption: 0,
    refuelingIntervals: [],
    daysUntilNextRefueling: null,
  },
  services: {
    totalServiceCost: 0,
    serviceRecordsLength: 0,
    serviceCostThisYear: 0,
    serviceCostPreviousYear: 0,
    serviceCostThisMonth: 0,
    serviceCostPreviousMonth: 0,
    minServiceAmount: 0,
    maxServiceAmount: 0,
    averageCostPerKilometer: 0,
    averageCostPerDay: 0,
    averageCostPerMonth: 0,
    lengthPreviousMonth: 0,
    lengthPreviousYear: 0,
    lengthThisMonth: 0,
    lengthThisYear: 0,
  },
  expenses: {
    totalExpenses: 0,
    expenseRecordsLength: 0,
    expenseCostThisYear: 0,
    expenseCostPreviousYear: 0,
    expenseCostThisMonth: 0,
    expenseCostPreviousMonth: 0,
    minExpenseAmount: 0,
    maxExpenseAmount: 0,
    averageCostPerKilometer: 0,
    averageCostPerDay: 0,
    averageCostPerMonth: 0,
    lengthThisYear: 0,
    lengthPreviousYear: 0,
    lengthThisMonth: 0,
    lengthPreviousMonth: 0,
  },
  distance: {
    latestOdometer: 0,
    totalDistanceKm: 0,
    distanceThisYear: 0,
    distancePreviousYear: 0,
    distanceThisMonth: 0,
    distancePreviousMonth: 0,
    averageMileagePerDay: 0,
    averageMileagePerMonth: 0,
    averageMileagePerYear: 0,
  },
};

export const EMPTY_PERSIAN_STATISTICS: PersianStatistics = {
  general: {
    year: 0,
    month: 0,
    totalCostThisYear: 0,
    totalCostPreviousYear: 0,
    totalCostThisMonth: 0,
    totalCostPreviousMonth: 0,
  },
  refueling: {
    year: 0,
    month: 0,
    fillUpsThisYear: 0,
    fillUpsPreviousYear: 0,
    fillUpsThisMonth: 0,
    fillUpsPreviousMonth: 0,
    gasThisYear: 0,
    gasPreviousYear: 0,
    gasThisMonth: 0,
    gasPreviousMonth: 0,
    gasPriceThisMonth: 0,
    gasPricePreviousMonth: 0,
    gasPriceThisYear: 0,
    gasPricePreviousYear: 0,
  },
  services: {
    year: 0,
    month: 0,
    totalServiceCost: 0,
    serviceRecordsLength: 0,
    serviceCostThisYear: 0,
    serviceCostPreviousYear: 0,
    serviceCostThisMonth: 0,
    serviceCostPreviousMonth: 0,
    minServiceAmount: 0,
    maxServiceAmount: 0,
    averageCostPerKilometer: 0,
    averageCostPerDay: 0,
    averageCostPerMonth: 0,
    lengthPreviousMonth: 0,
    lengthPreviousYear: 0,
    lengthThisMonth: 0,
    lengthThisYear: 0,
  },
  expenses: {
    year: 0,
    month: 0,
    totalExpenses: 0,
    expenseRecordsLength: 0,
    expenseCostThisYear: 0,
    expenseCostPreviousYear: 0,
    expenseCostThisMonth: 0,
    expenseCostPreviousMonth: 0,
    minExpenseAmount: 0,
    maxExpenseAmount: 0,
    averageCostPerKilometer: 0,
    averageCostPerDay: 0,
    averageCostPerMonth: 0,
    lengthThisYear: 0,
    lengthPreviousYear: 0,
    lengthThisMonth: 0,
    lengthPreviousMonth: 0,
  },
  distance: {
    year: 0,
    month: 0,
    distanceThisYear: 0,
    distancePreviousYear: 0,
    distanceThisMonth: 0,
    distancePreviousMonth: 0,
  },
};
