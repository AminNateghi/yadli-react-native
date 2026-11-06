import { useMutation, useQuery } from "@tanstack/react-query";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  expensesRecords,
  remindersRecords,
  servicesRecords,
} from "@/db/schema";
import type {
  ExpenseDto,
  ReminderDto,
  ReminderRecordDto,
  ReminderSettingsDto,
  ServiceDto,
} from "@/types/interfaces";
import {
  refreshReminderNotifications,
  removeReminderNotification,
} from "@/utils/reminder-notifications";
import { queryClient } from "../utils/query-client";
import {
  assertVehicleNotSold,
  getActiveVehicleId,
  useActiveVehicleId,
} from "./active-vehicle";

export const remindersQueryKey = {
  list: ["reminder-list"],
  byId: (id: number) => ["reminder-get", id],
};

type ReminderWithSource = {
  reminder: ReminderRecordDto;
  service: ServiceDto | null;
  expense: ExpenseDto | null;
};

function hydrateReminder({ reminder, service, expense }: ReminderWithSource) {
  return {
    ...reminder,
    service,
    expense,
    startDate: service?.date ?? expense?.date ?? null,
    startOdometer: service?.odometer ?? expense?.odometer ?? null,
  };
}

async function getReminderWithSource(
  id: number,
  vehicleId: number,
): Promise<ReminderDto | null> {
  const [row] = await db
    .select()
    .from(remindersRecords)
    .leftJoin(
      servicesRecords,
      eq(remindersRecords.serviceId, servicesRecords.id),
    )
    .leftJoin(
      expensesRecords,
      eq(remindersRecords.expenseId, expensesRecords.id),
    )
    .where(
      and(
        eq(remindersRecords.id, id),
        eq(remindersRecords.vehicleId, vehicleId),
      ),
    )
    .limit(1);

  return row
    ? hydrateReminder({
        reminder: row.reminders,
        service: row.services,
        expense: row.expenses,
      })
    : null;
}

export function useReminders() {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: [...remindersQueryKey.list, vehicleId],
    queryFn: async () => {
      const rows = await db
        .select()
        .from(remindersRecords)
        .leftJoin(
          servicesRecords,
          eq(remindersRecords.serviceId, servicesRecords.id),
        )
        .leftJoin(
          expensesRecords,
          eq(remindersRecords.expenseId, expensesRecords.id),
        )
        .where(eq(remindersRecords.vehicleId, vehicleId ?? 1))
        .orderBy(desc(remindersRecords.id));
      return rows.map(({ reminders, services, expenses }) =>
        hydrateReminder({
          reminder: reminders,
          service: services,
          expense: expenses,
        }),
      );
    },
    enabled: vehicleId !== undefined,
  });
}

export function useUpdateReminder(id: number) {
  const { data: vehicleId } = useActiveVehicleId();
  return useMutation({
    mutationFn: async (values: Partial<ReminderSettingsDto>) => {
      const activeVehicleId = vehicleId ?? (await getActiveVehicleId());
      await assertVehicleNotSold(activeVehicleId);
      const [existingReminder] = await db
        .select()
        .from(remindersRecords)
        .where(
          and(
            eq(remindersRecords.id, id),
            eq(remindersRecords.vehicleId, activeVehicleId),
          ),
        )
        .limit(1);
      if (!existingReminder) throw new Error("Reminder not found");

      const serviceType = values.serviceType ?? existingReminder.serviceType;
      const expenseType = values.expenseType ?? existingReminder.expenseType;
      if (existingReminder.serviceId !== null) {
        const service = await db.query.servicesRecords.findFirst({
          where: and(
            eq(servicesRecords.id, existingReminder.serviceId),
            eq(servicesRecords.vehicleId, activeVehicleId),
          ),
        });
        if (
          !service ||
          !serviceType ||
          expenseType !== null ||
          !service.type.includes(serviceType)
        ) {
          throw new Error("Reminder service type does not match its record");
        }
      } else {
        const expense = await db.query.expensesRecords.findFirst({
          where: and(
            eq(expensesRecords.id, existingReminder.expenseId ?? -1),
            eq(expensesRecords.vehicleId, activeVehicleId),
          ),
        });
        if (!expense || serviceType !== null || expenseType !== expense.type) {
          throw new Error("Reminder expense type does not match its record");
        }
      }

      const [reminder] = await db
        .update(remindersRecords)
        .set(values)
        .where(
          and(
            eq(remindersRecords.id, id),
            eq(remindersRecords.vehicleId, activeVehicleId),
          ),
        )
        .returning();
      if (!reminder) throw new Error("Reminder not found");
      const notificationStatus = await refreshReminderNotifications([reminder]);
      return { reminder, ...notificationStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.byId(id) });
    },
  });
}

export function useDeleteReminder() {
  const { data: vehicleId } = useActiveVehicleId();
  return useMutation({
    mutationFn: async (id: number) => {
      const [deleted] = await db
        .delete(remindersRecords)
        .where(
          and(
            eq(remindersRecords.id, id),
            eq(remindersRecords.vehicleId, vehicleId ?? 1),
          ),
        )
        .returning();
      if (deleted) await removeReminderNotification(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useGetReminder(id: number | null) {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: [...remindersQueryKey.byId(id ?? 0), vehicleId],
    queryFn: () =>
      id === null ? null : getReminderWithSource(id, vehicleId ?? 1),
    enabled: !!id && vehicleId !== undefined,
  });
}

export function useGetReminderForService(serviceId: number | null) {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: ["reminder-service", serviceId, vehicleId],
    queryFn: async () => {
      if (serviceId === null) return null;
      const [row] = await db
        .select({ id: remindersRecords.id })
        .from(remindersRecords)
        .where(
          and(
            eq(remindersRecords.serviceId, serviceId),
            eq(remindersRecords.vehicleId, vehicleId ?? 1),
          ),
        )
        .limit(1);
      return row ? getReminderWithSource(row.id, vehicleId ?? 1) : null;
    },
    enabled: !!serviceId && vehicleId !== undefined,
  });
}

export function useGetReminderForExpense(expenseId: number | null) {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: ["reminder-expense", expenseId, vehicleId],
    queryFn: async () => {
      if (expenseId === null) return null;
      const [row] = await db
        .select({ id: remindersRecords.id })
        .from(remindersRecords)
        .where(
          and(
            eq(remindersRecords.expenseId, expenseId),
            eq(remindersRecords.vehicleId, vehicleId ?? 1),
          ),
        )
        .limit(1);
      return row ? getReminderWithSource(row.id, vehicleId ?? 1) : null;
    },
    enabled: !!expenseId && vehicleId !== undefined,
  });
}
