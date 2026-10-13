import { useMutation, useQuery } from "@tanstack/react-query";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { queryClient } from "../utils/query-client";
import { remindersRecords } from "@/db/schema";
import type { ReminderDto } from "@/types/interfaces";

export const remindersQueryKey = {
  list: ["reminder-list"],
  byId: (id: number) => ["reminder-get", id],
};

export function useReminders(limit?: number) {
  return useQuery({
    queryKey: remindersQueryKey.list,
    queryFn: async () =>
      db
        .select()
        .from(remindersRecords)
        .orderBy(desc(remindersRecords.id))
        .limit(limit ?? 1000),
  });
}

export function useCreateReminder() {
  return useMutation({
    mutationFn: async (values: Omit<ReminderDto, "id">) =>
      await db.insert(remindersRecords).values(values),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
    },
  });
}

export function useUpdateReminder(id: number) {
  return useMutation({
    mutationFn: async (values: Partial<ReminderDto>) =>
      await db
        .update(remindersRecords)
        .set(values)
        .where(eq(remindersRecords.id, id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.byId(id) });
    },
  });
}

export function useDeleteReminder() {
  return useMutation({
    mutationFn: (id: number) =>
      db.delete(remindersRecords).where(eq(remindersRecords.id, id)),
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
    enabled: id !== null,
  });
}

interface CompleteReminderProps {
  reminderId: number;
  actualOdometer: number;
  actualDate: Date;
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
          .update(remindersRecords)
          .set({
            active: false,
            updatedAt: new Date(),
          })
          .where(eq(remindersRecords.id, props.reminderId));

        return;
      }

      // const nextOdometer =
      //   reminder.odometerInterval != null
      //     ? props.actualOdometer + reminder.odometerInterval
      //     : null;

      // const d = dayjs(props.actualDate);

      // const nextDate =
      //   reminder.dateIntervalMonths != null
      //     ? d.add(reminder.dateIntervalMonths, "months")
      //     : null;

      await db
        .update(remindersRecords)
        .set({
          startOdometer: props.actualOdometer,
          startDate: props.actualDate,

          active: true,
          updatedAt: new Date(),
        })
        .where(eq(remindersRecords.id, props.reminderId));
    },
  });
}
