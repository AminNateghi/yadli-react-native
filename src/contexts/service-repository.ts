import { useMutation, useQuery } from "@tanstack/react-query";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { servicesRecords } from "@/db/schema";
import type { ServiceDto, ServiceType } from "@/types/interfaces";
import { queryClient } from "./query-client";

export const serviceQueryKey = {
  list: ["service-list"],
  byId: (id: number) => ["service-get", id],
};

export function useServices(limit?: number) {
  return useQuery<ServiceDto[]>({
    queryKey: serviceQueryKey.list,
    queryFn: async () =>
      await db
        .select()
        .from(servicesRecords)
        .orderBy(desc(servicesRecords.date))
        .limit(limit ?? 100),
  });
}

export function useCreateService() {
  return useMutation({
    mutationFn: async (values: Omit<ServiceDto, "id">) =>
      await db.insert(servicesRecords).values(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
    },
  });
}

export function useUpdateService(id: number) {
  return useMutation({
    mutationFn: async (values: Partial<ServiceDto>) =>
      await db
        .update(servicesRecords)
        .set(values)
        .where(eq(servicesRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
    },
  });
}

export function useDeleteService() {
  return useMutation({
    mutationFn: (id: number) =>
      db.delete(servicesRecords).where(eq(servicesRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
    },
  });
}

export function useDoneService() {
  return useMutation({
    mutationFn: async (serviceType: ServiceType) =>
      await db
        .update(servicesRecords)
        .set({
          nextDueDate: null,
          nextDueOdometer: null,
        })
        .where(eq(servicesRecords.type, serviceType)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
    },
  });
}

export function useGetService(enabled: boolean, id: number) {
  return useQuery({
    queryKey: serviceQueryKey.byId(id),
    queryFn: () => db.query.servicesRecords.findFirst({ with: { id: id } }),
    enabled,
  });
}
