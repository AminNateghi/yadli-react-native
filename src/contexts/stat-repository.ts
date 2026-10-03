import type { CarStats } from "@/types/interfaces";

export   const stats = ( Promise<CarStats> => {
    const listOfFuels = await listFuel();
    const listOfServices = await listService();
    const listOfExpenses = await listExpense();
    const objServices = listOfServices.map((s) => s.odometer);
    const objFuels = listOfFuels.map((f) => f.odometer);
    const objExpenses = listOfExpenses.map((e) => e.odometer);

    const flat = [...objServices, ...objFuels, ...objExpenses];

    const totalOdometer = flat.length > 0 ? Math.max(...flat) : 0;
    let avgLiterPerKm = 0;

    if (objFuels.length >= 2) {
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

    const totalFuelCost = listOfFuels.reduce(
      (sum, fuel) => sum + fuel.totalCost,
      0,
    );
    const totalServiceCost = listOfServices.reduce(
      (sum, service) => sum + service.cost,
      0,
    );
    const totalExpenses = listOfExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const today = new Date();

    const timeUntilNextService =
      listOfServices.length > 0
        ? new Date(listOfServices[0].nextDueDate!).getTime() - today.getTime()
        : 0;

    const daysUntilNextService = Math.ceil(
      timeUntilNextService / (1000 * 60 * 60 * 24),
    );
    const nextServiceDue =
      daysUntilNextService <= 7 && daysUntilNextService > 0
        ? listOfServices[0].nextDueDate!
        : "";

    return {
      totalKm: totalOdometer,
      avgKmPerLiter: avgLiterPerKm,
      totalFuelCost,
      totalServiceCost,
      totalExpenses,
      nextServiceDue,
    };
  }