import { useMutation, useQuery } from "@tanstack/react-query";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { servicesRecords } from "@/db/schema";
import type { ServiceDto } from "@/types/interfaces";
import { queryClient } from "../utils/query-client";
import { remindersQueryKey } from "./reminder-repository";
import { getActiveVehicleId, useActiveVehicleId } from "./active-vehicle";

export const serviceQueryKey = {
  list: ["service-list"],
  byId: (id: number) => ["service-get", id],
};

export function useServices() {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery<ServiceDto[]>({
    queryKey: [...serviceQueryKey.list, vehicleId],
    queryFn: async () =>
      await db
        .select()
        .from(servicesRecords)
        .where(eq(servicesRecords.vehicleId, vehicleId ?? 1))
        .orderBy(desc(servicesRecords.date)),
    enabled: vehicleId !== undefined,
  });
}

export function useCreateService() {
  return useMutation({
    mutationFn: async (values: Omit<ServiceDto, "id" | "vehicleId">) =>
      await db
        .insert(servicesRecords)
        .values({ ...values, vehicleId: await getActiveVehicleId() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useUpdateService(id: number) {
  const { data: vehicleId } = useActiveVehicleId();
  return useMutation({
    mutationFn: async (values: Partial<Omit<ServiceDto, "id" | "vehicleId">>) =>
      await db
        .update(servicesRecords)
        .set(values)
        .where(
          and(
            eq(servicesRecords.id, id),
            eq(servicesRecords.vehicleId, vehicleId ?? 1),
          ),
        ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.byId(id) });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useDeleteService() {
  const { data: vehicleId } = useActiveVehicleId();
  return useMutation({
    mutationFn: (id: number) =>
      db
        .delete(servicesRecords)
        .where(
          and(
            eq(servicesRecords.id, id),
            eq(servicesRecords.vehicleId, vehicleId ?? 1),
          ),
        ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useGetService(id: number | null) {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: [...serviceQueryKey.byId(id ?? 0), vehicleId],
    queryFn: () => {
      if (id === null) return undefined;
      return db.query.servicesRecords.findFirst({
        where: and(
          eq(servicesRecords.id, id),
          eq(servicesRecords.vehicleId, vehicleId ?? 1),
        ),
      });
    },
    enabled: !!id && vehicleId !== undefined,
  });
}
