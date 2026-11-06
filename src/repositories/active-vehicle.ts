import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profileRecords, vehiclesRecords } from "@/db/schema";

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

export function useActiveVehicle() {
  const { data: vehicleId } = useActiveVehicleId();
  return useQuery({
    queryKey: ["active-vehicle", vehicleId],
    queryFn: () =>
      db.query.vehiclesRecords.findFirst({
        where: eq(vehiclesRecords.id, vehicleId ?? 1),
      }),
    enabled: vehicleId !== undefined,
  });
}

export async function assertVehicleNotSold(vehicleId: number): Promise<void> {
  const vehicle = await db.query.vehiclesRecords.findFirst({
    where: eq(vehiclesRecords.id, vehicleId),
  });
  if (!vehicle) {
    throw new Error("Vehicle not found");
  }
  if (vehicle.sold) {
    throw new Error("Records cannot be changed for a sold vehicle");
  }
}
