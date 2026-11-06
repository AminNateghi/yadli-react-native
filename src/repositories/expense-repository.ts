import { useMutation, useQuery } from "@tanstack/react-query";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { expensesRecords, remindersRecords } from "@/db/schema";
import type { ExpenseDto, ReminderSettingsDto } from "@/types/interfaces";
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

export const expenseQueryKey = {
  list: ["expense-list"],
  byId: (id: number) => ["expense-get", id],
};

type ExpenseSaveValues = Omit<ExpenseDto, "id" | "vehicleId"> & {
  reminder?: ReminderSettingsDto | null;
  reminderId?: number;
};

export function useExpenses() {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: [...expenseQueryKey.list, vehicleId],
    queryFn: async () =>
      db
        .select()
        .from(expensesRecords)
        .where(eq(expensesRecords.vehicleId, vehicleId ?? 1))
        .orderBy(desc(expensesRecords.date)),
    enabled: vehicleId !== undefined,
  });
}

export function useCreateExpense() {
  return useMutation({
    mutationFn: async (values: ExpenseSaveValues) => {
      const vehicleId = await getActiveVehicleId();
      await assertVehicleNotSold(vehicleId);
      const { reminder, reminderId, ...expenseValues } = values;
      const result = await db.transaction(async (tx) => {
        const [expense] = await tx
          .insert(expensesRecords)
          .values({ ...expenseValues, vehicleId })
          .returning();
        if (!expense) throw new Error("Created expense could not be read");

        let deletedReminderId: number | undefined;
        const categoryReminders = await tx
          .select()
          .from(remindersRecords)
          .where(
            and(
              eq(remindersRecords.vehicleId, vehicleId),
              eq(remindersRecords.expenseType, expense.type),
            ),
          );
        for (const reminderRecord of categoryReminders) {
          await tx
            .update(remindersRecords)
            .set({ expenseId: expense.id, serviceId: null })
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
          if (!existingReminder?.expenseId) {
            throw new Error("Expense reminder not found");
          }
          if (
            reminder === undefined &&
            existingReminder.expenseType !== expense.type
          ) {
            throw new Error("Reminder expense type does not match the record");
          }
          if (reminder === null) {
            deletedReminderId = existingReminder.id;
            await tx
              .delete(remindersRecords)
              .where(eq(remindersRecords.id, reminderId));
          }
        }
        if (reminder) {
          if (
            reminder.serviceType !== null ||
            reminder.expenseType !== expense.type
          ) {
            throw new Error("Reminder expense type does not match the record");
          }
          const [existingByType] = await tx
            .select()
            .from(remindersRecords)
            .where(
              and(
                eq(remindersRecords.vehicleId, vehicleId),
                eq(remindersRecords.expenseType, expense.type),
              ),
            )
            .limit(1);
          const reminderToUpdate =
            reminderId !== undefined
              ? (
                  await tx
                    .select()
                    .from(remindersRecords)
                    .where(
                      and(
                        eq(remindersRecords.id, reminderId),
                        eq(remindersRecords.vehicleId, vehicleId),
                      ),
                    )
                    .limit(1)
                )[0]
              : existingByType;
          if (reminderToUpdate) {
            await tx
              .update(remindersRecords)
              .set({
                ...reminder,
                serviceId: null,
                expenseId: expense.id,
              })
              .where(eq(remindersRecords.id, reminderToUpdate.id));
          } else {
            await tx.insert(remindersRecords).values({
              ...reminder,
              serviceId: null,
              expenseId: expense.id,
              vehicleId,
            });
          }
        }
        const reminders = await tx
          .select()
          .from(remindersRecords)
          .where(eq(remindersRecords.expenseId, expense.id));
        return { expense, reminders, deletedReminderId };
      });
      const notificationStatus = await refreshReminderNotifications(
        result.reminders,
        result.deletedReminderId === undefined
          ? []
          : [result.deletedReminderId],
      );
      return { expense: result.expense, ...notificationStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useUpdateExpense(id: number) {
  const { data: vehicleId } = useActiveVehicleId();
  return useMutation({
    mutationFn: async (
      values: Partial<Omit<ExpenseDto, "id" | "vehicleId">> & {
        reminder?: ReminderSettingsDto | null;
        reminderId?: number;
      },
    ) => {
      const activeVehicleId = vehicleId ?? (await getActiveVehicleId());
      await assertVehicleNotSold(activeVehicleId);
      const { reminder, reminderId, ...expenseValues } = values;
      const result = await db.transaction(async (tx) => {
        const [expense] = await tx
          .update(expensesRecords)
          .set(expenseValues)
          .where(
            and(
              eq(expensesRecords.id, id),
              eq(expensesRecords.vehicleId, activeVehicleId),
            ),
          )
          .returning();
        if (!expense) throw new Error("Expense not found");

        const linkedReminders = await tx
          .select()
          .from(remindersRecords)
          .where(
            and(
              eq(remindersRecords.expenseId, id),
              eq(remindersRecords.vehicleId, activeVehicleId),
            ),
          );
        const categoryReminders = await tx
          .select()
          .from(remindersRecords)
          .where(
            and(
              eq(remindersRecords.vehicleId, activeVehicleId),
              eq(remindersRecords.expenseType, expense.type),
            ),
          );
        for (const categoryReminder of categoryReminders) {
          await tx
            .update(remindersRecords)
            .set({ expenseId: expense.id, serviceId: null })
            .where(eq(remindersRecords.id, categoryReminder.id));
        }
        const reminderToUpdate = reminderId
          ? linkedReminders.find((item) => item.id === reminderId)
          : undefined;
        if (reminderId !== undefined && !reminderToUpdate) {
          throw new Error("Reminder not found for expense");
        }

        const deletedReminderIds: number[] = [];
        if (reminder === null && reminderToUpdate) {
          deletedReminderIds.push(reminderToUpdate.id);
          await tx
            .delete(remindersRecords)
            .where(eq(remindersRecords.id, reminderToUpdate.id));
        } else if (reminder) {
          if (
            reminder.serviceType !== null ||
            reminder.expenseType !== expense.type
          ) {
            throw new Error("Reminder expense type does not match the record");
          }
          const [existingByType] = await tx
            .select()
            .from(remindersRecords)
            .where(
              and(
                eq(remindersRecords.vehicleId, activeVehicleId),
                eq(remindersRecords.expenseType, expense.type),
              ),
            )
            .limit(1);
          const existing =
            reminderToUpdate ??
            existingByType ??
            linkedReminders.find((item) => item.expenseType === expense.type);
          if (existing) {
            await tx
              .update(remindersRecords)
              .set({
                ...reminder,
                serviceId: null,
                expenseId: expense.id,
              })
              .where(eq(remindersRecords.id, existing.id));
          } else {
            await tx.insert(remindersRecords).values({
              ...reminder,
              serviceId: null,
              expenseId: expense.id,
              vehicleId: activeVehicleId,
            });
          }
        } else {
          for (const linkedReminder of linkedReminders) {
            if (linkedReminder.expenseType !== expense.type) {
              await tx
                .update(remindersRecords)
                .set({ expenseType: expense.type })
                .where(eq(remindersRecords.id, linkedReminder.id));
            }
          }
        }

        const reminders = await tx
          .select()
          .from(remindersRecords)
          .where(eq(remindersRecords.expenseId, expense.id));
        return { expense, reminders, deletedReminderIds };
      });
      const notificationStatus = await refreshReminderNotifications(
        result.reminders,
        result.deletedReminderIds,
      );
      return { expense: result.expense, ...notificationStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.byId(id) });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useDeleteExpense() {
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
              eq(remindersRecords.expenseId, id),
              eq(remindersRecords.vehicleId, activeVehicleId),
            ),
          );
        await tx
          .delete(remindersRecords)
          .where(
            and(
              eq(remindersRecords.expenseId, id),
              eq(remindersRecords.vehicleId, activeVehicleId),
            ),
          );
        await tx
          .delete(expensesRecords)
          .where(
            and(
              eq(expensesRecords.id, id),
              eq(expensesRecords.vehicleId, activeVehicleId),
            ),
          );
        return reminders.map((reminder) => reminder.id);
      });
      await Promise.all(reminderIds.map(removeReminderNotification));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useGetExpense(id: number | null) {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: [...expenseQueryKey.byId(id ?? 0), vehicleId],
    queryFn: () => {
      if (id === null) return undefined;
      return db.query.expensesRecords.findFirst({
        where: and(
          eq(expensesRecords.id, id),
          eq(expensesRecords.vehicleId, vehicleId ?? 1),
        ),
      });
    },
    enabled: !!id && vehicleId !== undefined,
  });
}
