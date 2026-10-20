import { useMutation, useQuery } from "@tanstack/react-query";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { servicesRecords } from "@/db/schema";
import type { ServiceDto } from "@/types/interfaces";
import { queryClient } from "../utils/query-client";
import { remindersQueryKey } from "./reminder-repository";

export const serviceQueryKey = {
  list: ["service-list"],
  byId: (id: number) => ["service-get", id],
};

export function useServices() {
  return useQuery<ServiceDto[]>({
    queryKey: serviceQueryKey.list,
    queryFn: async () =>
      await db
        .select()
        .from(servicesRecords)
        .orderBy(desc(servicesRecords.date)),
  });
}

export function useCreateService() {
  return useMutation({
    mutationFn: async (values: Omit<ServiceDto, "id">) =>
      await db.insert(servicesRecords).values(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
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
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.byId(id) });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useDeleteService() {
  return useMutation({
    mutationFn: (id: number) =>
      db.delete(servicesRecords).where(eq(servicesRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useGetService(id: number | null) {
  return useQuery({
    queryKey: serviceQueryKey.byId(id!),
    queryFn: () =>
      db.query.servicesRecords.findFirst({
        where: eq(servicesRecords.id, id!),
      }),
    enabled: !!id,
  });
}
