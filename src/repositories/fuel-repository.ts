import { useMutation, useQuery } from "@tanstack/react-query";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { fuelsRecords } from "@/db/schema";
import type { FuelDto } from "@/types/interfaces";
import { queryClient } from "../utils/query-client";
import { remindersQueryKey } from "./reminder-repository";
import {
  assertVehicleNotSold,
  getActiveVehicleId,
  useActiveVehicleId,
} from "./active-vehicle";

export const fuelQueryKey = {
  list: ["fuel-list"],
  byId: (id: number) => ["fuel-get", id],
};

export function useFuels() {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: [...fuelQueryKey.list, vehicleId],
    queryFn: async () =>
      db
        .select()
        .from(fuelsRecords)
        .where(eq(fuelsRecords.vehicleId, vehicleId ?? 1))
        .orderBy(desc(fuelsRecords.date)),
    enabled: vehicleId !== undefined,
  });
}

export function useCreateFuel() {
  return useMutation({
    mutationFn: async (values: Omit<FuelDto, "id" | "vehicleId">) => {
      const vehicleId = await getActiveVehicleId();
      await assertVehicleNotSold(vehicleId);
      return db.insert(fuelsRecords).values({ ...values, vehicleId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useUpdateFuel(id: number) {
  const { data: vehicleId } = useActiveVehicleId();
  return useMutation({
    mutationFn: async (values: Partial<Omit<FuelDto, "id" | "vehicleId">>) => {
      const activeVehicleId = vehicleId ?? (await getActiveVehicleId());
      await assertVehicleNotSold(activeVehicleId);
      return db
        .update(fuelsRecords)
        .set(values)
        .where(
          and(
            eq(fuelsRecords.id, id),
            eq(fuelsRecords.vehicleId, activeVehicleId),
          ),
        );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.byId(id) });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useDeleteFuel() {
  const { data: vehicleId } = useActiveVehicleId();
  return useMutation({
    mutationFn: (id: number) =>
      db
        .delete(fuelsRecords)
        .where(
          and(
            eq(fuelsRecords.id, id),
            eq(fuelsRecords.vehicleId, vehicleId ?? 1),
          ),
        ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useGetFuel(id: number | null) {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: [...fuelQueryKey.byId(id ?? 0), vehicleId],
    queryFn: () => {
      if (id === null) return undefined;
      return db.query.fuelsRecords.findFirst({
        where: and(
          eq(fuelsRecords.id, id),
          eq(fuelsRecords.vehicleId, vehicleId ?? 1),
        ),
      });
    },
    enabled: !!id && vehicleId !== undefined,
  });
}
