import { useMutation, useQuery } from "@tanstack/react-query";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { queryClient } from "../utils/query-client";
import { remindersRecords } from "@/db/schema";
import type { ReminderDto } from "@/types/interfaces";
import {
  removeReminderNotification,
  syncReminderNotification,
} from "@/utils/reminder-notifications";
import {
  assertVehicleNotSold,
  getActiveVehicleId,
  useActiveVehicleId,
} from "./active-vehicle";

export const remindersQueryKey = {
  list: ["reminder-list"],
  byId: (id: number) => ["reminder-get", id],
};

export function useReminders() {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: [...remindersQueryKey.list, vehicleId],
    queryFn: async () =>
      db
        .select()
        .from(remindersRecords)
        .where(eq(remindersRecords.vehicleId, vehicleId ?? 1))
        .orderBy(desc(remindersRecords.id)),
    enabled: vehicleId !== undefined,
  });
}

export function useCreateReminder() {
  return useMutation({
    mutationFn: async (values: Omit<ReminderDto, "id" | "vehicleId">) => {
      const vehicleId = await getActiveVehicleId();
      await assertVehicleNotSold(vehicleId);
      const [reminder] = await db
        .insert(remindersRecords)
        .values({ ...values, vehicleId })
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
  const { data: vehicleId } = useActiveVehicleId();
  return useMutation({
    mutationFn: async (
      values: Partial<Omit<ReminderDto, "id" | "vehicleId">>,
    ) => {
      const activeVehicleId = vehicleId ?? (await getActiveVehicleId());
      await assertVehicleNotSold(activeVehicleId);
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
      if (deleted) {
        await removeReminderNotification(id);
      }
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
    queryFn: () => {
      if (id === null) return undefined;
      return db.query.remindersRecords.findFirst({
        where: and(
          eq(remindersRecords.id, id),
          eq(remindersRecords.vehicleId, vehicleId ?? 1),
        ),
      });
    },
    enabled: !!id && vehicleId !== undefined,
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
      const vehicleId = await getActiveVehicleId();
      await assertVehicleNotSold(vehicleId);
      const reminder = await db.query.remindersRecords.findFirst({
        where: and(
          eq(remindersRecords.id, props.reminderId),
          eq(remindersRecords.vehicleId, vehicleId),
        ),
      });

      if (!reminder) {
        throw new Error("Reminder not found");
      }

      if (reminder.mode === "OneTime") {
        await db
          .delete(remindersRecords)
          .where(
            and(
              eq(remindersRecords.id, props.reminderId),
              eq(remindersRecords.vehicleId, vehicleId),
            ),
          );
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
        .where(
          and(
            eq(remindersRecords.id, props.reminderId),
            eq(remindersRecords.vehicleId, vehicleId),
          ),
        )
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
