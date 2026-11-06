import { useMutation, useQuery } from "@tanstack/react-query";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { remindersRecords, servicesRecords } from "@/db/schema";
import type {
  ReminderRecordDto,
  ReminderSettingsDto,
  ServiceDto,
} from "@/types/interfaces";
import { queryClient } from "../utils/query-client";
import { remindersQueryKey } from "./reminder-repository";
import {
  refreshReminderNotifications,
  removeReminderNotification,
} from "@/utils/reminder-notifications";
import {
  assertVehicleNotSold,
  getActiveVehicleId,
  useActiveVehicleId,
} from "./active-vehicle";

export const serviceQueryKey = {
  list: ["service-list"],
  byId: (id: number) => ["service-get", id],
};

type ServiceSaveValues = Omit<ServiceDto, "id" | "vehicleId"> & {
  reminder?: ReminderSettingsDto | null;
  reminderId?: number;
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
    mutationFn: async (values: ServiceSaveValues) => {
      const vehicleId = await getActiveVehicleId();
      await assertVehicleNotSold(vehicleId);
      const { reminder, reminderId, ...serviceValues } = values;
      const result = await db.transaction(async (tx) => {
        const [service] = await tx
          .insert(servicesRecords)
          .values({ ...serviceValues, vehicleId })
          .returning();
        if (!service) throw new Error("Created service could not be read");

        let deletedReminderId: number | undefined;
        const categoryReminders = await tx
          .select()
          .from(remindersRecords)
          .where(
            and(
              eq(remindersRecords.vehicleId, vehicleId),
              inArray(remindersRecords.serviceType, service.type),
            ),
          );
        for (const reminderRecord of categoryReminders) {
          await tx
            .update(remindersRecords)
            .set({ serviceId: service.id, expenseId: null })
            .where(eq(remindersRecords.id, reminderRecord.id));
        }

        if (reminderId !== undefined) {
          const [existingReminder] = await tx
            .select()
            .from(remindersRecords)
            .where(
              and(
                eq(remindersRecords.id, reminderId),
                eq(remindersRecords.vehicleId, vehicleId),
              ),
            )
            .limit(1);
          if (!existingReminder?.serviceId) {
            throw new Error("Service reminder not found");
          }
          if (reminder === null) {
            deletedReminderId = existingReminder.id;
            await tx
              .delete(remindersRecords)
              .where(eq(remindersRecords.id, reminderId));
          } else {
            const serviceType =
              reminder?.serviceType ?? existingReminder.serviceType;
            if (
              !serviceType ||
              (reminder && reminder.expenseType !== null) ||
              !service.type.includes(serviceType)
            ) {
              throw new Error(
                "Reminder service type does not match the record",
              );
            }
            await tx
              .update(remindersRecords)
              .set({
                ...(reminder ?? {}),
                serviceId: service.id,
                expenseId: null,
              })
              .where(eq(remindersRecords.id, reminderId));
          }
        }
        if (reminder) {
          if (
            !reminder.serviceType ||
            reminder.expenseType !== null ||
            !service.type.includes(reminder.serviceType)
          ) {
            throw new Error("Reminder service type does not match the record");
          }
          const [existingByType] = await tx
            .select()
            .from(remindersRecords)
            .where(
              and(
                eq(remindersRecords.vehicleId, vehicleId),
                eq(remindersRecords.serviceType, reminder.serviceType),
              ),
            )
            .limit(1);
          if (existingByType) {
            await tx
              .update(remindersRecords)
              .set({
                ...reminder,
                serviceId: service.id,
                expenseId: null,
              })
              .where(eq(remindersRecords.id, existingByType.id));
          } else {
            await tx.insert(remindersRecords).values({
              ...reminder,
              serviceId: service.id,
              expenseId: null,
              vehicleId,
            });
          }
        }
        const reminders = await tx
          .select()
          .from(remindersRecords)
          .where(eq(remindersRecords.serviceId, service.id));
        return { service, reminders, deletedReminderId };
      });
      const notificationStatus = await refreshReminderNotifications(
        result.reminders,
        result.deletedReminderId === undefined
          ? []
          : [result.deletedReminderId],
      );
      return { service: result.service, ...notificationStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useUpdateService(id: number) {
  const { data: vehicleId } = useActiveVehicleId();
  return useMutation({
    mutationFn: async (
      values: Partial<Omit<ServiceDto, "id" | "vehicleId">> & {
        reminder?: ReminderSettingsDto | null;
        reminderId?: number;
      },
    ) => {
      const activeVehicleId = vehicleId ?? (await getActiveVehicleId());
      await assertVehicleNotSold(activeVehicleId);
      const { reminder, reminderId, ...serviceValues } = values;
      const result = await db.transaction(async (tx) => {
        const [service] = await tx
          .update(servicesRecords)
          .set(serviceValues)
          .where(
            and(
              eq(servicesRecords.id, id),
              eq(servicesRecords.vehicleId, activeVehicleId),
            ),
          )
          .returning();
        if (!service) throw new Error("Service not found");

        const linkedReminders = await tx
          .select()
          .from(remindersRecords)
          .where(
            and(
              eq(remindersRecords.serviceId, id),
              eq(remindersRecords.vehicleId, activeVehicleId),
            ),
          );
        const deletedReminderIds: number[] = [];
        let updatedReminder: ReminderRecordDto | undefined;
        const reminderToUpdate = reminderId
          ? linkedReminders.find((item) => item.id === reminderId)
          : undefined;
        const categoryReminders = await tx
          .select()
          .from(remindersRecords)
          .where(
            and(
              eq(remindersRecords.vehicleId, activeVehicleId),
              inArray(remindersRecords.serviceType, service.type),
            ),
          );
        for (const categoryReminder of categoryReminders) {
          await tx
            .update(remindersRecords)
            .set({ serviceId: service.id, expenseId: null })
            .where(eq(remindersRecords.id, categoryReminder.id));
        }

        if (reminderId !== undefined && !reminderToUpdate) {
          throw new Error("Reminder not found for service");
        }

        if (reminder === null && reminderToUpdate) {
          deletedReminderIds.push(reminderToUpdate.id);
          await tx
            .delete(remindersRecords)
            .where(eq(remindersRecords.id, reminderToUpdate.id));
        } else if (reminder) {
          if (
            !reminder.serviceType ||
            reminder.expenseType !== null ||
            !service.type.includes(reminder.serviceType)
          ) {
            throw new Error("Reminder service type does not match the record");
          }
          const existingByType =
            reminderToUpdate ??
            (
              await tx
                .select()
                .from(remindersRecords)
                .where(
                  and(
                    eq(remindersRecords.vehicleId, activeVehicleId),
                    eq(remindersRecords.serviceType, reminder.serviceType),
                  ),
                )
                .limit(1)
            )[0];
          if (existingByType) {
            [updatedReminder] = await tx
              .update(remindersRecords)
              .set({
                ...reminder,
                serviceId: service.id,
                expenseId: null,
              })
              .where(eq(remindersRecords.id, existingByType.id))
              .returning();
          } else {
            [updatedReminder] = await tx
              .insert(remindersRecords)
              .values({
                ...reminder,
                serviceId: service.id,
                expenseId: null,
                vehicleId: activeVehicleId,
              })
              .returning();
          }
        }

        for (const linkedReminder of linkedReminders) {
          if (
            !service.type.includes(
              linkedReminder.serviceType as ServiceDto["type"][number],
            ) &&
            linkedReminder.id !== updatedReminder?.id &&
            !deletedReminderIds.includes(linkedReminder.id)
          ) {
            deletedReminderIds.push(linkedReminder.id);
            await tx
              .delete(remindersRecords)
              .where(eq(remindersRecords.id, linkedReminder.id));
          }
        }

        const reminders = await tx
          .select()
          .from(remindersRecords)
          .where(eq(remindersRecords.serviceId, service.id));
        return { service, reminders, deletedReminderIds };
      });
      const notificationStatus = await refreshReminderNotifications(
        result.reminders,
        result.deletedReminderIds,
      );
      return { service: result.service, ...notificationStatus };
    },
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
    mutationFn: async (id: number) => {
      const activeVehicleId = vehicleId ?? (await getActiveVehicleId());
      const reminderIds = await db.transaction(async (tx) => {
        const reminders = await tx
          .select({ id: remindersRecords.id })
          .from(remindersRecords)
          .where(
            and(
              eq(remindersRecords.serviceId, id),
              eq(remindersRecords.vehicleId, activeVehicleId),
            ),
          );
        await tx
          .delete(remindersRecords)
          .where(
            and(
              eq(remindersRecords.serviceId, id),
              eq(remindersRecords.vehicleId, activeVehicleId),
            ),
          );
        await tx
          .delete(servicesRecords)
          .where(
            and(
              eq(servicesRecords.id, id),
              eq(servicesRecords.vehicleId, activeVehicleId),
            ),
          );
        return reminders.map((reminder) => reminder.id);
      });
      await Promise.all(reminderIds.map(removeReminderNotification));
    },
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
