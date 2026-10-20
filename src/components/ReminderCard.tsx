import { Text } from "@/components/Text";
import { Colors } from "@/constants";
import {
  type TranslationKey,
  useTranslation,
} from "@/languages/useTranslation";
import {
  getExpenseTypeTitle,
  getServiceTypeTitle,
  type ReminderDto,
} from "@/types/interfaces";
import { dateFormat } from "@/utils/date-format";
import type { ReminderCardProp } from "@/utils/service-reminders";
import {
  BanknoteIcon,
  CalendarIcon,
  GaugeIcon,
  WrenchIcon,
} from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

interface Props {
  reminder: ReminderCardProp;
  onPress?: (id: number) => void;
}

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const getTitle = (
  reminder: ReminderDto,
  t: (key: TranslationKey) => string,
) => {
  if (reminder.serviceType) {
    return getServiceTypeTitle(reminder.serviceType, t);
  }

  if (reminder.expenseType) {
    return getExpenseTypeTitle(reminder.expenseType, t);
  }

  return "";
};

export function ReminderCard({ reminder, onPress }: Props) {
  const { t, isRTL } = useTranslation();
  const primaryProgress = reminder.dateProgress ?? reminder.odometerProgress;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        !reminder.data.active && styles.cardDisabled,
      ]}
      onPress={() => onPress?.(reminder.data.id)}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: reminder.progressColor + 15 },
          ]}
        >
          {reminder.data.expenseType && (
            <BanknoteIcon color={reminder.progressColor} />
          )}
          {reminder.data.serviceType && (
            <WrenchIcon color={reminder.progressColor} />
          )}
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {getTitle(reminder.data, t)}
          </Text>
          <Text style={styles.subtitle}>
            {reminder.data.active ? t("common.active") : t("common.inactive")}
          </Text>
        </View>
        {primaryProgress?.overdue && (
          <View style={[styles.badge, { backgroundColor: Colors.danger + 15 }]}>
            <Text style={[styles.badgeText, { color: Colors.danger }]}>
              {t("reminders.overdue")}
            </Text>
          </View>
        )}
      </View>

      {reminder.dateProgress && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <CalendarIcon size={14} color={Colors.textSecondary} />
            <Text style={styles.progressLabel}>
              {t("reminders.dueOn")}{" "}
              {dateFormat(isRTL, reminder.dateProgress.dueDate)}
            </Text>
            <Text
              style={[
                styles.progressValue,
                {
                  color: reminder.progressColor,
                },
              ]}
            >
              {reminder.dateProgress.overdue
                ? `${Math.abs(reminder.dateProgress.remainingDays)} ${t("reminders.daysOverdue")}`
                : reminder.dateProgress.remainingDays === 0
                  ? t("reminders.dueToday")
                  : `${reminder.dateProgress.remainingDays} ${t("reminders.daysRemaining")}`}
            </Text>
          </View>
          <ProgressBar
            progress={reminder.dateProgress.progress}
            color={reminder.progressColor}
          />
        </View>
      )}

      {reminder.odometerProgress && (
        <View
          style={[
            styles.progressSection,
            reminder.dateProgress && styles.progressSectionSpaced,
          ]}
        >
          <View style={styles.progressHeader}>
            <GaugeIcon size={14} color={Colors.textSecondary} />
            <Text style={styles.progressLabel}>
              {t("reminders.dueAt")}{" "}
              {reminder.odometerProgress.dueOdometer.toLocaleString()}{" "}
              {t("common.km")}
            </Text>
            <Text
              style={[
                styles.progressValue,
                {
                  color: reminder.progressColor,
                },
              ]}
            >
              {reminder.odometerProgress.overdue
                ? `${Math.abs(reminder.odometerProgress.remainingKm).toLocaleString()} ${t("common.km")} ${t("reminders.passed")}`
                : `${reminder.odometerProgress.remainingKm.toLocaleString()} ${t("common.km")} ${t("reminders.remaining")}`}
            </Text>
          </View>
          <ProgressBar
            progress={reminder.odometerProgress.progress}
            color={reminder.progressColor}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardPressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
    marginStart: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 600,
  },
  progressSection: {},
  progressSectionSpaced: {
    marginTop: 10,
    paddingTop: 10,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  progressLabel: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: 500,
  },
  progressValue: {
    fontSize: 13,
    fontWeight: 600,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});
