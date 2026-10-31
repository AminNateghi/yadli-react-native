import { useMutation, useQuery } from "@tanstack/react-query";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { queryClient } from "../utils/query-client";
import { remindersRecords } from "@/db/schema";
import type { ReminderDto } from "@/types/interfaces";
import {
  removeReminderNotification,
  syncReminderNotification,
} from "@/utils/reminder-notifications";

export const remindersQueryKey = {
  list: ["reminder-list"],
  byId: (id: number) => ["reminder-get", id],
};

export function useReminders() {
  return useQuery({
    queryKey: remindersQueryKey.list,
    queryFn: async () =>
      db.select().from(remindersRecords).orderBy(desc(remindersRecords.id)),
  });
}

export function useCreateReminder() {
  return useMutation({
    mutationFn: async (values: Omit<ReminderDto, "id">) => {
      const [reminder] = await db
        .insert(remindersRecords)
        .values(values)
        .returning();
      if (!reminder) {
        throw new Error("Created reminder could not be read");
      }
      const notificationPermissionGranted =
        await syncReminderNotification(reminder);
      return { reminder, notificationPermissionGranted };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useUpdateReminder(id: number) {
  return useMutation({
    mutationFn: async (values: Partial<ReminderDto>) => {
      const [reminder] = await db
        .update(remindersRecords)
        .set(values)
        .where(eq(remindersRecords.id, id))
        .returning();
      if (!reminder) {
        throw new Error("Reminder not found");
      }
      const notificationPermissionGranted =
        await syncReminderNotification(reminder);
      return { reminder, notificationPermissionGranted };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.byId(id) });
    },
  });
}

export function useDeleteReminder() {
  return useMutation({
    mutationFn: async (id: number) => {
      await db.delete(remindersRecords).where(eq(remindersRecords.id, id));
      await removeReminderNotification(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useGetReminder(id: number | null) {
  return useQuery({
    queryKey: remindersQueryKey.byId(id!),
    queryFn: () =>
      db.query.remindersRecords.findFirst({
        where: eq(remindersRecords.id, id!),
      }),
    enabled: !!id,
  });
}

interface CompleteReminderProps {
  reminderId: number;
  actualOdometer: number | null;
  actualDate: Date | null;
}

export function useCompleteReminder() {
  return useMutation({
    mutationFn: async (props: CompleteReminderProps) => {
      const reminder = await db.query.remindersRecords.findFirst({
        where: eq(remindersRecords.id, props.reminderId!),
      });

      if (!reminder) {
        throw new Error("Reminder not found");
      }

      if (reminder.mode === "OneTime") {
        await db
          .delete(remindersRecords)
          .where(eq(remindersRecords.id, props.reminderId));
        await removeReminderNotification(reminder.id);
        return true;
      }

      const [updatedReminder] = await db
        .update(remindersRecords)
        .set({
          startOdometer: props.actualOdometer,
          startDate: props.actualDate,

          active: true,
        })
        .where(eq(remindersRecords.id, props.reminderId))
        .returning();
      if (!updatedReminder) {
        throw new Error("Reminder not found");
      }
      return await syncReminderNotification(updatedReminder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}
