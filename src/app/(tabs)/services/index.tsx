import { WrenchIcon } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { Colors, globalStyles } from "@/constants/theme";
import { useServices } from "@/repositories/service-repository";
import { useTranslation } from "@/languages/useTranslation";
import { getServiceTypeTitle } from "@/types/interfaces";
import { EmptyState } from "@/components/EmptyState";
import { RecordCard } from "@/components/RecordCard";
import { useStatistics } from "@/repositories/statistics-repository";
import { Text } from "@/components/Text";
import { PriceValue } from "@/components/PriceValue";
import { Button } from "@/components/Button";
import { router } from "expo-router";

export default function ServicesScreen() {
  const { t, isRTL } = useTranslation();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const { data: services } = useServices();
  const { totalServiceCost } = useStatistics();

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
          <View style={globalStyles.summaryCard}>
            <Text style={globalStyles.summaryTitle}>
              {t("services.totalServiceCost")}
            </Text>
            <PriceValue
              value={totalServiceCost?.toFixed(2)}
              style={globalStyles.summaryValue}
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
          <>
            <EmptyState
              icon={WrenchIcon}
              title={t("services.noServicesYet")}
              subtitle={t("services.servicesDescription")}
            />
            <Button
              title={t("common.new")}
              onPress={() => router.push("/services/form")}
              style={{ flex: 1 }}
            />
          </>
        ) : (
          services?.map((service) => {
            return (
              <RecordCard
                id={service.id}
                key={service.id}
                title={getServiceTypeTitle(service.type, t)}
                date={service.date}
                amount={service.cost}
                subtitle={`${service.odometer} ${t("common.km")}`}
                icon={WrenchIcon}
                color={Colors.service}
                rtl={isRTL}
                onPress={(id) => {
                  router.push({
                    pathname: "/services/form",
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
  contentDesktop: {
    maxWidth: 1024,
    alignSelf: "center",
    width: "100%",
  },
});
