import { PlusIcon, TimerIcon } from "lucide-react-native";
import { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { useReminders } from "@/repositories/reminder-repository";
import { ReminderCard } from "@/components/ReminderCard";
import { getReminders } from "@/utils/service-reminders";
import { useServices } from "@/repositories/service-repository";
import { useFuels } from "@/repositories/fuel-repository";
import { useExpenses } from "@/repositories/expense-repository";
import { router } from "expo-router";
import { FloatButton } from "@/components/FloatButton";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";

export default function RemindersScreen() {
  const { t, isRTL } = useTranslation();
  const navigateOnce = useNavigationGuard();

  const { data } = useReminders();
  const { data: services } = useServices();
  const { data: fuels } = useFuels();
  const { data: expenses } = useExpenses();

  const reminders = useMemo(() => {
    if (!data || !services || !fuels || !expenses) return [];

    return getReminders(data, {
      services,
      fuels,
      expense: expenses,
    });
  }, [data, services, fuels, expenses]);

  return (
    <View style={[styles.wrapper, isRTL && { direction: "rtl" }]}>
      <FloatButton
        icon={PlusIcon}
        text={t("reminders.createTitle")}
        color={Theme.green}
        placement={isRTL ? "left" : "right"}
        onPress={() => navigateOnce(() => router.push("/reminders/form"))}
      />
      <FlatList
        style={styles.container}
        data={reminders}
        keyExtractor={(reminder) => String(reminder.data.id)}
        renderItem={({ item: reminder }) => (
          <ReminderCard
            reminder={reminder}
            onPress={(id) => {
              navigateOnce(() =>
                router.push({
                  pathname: "/reminders/form",
                  params: { id },
                }),
              );
            }}
          />
        )}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={TimerIcon}
            title={t("reminders.noReminders")}
            subtitle={t("reminders.noRemindersDescription")}
          />
        }
        ListFooterComponent={<View style={styles.listFooter} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  listFooter: {
    height: 100,
  },
});
