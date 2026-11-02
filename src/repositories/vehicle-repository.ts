import { useMutation, useQuery } from "@tanstack/react-query";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  expensesRecords,
  fuelsRecords,
  profileRecords,
  remindersRecords,
  servicesRecords,
  vehiclesRecords,
} from "@/db/schema";
import type { LanguageType, VehicleDto } from "@/types/interfaces";
import { getTranslation } from "@/languages/translation";
import { queryClient } from "@/utils/query-client";
import { activeVehicleQueryKey } from "./active-vehicle";
import { profileQueryKey } from "./profile-repository";
import { expenseQueryKey } from "./expense-repository";
import { fuelQueryKey } from "./fuel-repository";
import { remindersQueryKey } from "./reminder-repository";
import { serviceQueryKey } from "./service-repository";
import { removeReminderNotification } from "@/utils/reminder-notifications";

export const vehicleQueryKey = {
  list: ["vehicle-list"],
  byId: (id: number) => ["vehicle-get", id],
};

async function ensureDefaultVehicle() {
  return db.transaction(async (tx) => {
    let [defaultVehicle] = await tx
      .select()
      .from(vehiclesRecords)
      .orderBy(asc(vehiclesRecords.id))
      .limit(1);

    const profile = await tx.query.profileRecords.findFirst({
      where: eq(profileRecords.id, 1),
    });
    if (!defaultVehicle) {
      const language: LanguageType = profile?.language ?? "fa";
      const [createdVehicle] = await tx
        .insert(vehiclesRecords)
        .values({
          customName: getTranslation(language, "dashboard.myVehicle"),
          fuelType: "Gasoline",
        })
        .returning();
      if (!createdVehicle) {
        throw new Error("Default vehicle could not be created");
      }
      defaultVehicle = createdVehicle;
    }

    const activeVehicle = profile
      ? await tx.query.vehiclesRecords.findFirst({
          where: eq(vehiclesRecords.id, profile.activeVehicleId),
        })
      : undefined;
    if (profile && !activeVehicle) {
      await tx
        .update(profileRecords)
        .set({ activeVehicleId: defaultVehicle.id })
        .where(eq(profileRecords.id, 1));
    } else if (!profile) {
      await tx.insert(profileRecords).values({
        id: 1,
        activeVehicleId: defaultVehicle.id,
      });
    }

    return defaultVehicle;
  });
}

export function useVehicles() {
  return useQuery<VehicleDto[]>({
    queryKey: vehicleQueryKey.list,
    queryFn: async () => {
      await ensureDefaultVehicle();
      return db.select().from(vehiclesRecords).orderBy(asc(vehiclesRecords.id));
    },
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
    mutationFn: async (id: number) => {
      const { reminderIds } = await db.transaction(async (tx) => {
        const vehicle = await tx.query.vehiclesRecords.findFirst({
          where: eq(vehiclesRecords.id, id),
        });
        if (!vehicle) {
          throw new Error("Vehicle not found");
        }

        const profile = await tx.query.profileRecords.findFirst({
          where: eq(profileRecords.id, 1),
        });
        const reminders = await tx
          .select({ id: remindersRecords.id })
          .from(remindersRecords)
          .where(eq(remindersRecords.vehicleId, id));

        await tx
          .delete(remindersRecords)
          .where(eq(remindersRecords.vehicleId, id));
        await tx
          .delete(expensesRecords)
          .where(eq(expensesRecords.vehicleId, id));
        await tx
          .delete(servicesRecords)
          .where(eq(servicesRecords.vehicleId, id));
        await tx.delete(fuelsRecords).where(eq(fuelsRecords.vehicleId, id));
        await tx.delete(vehiclesRecords).where(eq(vehiclesRecords.id, id));

        const [nextVehicle] = await tx
          .select()
          .from(vehiclesRecords)
          .orderBy(asc(vehiclesRecords.id))
          .limit(1);
        const deletedActiveVehicle = !profile || profile.activeVehicleId === id;
        if (deletedActiveVehicle || !nextVehicle) {
          let activeVehicleId = nextVehicle?.id;
          if (activeVehicleId === undefined) {
            const language: LanguageType = profile?.language ?? "fa";
            const [fallbackVehicle] = await tx
              .insert(vehiclesRecords)
              .values({
                customName: getTranslation(language, "dashboard.myVehicle"),
                fuelType: "Gasoline",
              })
              .returning();
            if (!fallbackVehicle) {
              throw new Error("Replacement vehicle could not be created");
            }
            activeVehicleId = fallbackVehicle.id;
          }

          if (profile) {
            await tx
              .update(profileRecords)
              .set({ activeVehicleId })
              .where(eq(profileRecords.id, 1));
          } else {
            await tx.insert(profileRecords).values({
              id: 1,
              activeVehicleId,
            });
          }
        }

        return { reminderIds: reminders.map((reminder) => reminder.id) };
      });

      const notificationResults = await Promise.allSettled(
        reminderIds.map((reminderId) => removeReminderNotification(reminderId)),
      );
      return {
        notificationCleanupFailed: notificationResults.some(
          (result) => result.status === "rejected",
        ),
      };
    },
    onSettled: () => {
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
