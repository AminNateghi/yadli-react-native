import { TimerIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { Colors } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { useReminders } from "@/repositories/reminder-repository";
import { ReminderCard } from "@/components/ReminderCard";
import { getReminders, type ReminderCardProp } from "@/utils/serviceReminders";
import { useServices } from "@/repositories/service-repository";
import { useFuels } from "@/repositories/fuel-repository";
import { useExpenses } from "@/repositories/expense-repository";
import { router } from "expo-router";
import { Button } from "@/components/Button";

export default function ServiceRemindersScreen() {
  const { t, isRTL } = useTranslation();
  const [reminders, setReminders] = useState<ReminderCardProp[]>([]);

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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!reminders || reminders?.length === 0 ? (
          <>
            <EmptyState
              icon={TimerIcon}
              title={t("reminders.noReminders")}
              subtitle={t("reminders.noRemindersDescription")}
            />
            <Button
              title={t("common.new")}
              onPress={() => router.push("/reminders/form")}
              style={{ flex: 1 }}
            />
          </>
        ) : (
          reminders?.map((reminder) => {
            return (
              <ReminderCard
                key={reminder?.data?.id}
                reminder={reminder}
                onPress={(id) => {
                  router.push({
                    pathname: "/reminders/form",
                    params: { id },
                  });
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
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
