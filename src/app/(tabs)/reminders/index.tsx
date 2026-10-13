import { TimerIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { EmptyState } from "@/components/EmptyState";
import { Colors } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { useReminders } from "@/repositories/reminder-repository";
import { ReminderForm } from "@/components/forms/ReminderForm";
import { ReminderCard } from "@/components/ReminderCard";
import { getReminders, type ReminderCardProp } from "@/utils/serviceReminders";
import { useServices } from "@/repositories/service-repository";
import { useFuels } from "@/repositories/fuel-repository";
import { useExpenses } from "@/repositories/expense-repository";

export default function ServiceRemindersScreen() {
  const { t, isRTL } = useTranslation();
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [editingId, setEditingId] = useState<number | null>(null);
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
        contentContainerStyle={[
          styles.content,
          isDesktop && styles.contentDesktop,
        ]}
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
                  setEditingId(id);
                }}
              />
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <ReminderForm editingId={editingId} onClose={() => setEditingId(null)} />
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
  contentDesktop: {
    maxWidth: 1024,
    alignSelf: "center",
    width: "100%",
  },
});
