import { useMutation, useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  expensesRecords,
  fuelsRecords,
  profileRecords,
  remindersRecords,
  servicesRecords,
} from "@/db/schema";
import type { LanguageType } from "@/types/interfaces";
import { queryClient } from "../utils/query-client";
import { remindersQueryKey } from "./reminder-repository";
import { expenseQueryKey } from "./expense-repository";
import { fuelQueryKey } from "./fuel-repository";
import { serviceQueryKey } from "./service-repository";

export const profileQueryKey = {
  profile: ["profile"],
};

export function useSaveProfileName() {
  return useMutation({
    mutationFn: async (fullName: string) =>
      await db.update(profileRecords).set({
        id: 1,
        fullName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey.profile });
    },
  });
}

export function useSaveProfileLanguage() {
  return useMutation({
    mutationFn: async (language: LanguageType) =>
      await db.update(profileRecords).set({
        id: 1,
        language,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey.profile });
    },
  });
}

export function useCompleteOnboarding() {
  return useMutation({
    mutationFn: async () =>
      await db.update(profileRecords).set({
        id: 1,
        onboarding: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey.profile });
    },
  });
}

export function useGetProfile() {
  return useQuery({
    queryKey: profileQueryKey.profile,
    queryFn: async () => {
      const profile = await db.query.profileRecords.findFirst({
        where: eq(profileRecords.id, 1),
      });

      if (profile) {
        return profile;
      }

      const [created] = await db
        .insert(profileRecords)
        .values({
          id: 1,
          fullName: "بدون اسم",
          language: "fa",
          vehicleName: "خودرو من",
        })
        .returning();

      return created;
    },
  });
}

export function useResetAllData() {
  return useMutation({
    mutationFn: async () =>
      await db.transaction(async (tx) => {
        await tx.delete(remindersRecords);
        await tx.delete(expensesRecords);
        await tx.delete(servicesRecords);
        await tx.delete(fuelsRecords);
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersQueryKey.list });
      queryClient.invalidateQueries({ queryKey: expenseQueryKey.list });
      queryClient.invalidateQueries({ queryKey: fuelQueryKey.list });
      queryClient.invalidateQueries({ queryKey: serviceQueryKey.list });
    },
  });
}
