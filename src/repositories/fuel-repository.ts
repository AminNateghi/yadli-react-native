import { useMutation, useQuery } from "@tanstack/react-query";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { fuelsRecords } from "@/db/schema";
import type { FuelDto } from "@/types/interfaces";
import { queryClient } from "../utils/query-client";
import { remindersQueryKey } from "./reminder-repository";

export const fuelQueryKey = {
  list: ["fuel-list"],
  byId: (id: number) => ["fuel-get", id],
};

export function useFuels() {
  return useQuery({
    queryKey: fuelQueryKey.list,
    queryFn: async () =>
      db.select().from(fuelsRecords).orderBy(desc(fuelsRecords.date)),
  });
}

export function useCreateFuel() {
  return useMutation({
    mutationFn: async (values: Omit<FuelDto, "id">) =>
      await db.insert(fuelsRecords).values(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useUpdateFuel(id: number) {
  return useMutation({
    mutationFn: async (values: Partial<FuelDto>) =>
      await db.update(fuelsRecords).set(values).where(eq(fuelsRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.byId(id) });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useDeleteFuel() {
  return useMutation({
    mutationFn: (id: number) =>
      db.delete(fuelsRecords).where(eq(fuelsRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useGetFuel(id: number | null) {
  return useQuery({
    queryKey: fuelQueryKey.byId(id!),
    queryFn: () =>
      db.query.fuelsRecords.findFirst({ where: eq(fuelsRecords.id, id!) }),
    enabled: !!id,
  });
}
