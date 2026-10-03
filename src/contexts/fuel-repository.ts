import { useMutation, useQuery } from "@tanstack/react-query";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { fuelsRecords } from "@/db/schema";
import type { FuelDto } from "@/types/interfaces";
import { queryClient } from "./query-client";

export const fuelQueryKey = {
  list: ["fuel-list"],
  byId: (id: number) => ["fuel-get", id],
};

export function useFuels(limit?: number) {
  return useQuery({
    queryKey: fuelQueryKey.list,
    queryFn: async () =>
      db
        .select()
        .from(fuelsRecords)
        .orderBy(desc(fuelsRecords.date))
        .limit(limit ?? 100),
  });
}

export function useCreateFuel() {
  return useMutation({
    mutationFn: async (values: Omit<FuelDto, "id">) =>
      await db.insert(fuelsRecords).values(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
    },
  });
}

export function useUpdateFuel(id: number) {
  return useMutation({
    mutationFn: async (values: Partial<FuelDto>) =>
      await db.update(fuelsRecords).set(values).where(eq(fuelsRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
    },
  });
}

export function useDeleteFuel() {
  return useMutation({
    mutationFn: (id: number) =>
      db.delete(fuelsRecords).where(eq(fuelsRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
    },
  });
}

export function useGetFuel(enabled: boolean, id: number) {
  return useQuery({
    queryKey: fuelQueryKey.byId(id),
    queryFn: () => db.query.fuelsRecords.findFirst({ with: { id: id } }),
    enabled,
  });
}
