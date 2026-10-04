import { useLocalSearchParams, useRouter } from "expo-router";
import { PlusIcon, WrenchIcon } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { Colors } from "@/constants/theme";
import { useServices } from "@/contexts/service-repository";
import { useTranslation } from "@/languages/useTranslation";
import { type ServiceDto, serviceTypeOptions } from "@/types/interfaces";
import { EmptyState } from "@/components/EmptyState";
import { RecordCard } from "@/components/RecordCard";
import { useStatistics } from "@/contexts/statistics-repository";
import { Text } from "@/components/Text";
import { PriceValue } from "@/components/PriceValue";

export default function ServicesScreen() {
  const { t, isRTL } = useTranslation();
  const {
    edit,
    add,
    type: addType,
  } = useLocalSearchParams<{
    edit?: string;
    add?: string;
    type?: string;
    prevId?: string;
  }>();

  const isDesktop = useMediaQuery({ minWidth: 768 });

  const { data: services } = useServices();
  const { totalServiceCost } = useStatistics();

  // const reminders = useMemo(async () => {

  //   getServiceReminders(services, stats.totalKm);
  // }, [services, stats.totalKm]);

  // const overdueCount = (await reminders).filter(
  //   (r) => r.dateProgress?.overdue || r.odometerProgress?.overdue,
  // ).length;

  // const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  // const openCreateModal = useCallback(() => {
  //   setModalVisible(true);
  // }, []);

  // useEffect(async () => {
  //   if (edit) {
  //     const service = await getService(Number(edit));

  //     if (service) {
  //       openEditModal(service);
  //       // Clear param so layout updates won't lock the modal open
  //       router.setParams({ edit: undefined });
  //     }
  //   } else if (add) {
  //     openCreateModal(addType as ServiceType | undefined);
  //     // Clear params so layout updates won't lock the modal open
  //     router.setParams({ add: undefined, type: undefined });
  //   }
  // }, [
  //   edit,
  //   add,
  //   addType,
  //   openCreateModal,
  //   openEditModal,
  //   router.setParams,
  //   getService,
  // ]);

  const getServiceLabel = (serviceType: string) =>
    serviceTypeOptions(t).find((s) => s.value === serviceType)?.label || "-";

  // const categoryTotals = useMemo(async () => {
  //   const totals: Record<string, number> = {};

  //   services?.forEach((e) => {
  //     totals[e.type] = (totals[e.type] || 0) + e.cost;
  //   });
  //   return totals;
  // }, [services]);

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
        {/* {reminders.length > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.remindersBanner,
              pressed && styles.remindersBannerPressed,
            ]}
            onPress={() => router.push("/reminders")}
          >
            <View style={styles.remindersBannerIcon}>
              <BellIcon
                size={20}
                color={overdueCount > 0 ? Colors.danger : Colors.service}
              />
            </View>
            <View style={styles.remindersBannerContent}>
              <Text style={styles.remindersBannerTitle}>
                {t("reminders.title")}
              </Text>
              <Text style={styles.remindersBannerSubtitle}>
                {overdueCount > 0
                  ? `${overdueCount} ${t("reminders.needAttention")}`
                  : `${reminders.length} ${t("reminders.activeReminders")}`}
              </Text>
            </View>

            {isRTL ? (
              <ChevronLeftIcon size={18} color={Colors.textMuted} />
            ) : (
              <ChevronRightIcon size={18} color={Colors.textMuted} />
            )}
          </Pressable>
        )} */}

        {totalServiceCost > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              {t("services.totalServiceCost")}
            </Text>
            <PriceValue
              value={totalServiceCost?.toFixed(2)}
              style={styles.summaryValue}
            />
            {/* <View style={styles.categoryBreakdown}>
              {Object.entries(categoryTotals).map(([cat, total]) => (
                <View key={cat} style={styles.categoryItem}>
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: Colors.service },
                    ]}
                  />
                  <Text style={styles.categoryName}>
                    {getServiceLabel(cat)}
                  </Text>
                  <PriceValue
                    value={String(total)}
                    style={styles.categoryTotal}
                  />
                </View>
              ))}
            </View> */}
          </View>
        )}

        {services?.length === 0 ? (
          <EmptyState
            icon={WrenchIcon}
            title={t("services.noServicesYet")}
            subtitle={t("services.servicesDescription")}
          />
        ) : (
          services?.map((service) => {
            return (
              <RecordCard
                id={service.id}
                key={service.id}
                title={getServiceLabel(service.type)}
                date={service.date}
                amount={service.cost}
                subtitle={`${service.odometer} ${t("common.km")}`}
                icon={WrenchIcon}
                color={Colors.service}
                rtl={isRTL}
                onPress={(id) => {
                  setEditingId(id);
                }}
              />
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <ServiceForm editingId={editingId} onClose={() => setEditingId(null)} />
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
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  fabContainerRTL: {
    position: "absolute",
    left: 16,
    bottom: 16,
  },
  fabContainerDesktop: {
    right: 32,
    bottom: 32,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.service,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.8,
  },
  remindersBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  remindersBannerPressed: {
    opacity: 0.85,
  },
  remindersBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.danger + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  remindersBannerContent: {
    flex: 1,
  },
  remindersBannerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  remindersBannerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 4,
  },
  categoryBreakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginEnd: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  categoryTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
});
