import { CarStats, ExpenseDto, FuelDto, LanguageType, ServiceDto } from '@/types/interfaces';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEYS = {
  vehicle: 'vehicle',
  services: 'vehicle_services',
  fuel: 'vehicle_fuel',
  expenses: 'vehicle_expenses',
  language: 'language',
};

export const [DataProvider, useData] = createContextHook(() => {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelDto[]>([]);
  const [expenses, setExpenses] = useState<ExpenseDto[]>([]);
  const [language, setLanguage] = useState<LanguageType>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesData, fuelData, expensesData, languageData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.services),
        AsyncStorage.getItem(STORAGE_KEYS.fuel),
        AsyncStorage.getItem(STORAGE_KEYS.expenses),
        AsyncStorage.getItem(STORAGE_KEYS.language),
      ]);

      if (servicesData) setServices(JSON.parse(servicesData));
      if (fuelData) setFuelRecords(JSON.parse(fuelData));
      if (expensesData) setExpenses(JSON.parse(expensesData));
      if (languageData) setLanguage(JSON.parse(languageData));
    } catch (error) {
      console.warn('Error loading car data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveServices = async (data: ServiceDto[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.services, JSON.stringify(data));
    setServices(data);
  };

  const saveFuelRecords = async (data: FuelDto[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.fuel, JSON.stringify(data));
    setFuelRecords(data);
  };

  const saveExpenses = async (data: ExpenseDto[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(data));
    setExpenses(data);
  };

  const saveLanguage = async (data: LanguageType) => {
    await AsyncStorage.setItem(STORAGE_KEYS.language, JSON.stringify(data));
    setLanguage(data);
  };

  //#region  APIs
  const addService = useCallback(
    async (service: Omit<ServiceDto, 'id'>) => {
      const newService: ServiceDto = {
        ...service,
        id: Date.now().toString(),
      };
      const updated = [newService, ...services];
      await saveServices(updated);
    },
    [services]
  );

  const updateService = useCallback(
    async (id: string, service: Partial<ServiceDto>) => {
      const updated = services.map(s => (s.id === id ? { ...s, ...service } : s));
      await saveServices(updated);
    },
    [services]
  );

  const deleteService = useCallback(
    async (id: string) => {
      const updated = services.filter(s => s.id !== id);
      await saveServices(updated);
    },
    [services]
  );

  const addFuelRecord = useCallback(
    async (fuel: Omit<FuelDto, 'id'>) => {
      const newFuel: FuelDto = {
        ...fuel,
        id: Date.now().toString(),
      };
      const updated = [newFuel, ...fuelRecords];
      await saveFuelRecords(updated);
    },
    [fuelRecords]
  );

  const updateFuelRecord = useCallback(
    async (id: string, fuel: Partial<FuelDto>) => {
      const updated = fuelRecords.map(f => (f.id === id ? { ...f, ...fuel } : f));
      await saveFuelRecords(updated);
    },
    [fuelRecords]
  );

  const deleteFuelRecord = useCallback(
    async (id: string) => {
      const updated = fuelRecords.filter(f => f.id !== id);
      await saveFuelRecords(updated);
    },
    [fuelRecords]
  );

  const addExpense = useCallback(
    async (expense: Omit<ExpenseDto, 'id'>) => {
      const newExpense: ExpenseDto = {
        ...expense,
        id: Date.now().toString(),
      };
      const updated = [newExpense, ...expenses];
      await saveExpenses(updated);
    },
    [expenses]
  );

  const updateExpense = useCallback(
    async (id: string, expense: Partial<ExpenseDto>) => {
      const updated = expenses.map(e => (e.id === id ? { ...e, ...expense } : e));
      await saveExpenses(updated);
    },
    [expenses]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      const updated = expenses.filter(e => e.id !== id);
      await saveExpenses(updated);
    },
    [expenses]
  );

  const updateLanguage = useCallback(
    async (payload: LanguageType) => {
      await saveLanguage(payload);
    },
    [language]
  );

  //#endregion

  const stats = useMemo((): CarStats => {
    const allKm = [
      ...services.map(s => s.odometer),
      ...fuelRecords.map(f => f.odometer),
      ...expenses.filter(e => e.odometer).map(e => e.odometer!),
    ];

    const totalOdometer = allKm.length > 0 ? Math.max(...allKm) : 0;

    let avgLiterPerKm = 0;
    if (fuelRecords.length >= 2) {
      const sorted = [...fuelRecords].sort((a, b) => a.odometer - b.odometer);
      let totalDistance = 0;
      let totalLiters = 0;
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].fullTank && sorted[i - 1].fullTank) {
          totalDistance += sorted[i].odometer - sorted[i - 1].odometer;
          totalLiters += sorted[i].liters;
        }
      }
      avgLiterPerKm = totalLiters > 0 ? totalDistance / totalLiters : 0;
    }

    const totalFuelCost = fuelRecords.reduce((sum, f) => sum + f.totalCost, 0);
    const totalServiceCost = services.reduce((sum, s) => sum + s.cost, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const sortedServices = [...services].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastServiceDate = sortedServices.length > 0 ? sortedServices[0].date : null;

    const today = new Date();
    const upcomingService = services
      .filter(s => s.nextDueDate)
      .sort((a, b) => new Date(a.nextDueDate!).getTime() - new Date(b.nextDueDate!).getTime());
    const timeUntilNextService =
      upcomingService.length > 0 ? new Date(upcomingService[0].nextDueDate!).getTime() - today.getTime() : 0;
    const daysUntilNextService = Math.ceil(timeUntilNextService / (1000 * 60 * 60 * 24));
    const nextServiceDue = daysUntilNextService <= 7 && daysUntilNextService > 0 ? upcomingService[0].nextDueDate! : '';

    return {
      totalKm: totalOdometer,
      avgKmPerLiter: avgLiterPerKm,
      totalFuelCost,
      totalServiceCost,
      totalExpenses,
      lastServiceDate,
      nextServiceDue,
      upcomingService,
    };
  }, [services, fuelRecords, expenses]);

  return {
    services: services.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    fuelRecords: fuelRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    expenses: expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    stats,
    language,
    isLoading,
    addService,
    updateService,
    deleteService,
    addFuelRecord,
    updateFuelRecord,
    deleteFuelRecord,
    addExpense,
    updateExpense,
    deleteExpense,
    updateLanguage,
  };
});
