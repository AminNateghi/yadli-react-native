import { useMutation, useQuery } from "@tanstack/react-query";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { expensesRecords } from "@/db/schema";
import type { ExpenseDto } from "@/types/interfaces";
import { queryClient } from "../utils/query-client";
import { remindersQueryKey } from "./reminder-repository";
import {
  assertVehicleNotSold,
  getActiveVehicleId,
  useActiveVehicleId,
} from "./active-vehicle";

export const expenseQueryKey = {
  list: ["expense-list"],
  byId: (id: number) => ["expense-get", id],
};

export function useExpenses() {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: [...expenseQueryKey.list, vehicleId],
    queryFn: async () =>
      db
        .select()
        .from(expensesRecords)
        .where(eq(expensesRecords.vehicleId, vehicleId ?? 1))
        .orderBy(desc(expensesRecords.date)),
    enabled: vehicleId !== undefined,
  });
}

export function useCreateExpense() {
  return useMutation({
    mutationFn: async (values: Omit<ExpenseDto, "id" | "vehicleId">) => {
      const vehicleId = await getActiveVehicleId();
      await assertVehicleNotSold(vehicleId);
      return db.insert(expensesRecords).values({ ...values, vehicleId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useUpdateExpense(id: number) {
  const { data: vehicleId } = useActiveVehicleId();
  return useMutation({
    mutationFn: async (
      values: Partial<Omit<ExpenseDto, "id" | "vehicleId">>,
    ) => {
      const activeVehicleId = vehicleId ?? (await getActiveVehicleId());
      await assertVehicleNotSold(activeVehicleId);
      return db
        .update(expensesRecords)
        .set(values)
        .where(
          and(
            eq(expensesRecords.id, id),
            eq(expensesRecords.vehicleId, activeVehicleId),
          ),
        );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.byId(id) });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useDeleteExpense() {
  const { data: vehicleId } = useActiveVehicleId();
  return useMutation({
    mutationFn: (id: number) =>
      db
        .delete(expensesRecords)
        .where(
          and(
            eq(expensesRecords.id, id),
            eq(expensesRecords.vehicleId, vehicleId ?? 1),
          ),
        ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useGetExpense(id: number | null) {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: [...expenseQueryKey.byId(id ?? 0), vehicleId],
    queryFn: () => {
      if (id === null) return undefined;
      return db.query.expensesRecords.findFirst({
        where: and(
          eq(expensesRecords.id, id),
          eq(expensesRecords.vehicleId, vehicleId ?? 1),
        ),
      });
    },
    enabled: !!id && vehicleId !== undefined,
  });
}
