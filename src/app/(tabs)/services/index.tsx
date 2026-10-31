import { PlusIcon, WrenchIcon } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Theme, GlobalStyles } from "@/constants";
import { useServices } from "@/repositories/service-repository";
import { useTranslation } from "@/languages/useTranslation";
import { getServiceTypeTitle } from "@/types/interfaces";
import { EmptyState } from "@/components/EmptyState";
import { RecordCard } from "@/components/RecordCard";
import { useStatistics } from "@/repositories/statistics";
import { Text } from "@/components/Text";
import { ValueWithHelp } from "@/components/ValueWithHelp";
import { router } from "expo-router";
import { numberFormat } from "@/utils/number-format";
import { FloatButton } from "@/components/FloatButton";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";

export default function ServicesScreen() {
  const { t, isRTL } = useTranslation();
  const navigateOnce = useNavigationGuard();

  const { data: services } = useServices();
  const { statistics } = useStatistics();

  return (
    <View style={[styles.wrapper, isRTL && { direction: "rtl" }]}>
      <FloatButton
        icon={PlusIcon}
        text={t("services.createTitle")}
        color={Theme.mulberry}
        placement={isRTL ? "left" : "right"}
        onPress={() => navigateOnce(() => router.push("/services/form"))}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {statistics.services.totalServiceCost > 0 && (
          <View style={GlobalStyles.summaryCard}>
            <Text style={GlobalStyles.summaryTitle}>
              {t("services.totalServiceCost")}
            </Text>
            <ValueWithHelp
              value={statistics.services.totalServiceCost}
              help={t("common.priceSign")}
              style={GlobalStyles.summaryValue}
            />
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
                title={getServiceTypeTitle(service.type, t)}
                date={service.date}
                amount={service.cost}
                help={t("common.priceSign")}
                subtitle={`${numberFormat(service.odometer, { isRTL })} ${t("common.odometer")}`}
                icon={WrenchIcon}
                color={Theme.mulberry}
                rtl={isRTL}
                onPress={(id) => {
                  navigateOnce(() =>
                    router.push({
                      pathname: "/services/form",
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
