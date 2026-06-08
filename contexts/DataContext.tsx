import { CarStats, ExpenseDto, FuelDto, LanguageType, ServiceDto, ServiceType } from '@/types/interfaces';
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

  const saveLanguage = async (data: LanguageType) => {
    await AsyncStorage.setItem(STORAGE_KEYS.language, JSON.stringify(data));
    setLanguage(data);
  };

  //#region  APIs
  const addService = useCallback(async (service: Omit<ServiceDto, 'id'>) => {
    const newService: ServiceDto = { ...service, id: Date.now().toString() };
    setServices(prev => {
      const updated = [newService, ...prev];
      AsyncStorage.setItem(STORAGE_KEYS.services, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateService = useCallback(async (id: string, service: Partial<ServiceDto>) => {
    setServices(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, ...service } : s));
      AsyncStorage.setItem(STORAGE_KEYS.services, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteService = useCallback(async (id: string) => {
    setServices(prev => {
      const updated = prev.filter(s => s.id !== id);
      AsyncStorage.setItem(STORAGE_KEYS.services, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const doneService = useCallback(async (serviceType: ServiceType) => {
    setServices(prev => {
      const updated = prev.map(s =>
        s.type === serviceType ? { ...s, nextDueDate: undefined, nextDueOdometer: undefined } : s
      );
      AsyncStorage.setItem(STORAGE_KEYS.services, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addFuelRecord = useCallback(async (fuel: Omit<FuelDto, 'id'>) => {
    const newFuel: FuelDto = {
      ...fuel,
      id: Date.now().toString(),
    };
    setFuelRecords(prev => {
      const updated = [newFuel, ...prev];
      AsyncStorage.setItem(STORAGE_KEYS.fuel, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateFuelRecord = useCallback(async (id: string, fuel: Partial<FuelDto>) => {
    setFuelRecords(prev => {
      const updated = prev.map(f => (f.id === id ? { ...f, ...fuel } : f));
      AsyncStorage.setItem(STORAGE_KEYS.fuel, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteFuelRecord = useCallback(async (id: string) => {
    setFuelRecords(prev => {
      const updated = prev.filter(f => f.id !== id);
      AsyncStorage.setItem(STORAGE_KEYS.fuel, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addExpense = useCallback(async (expense: Omit<ExpenseDto, 'id'>) => {
    const newExpense: ExpenseDto = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses(prev => {
      const updated = [newExpense, ...prev];
      AsyncStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateExpense = useCallback(async (id: string, expense: Partial<ExpenseDto>) => {
    setExpenses(prev => {
      const updated = prev.map(e => (e.id === id ? { ...e, ...expense } : e));
      AsyncStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    setExpenses(prev => {
      const updated = prev.filter(e => e.id !== id);
      AsyncStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateLanguage = useCallback(async (payload: LanguageType) => {
    await saveLanguage(payload);
  }, []);

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
    services: [...services].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    fuelRecords: [...fuelRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    expenses: [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    stats,
    language,
    isLoading,
    addService,
    updateService,
    deleteService,
    doneService,
    addFuelRecord,
    updateFuelRecord,
    deleteFuelRecord,
    addExpense,
    updateExpense,
    deleteExpense,
    updateLanguage,
  };
});
