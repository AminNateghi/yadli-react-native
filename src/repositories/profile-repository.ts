import { useMutation, useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profileRecords } from "@/db/schema";
import type { LanguageType } from "@/types/interfaces";
import { queryClient } from "../utils/query-client";

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
    onSuccess: () => {},
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

export function useGetProfile() {
  return useQuery({
    queryKey: profileQueryKey.profile,
    queryFn: async () => {
      const existing = await db.query.profileRecords.findFirst({
        where: eq(profileRecords.id, 1),
      });

      if (existing) {
        return existing;
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
