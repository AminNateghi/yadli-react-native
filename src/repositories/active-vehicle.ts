import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profileRecords } from "@/db/schema";

export const activeVehicleQueryKey = ["active-vehicle-id"];

export function useActiveVehicleId() {
  return useQuery({
    queryKey: activeVehicleQueryKey,
    queryFn: async () => {
      const profile = await db.query.profileRecords.findFirst({
        where: eq(profileRecords.id, 1),
      });
      return profile?.activeVehicleId ?? 1;
    },
  });
}

export async function getActiveVehicleId() {
  const profile = await db.query.profileRecords.findFirst({
    where: eq(profileRecords.id, 1),
  });
  return profile?.activeVehicleId ?? 1;
}
