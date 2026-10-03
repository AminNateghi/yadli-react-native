import { useMutation, useQuery } from "@tanstack/react-query";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { expensesRecords } from "@/db/schema";
import type { ExpenseDto } from "@/types/interfaces";
import { queryClient } from "./query-client";

export const expenseQueryKey = {
  list: ["expense-list"],
  byId: (id: number) => ["expense-get", id],
};

export function useExpenses(limit?: number) {
  return useQuery({
    queryKey: expenseQueryKey.list,
    queryFn: async () =>
      db
        .select()
        .from(expensesRecords)
        .orderBy(desc(expensesRecords.date))
        .limit(limit ?? 100),
  });
}

export function useCreateExpense() {
  return useMutation({
    mutationFn: async (values: Omit<ExpenseDto, "id">) =>
      await db.insert(expensesRecords).values(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
    },
  });
}

export function useUpdateExpense(id: number) {
  return useMutation({
    mutationFn: async (values: Partial<ExpenseDto>) =>
      await db
        .update(expensesRecords)
        .set(values)
        .where(eq(expensesRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
    },
  });
}

export function useDeleteExpense() {
  return useMutation({
    mutationFn: (id: number) =>
      db.delete(expensesRecords).where(eq(expensesRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
    },
  });
}

export function useGetExpense(enabled: boolean, id: number) {
  return useQuery({
    queryKey: expenseQueryKey.byId(id),
    queryFn: () => db.query.expensesRecords.findFirst({ with: { id: id } }),
    enabled,
  });
}
