import { useServices } from "./service-repository";
import { useFuels } from "./fuel-repository";
import { useExpenses } from "./expense-repository";
import { useEffect, useState } from "react";
import { useReminders } from "./reminder-repository";
import { getReminders } from "@/utils/service-reminders";

export function useStatistics() {
  const [maxOdometer, setMaxOdometer] = useState<number>(0);
  const [averageLiterPerKm, setAverageLiterPerKm] = useState<number>(0);
  const [totalFuelCost, setTotalFuelCost] = useState<number>(0);
  const [totalServiceCost, setTotalServiceCost] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalReminders, setTotalReminders] = useState<number>(0);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [fuelRecordsLength, setFuelRecordsLength] = useState<number>(0);
  const [serviceRecordsLength, setServiceRecordsLength] = useState<number>(0);
  const [expenseRecordsLength, setExpenseRecordsLength] = useState<number>(0);

  const { data: listOfServices } = useServices();
  const { data: listOfFuels } = useFuels();
  const { data: listOfExpenses } = useExpenses();
  const { data: listOfReminders } = useReminders();

  useEffect(() => {
    const loadReminders = async () => {
      if (
        !listOfReminders ||
        !listOfServices ||
        !listOfFuels ||
        !listOfExpenses
      )
        return;

      const result = await getReminders(listOfReminders, {
        services: listOfServices || [],
        fuels: listOfFuels || [],
        expense: listOfExpenses || [],
      });

      setTotalReminders(
        result.filter((reminder) => reminder.urgency >= 0.8).length,
      );
    };

    loadReminders();
  }, [listOfReminders, listOfServices, listOfFuels, listOfExpenses]);

  useEffect(() => {
    if (listOfExpenses && listOfFuels && listOfServices) {
      const objServices = listOfServices?.map((s) => s.odometer);
      const objFuels = listOfFuels?.map((f) => f.odometer);
      const objExpenses = listOfExpenses?.map((e) => e.odometer);

      // ====== length
      setFuelRecordsLength(objFuels.length);
      setServiceRecordsLength(objServices.length);
      setExpenseRecordsLength(objExpenses.length);

      // ====== Maximum Odometer
      const flat = [...objServices, ...objFuels, ...objExpenses];
      const maxOdo = flat.length > 0 ? Math.max(...flat) : 0;
      setMaxOdometer(maxOdo);

      // ====== Average Liter/Km
      let avgLiterPerKm = 0;
      if (objFuels.length > 2) {
        const sorted = [...listOfFuels].sort((a, b) => a.odometer - b.odometer);
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
      setAverageLiterPerKm(avgLiterPerKm);

      // ====== Costs
      const fuelCost = listOfFuels.reduce(
        (sum, fuel) => sum + fuel.totalCost,
        0,
      );
      setTotalFuelCost(fuelCost);
      const serviceCost = listOfServices.reduce(
        (sum, service) => sum + service.cost,
        0,
      );
      setTotalServiceCost(serviceCost);
      const expenses = listOfExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );
      setTotalExpenses(expenses);
    }
  }, [listOfExpenses, listOfFuels, listOfServices]);

  useEffect(() => {
    setTotalSpent(totalFuelCost + totalServiceCost + totalExpenses);
  }, [totalFuelCost, totalServiceCost, totalExpenses]);

  return {
    totalKm: maxOdometer,
    avgKmPerLiter: averageLiterPerKm,
    totalFuelCost,
    totalServiceCost,
    totalExpenses,
    totalReminders,
    totalSpent,
    fuelRecordsLength,
    serviceRecordsLength,
    expenseRecordsLength,
  };
}
