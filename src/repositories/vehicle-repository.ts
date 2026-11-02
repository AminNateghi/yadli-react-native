import { useMutation, useQuery } from "@tanstack/react-query";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { profileRecords, vehiclesRecords } from "@/db/schema";
import type { VehicleDto } from "@/types/interfaces";
import { queryClient } from "@/utils/query-client";
import { activeVehicleQueryKey } from "./active-vehicle";
import { profileQueryKey } from "./profile-repository";
import { expenseQueryKey } from "./expense-repository";
import { fuelQueryKey } from "./fuel-repository";
import { remindersQueryKey } from "./reminder-repository";
import { serviceQueryKey } from "./service-repository";

export const vehicleQueryKey = {
  list: ["vehicle-list"],
  byId: (id: number) => ["vehicle-get", id],
};

export function useVehicles() {
  return useQuery<VehicleDto[]>({
    queryKey: vehicleQueryKey.list,
    queryFn: () =>
      db.select().from(vehiclesRecords).orderBy(asc(vehiclesRecords.id)),
  });
}

export function useCreateVehicle() {
  return useMutation({
    mutationFn: async (values: Omit<VehicleDto, "id">) => {
      const customName = values.customName.trim();
      if (!customName) {
        throw new Error("Custom name is required");
      }

      return db.transaction(async (tx) => {
        const [vehicle] = await tx
          .insert(vehiclesRecords)
          .values({ ...values, customName })
          .returning();
        if (!vehicle) {
          throw new Error("Created vehicle could not be read");
        }

        const profile = await tx.query.profileRecords.findFirst({
          where: eq(profileRecords.id, 1),
        });
        if (profile) {
          await tx
            .update(profileRecords)
            .set({ activeVehicleId: vehicle.id })
            .where(eq(profileRecords.id, 1));
        } else {
          await tx.insert(profileRecords).values({
            id: 1,
            activeVehicleId: vehicle.id,
          });
        }

        return vehicle;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleQueryKey.list });
      queryClient.invalidateQueries({ queryKey: profileQueryKey.profile });
      queryClient.invalidateQueries({ queryKey: activeVehicleQueryKey });
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
    },
  });
}

export function useUpdateVehicle(id: number) {
  return useMutation({
    mutationFn: async (values: Partial<Omit<VehicleDto, "id">>) =>
      await db
        .update(vehiclesRecords)
        .set(values)
        .where(eq(vehiclesRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleQueryKey.list });
      queryClient.invalidateQueries({ queryKey: vehicleQueryKey.byId(id) });
      queryClient.invalidateQueries({ queryKey: profileQueryKey.profile });
      queryClient.invalidateQueries({ queryKey: activeVehicleQueryKey });
    },
  });
}

export function useSelectVehicle() {
  return useMutation({
    mutationFn: async (vehicleId: number) => {
      await db.transaction(async (tx) => {
        const vehicle = await tx.query.vehiclesRecords.findFirst({
          where: eq(vehiclesRecords.id, vehicleId),
        });
        if (!vehicle) {
          throw new Error("Vehicle not found");
        }

        const profile = await tx.query.profileRecords.findFirst({
          where: eq(profileRecords.id, 1),
        });
        if (profile) {
          await tx
            .update(profileRecords)
            .set({ activeVehicleId: vehicleId })
            .where(eq(profileRecords.id, 1));
        } else {
          await tx.insert(profileRecords).values({
            id: 1,
            activeVehicleId: vehicleId,
          });
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey.profile });
      queryClient.invalidateQueries({ queryKey: activeVehicleQueryKey });
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
    },
  });
}

export function useDeleteVehicle() {
  return useMutation({
    mutationFn: (id: number) =>
      db.delete(vehiclesRecords).where(eq(vehiclesRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleQueryKey.list });
      queryClient.invalidateQueries({ queryKey: profileQueryKey.profile });
      queryClient.invalidateQueries({ queryKey: activeVehicleQueryKey });
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
    },
  });
}

export function useGetVehicle(id: number | null) {
  console.log({ id });

  return useQuery({
    queryKey: [...vehicleQueryKey.byId(id ?? 0), id],
    queryFn: () => {
      if (id === null) return undefined;
      return db.query.vehiclesRecords.findFirst({
        where: eq(vehiclesRecords.id, id),
      });
    },
    enabled: id !== null,
  });
}
