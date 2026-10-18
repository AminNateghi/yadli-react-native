import { FuelIcon } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { EmptyState } from "@/components/EmptyState";
import { PriceValue } from "@/components/PriceValue";
import { RecordCard } from "@/components/RecordCard";
import { Text } from "@/components/Text";
import { Colors, globalStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { useFuels } from "@/repositories/fuel-repository";
import { useStatistics } from "@/repositories/statistics-repository";
import { router } from "expo-router";

export default function FuelScreen() {
  const { t, isRTL } = useTranslation();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const { data: fuels } = useFuels();
  const { totalFuelCost, avgKmPerLiter } = useStatistics();

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
        {/* // TODO: if more than 10 liter red else green */}
        {/* {avgKmPerLiter > 0 && (
          <View style={styles.disPerLiterCard}>
            <View style={styles.disPerLiterIconContainer}>
              <TrendingUpIcon size={20} color={Colors.success} />
            </View>
            <View>
              <Text style={styles.disPerLiterValue}>
                {avgKmPerLiter.toFixed(1)} {t("fuel.kmPerLiter")}
              </Text>
              <Text style={styles.disPerLiterLabel}>
                {t("fuel.averageFuelEconomy")}
              </Text>
            </View>
          </View>
        )} */}

        {totalFuelCost > 0 && (
          <View style={globalStyles.summaryCard}>
            <Text style={globalStyles.summaryTitle}>
              {t("fuel.totalFuelCost")}
            </Text>
            <PriceValue
              value={totalFuelCost?.toFixed(2)}
              style={globalStyles.summaryValue}
            />
          </View>
        )}

        {fuels?.length === 0 ? (
          <EmptyState
            icon={FuelIcon}
            title={t("fuel.noFuelRecords")}
            subtitle={t("fuel.fuelDescription")}
          />
        ) : (
          fuels?.map((fuel) => {
            return (
              <RecordCard
                id={fuel.id}
                key={fuel.id}
                title={`${fuel.liters?.toFixed(1)} ${t("common.liter")}`}
                date={fuel.date}
                amount={fuel.totalCost}
                subtitle={`${fuel.odometer} ${t("common.km")}`}
                icon={FuelIcon}
                color={Colors.fuel}
                rtl={isRTL}
                onPress={(id) => {
                  router.push({
                    pathname: "/fuel/form",
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
