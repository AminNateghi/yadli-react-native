import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profileRecords } from "@/db/schema";
import type { LanguageType } from "@/types/interfaces";

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
    onSuccess: () => {},
  });
}

export async function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () =>
      await db.select().from(profileRecords).where(eq(profileRecords.id, 1)),
  });
}
