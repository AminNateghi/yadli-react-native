import { Text } from "@/components/Text";
import { Theme } from "@/constants";
import {
  BusIcon,
  CarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDotIcon,
  CircleSlashIcon,
  MotorbikeIcon,
  TractorIcon,
  TruckIcon,
} from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import type { VehicleDto } from "@/types/interfaces";

interface VehicleRecordCardProps {
  id: number;
  vehicle: VehicleDto;
  rtl: boolean;
  active: boolean;
  onPress?: (id: number) => void;
}

export function VehicleRecordCard({
  id,
  vehicle,
  rtl,
  active = false,
  onPress,
}: VehicleRecordCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        active && styles.activeCard,
      ]}
      onPress={() => onPress?.(id)}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: Theme.primary + 15 }]}
      >
        {vehicle?.type === "Car" && <CarIcon size={20} color={Theme.primary} />}
        {vehicle?.type === "Motorcycle" && (
          <MotorbikeIcon size={20} color={Theme.primary} />
        )}
        {vehicle?.type === "Truck" && (
          <TruckIcon size={20} color={Theme.primary} />
        )}
        {vehicle?.type === "Bus" && <BusIcon size={20} color={Theme.primary} />}
        {vehicle?.type === "Tractor" && (
          <TractorIcon size={20} color={Theme.primary} />
        )}
        {vehicle?.type === "Other" && (
          <CircleDotIcon size={20} color={Theme.primary} />
        )}
        {vehicle?.type === undefined && (
          <CircleSlashIcon size={20} color={Theme.primary} />
        )}
      </View>
      <View style={[styles.content]}>
        <Text style={styles.title} numberOfLines={1}>
          {vehicle?.customName ?? "-"}
        </Text>
        {vehicle?.makeModel && (
          <Text style={styles.date}>{vehicle.makeModel}</Text>
        )}
        {vehicle?.year && <Text style={styles.date}>{vehicle.year}</Text>}
      </View>
      <View style={styles.rightContent}>
        {rtl ? (
          <ChevronLeftIcon size={18} color={Theme.textMuted} />
        ) : (
          <ChevronRightIcon size={18} color={Theme.textMuted} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  activeCard: {
    backgroundColor: Theme.primary + 15,
  },
  cardPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: Theme.borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    marginStart: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: 600,
    color: Theme.text,
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: Theme.textSecondary,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
