import { PlusIcon, TimerIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { useReminders } from "@/repositories/reminder-repository";
import { ReminderCard } from "@/components/ReminderCard";
import { getReminders, type ReminderCardProp } from "@/utils/service-reminders";
import { useServices } from "@/repositories/service-repository";
import { useFuels } from "@/repositories/fuel-repository";
import { useExpenses } from "@/repositories/expense-repository";
import { router } from "expo-router";
import { FloatButton } from "@/components/FloatButton";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";

export default function RemindersScreen() {
  const { t, isRTL } = useTranslation();
  const [reminders, setReminders] = useState<ReminderCardProp[]>([]);
  const navigateOnce = useNavigationGuard();

  const { data } = useReminders();
  const { data: services } = useServices();
  const { data: fuels } = useFuels();
  const { data: expenses } = useExpenses();

  useEffect(() => {
    const loadReminders = async () => {
      if (!data || !services || !fuels || !expenses) return;

      const result = await getReminders(data, {
        services: services || [],
        fuels: fuels || [],
        expense: expenses || [],
      });
      setReminders(result);
    };

    loadReminders();
  }, [data, services, fuels, expenses]);

  return (
    <View style={[styles.wrapper, isRTL && { direction: "rtl" }]}>
      <FloatButton
        icon={PlusIcon}
        text={t("reminders.createTitle")}
        color={Theme.blue}
        placement={isRTL ? "left" : "right"}
        onPress={() => navigateOnce(() => router.push("/reminders/form"))}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!reminders || reminders?.length === 0 ? (
          <EmptyState
            icon={TimerIcon}
            title={t("reminders.noReminders")}
            subtitle={t("reminders.noRemindersDescription")}
          />
        ) : (
          reminders?.map((reminder) => {
            return (
              <ReminderCard
                key={reminder?.data?.id}
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
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
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
});
