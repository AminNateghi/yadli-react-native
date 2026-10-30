import { Theme } from "@/constants";
import { BanknoteIcon, ListOrderedIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { DoubleLabel } from "../DoubleLabel";
import { numberFormat } from "@/utils/number-format";
import { useTranslation } from "@/languages/useTranslation";
import { useStatistics } from "@/repositories/statistics";

export default function ReportServices() {
  const { t, isRTL } = useTranslation();
  const { statistics, persianStatistics } = useStatistics();

  return (
    <>
      {/* ====== Total Service Cost ====== */}
      <View style={styles.card}>
        <View style={styles.rowTitle}>
          <View
            style={[styles.iconContainer, { backgroundColor: Theme.text + 15 }]}
          >
            <BanknoteIcon size={22} color={Theme.text} />
          </View>
          <DoubleLabel
            topLabel={t("reports.totalServiceCost")}
            bottomLabel={numberFormat(statistics.services.totalServiceCost, {
              isRTL,
              type: "decimal",
            })}
            size="large"
            bottomSpanLabel={t("common.priceSign")}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={[styles.col, styles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.serviceCostThisYear
                  : statistics.services.serviceCostThisYear,
                {
                  isRTL,
                  type: "decimal",
                },
              )}
              bottomLabel={t("dashboard.thisYear")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.serviceCostPreviousYear
                  : statistics.services.serviceCostPreviousYear,
                {
                  isRTL,
                  type: "decimal",
                },
              )}
              bottomLabel={t("dashboard.previousYear")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
          </View>

          <View style={[styles.col, styles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.serviceCostThisMonth
                  : statistics.services.serviceCostThisMonth,
                {
                  isRTL,
                  type: "decimal",
                },
              )}
              bottomLabel={t("dashboard.thisMonth")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.serviceCostPreviousMonth
                  : statistics.services.serviceCostPreviousMonth,
                {
                  isRTL,
                  type: "decimal",
                },
              )}
              bottomLabel={t("dashboard.previousMonth")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
          </View>
        </View>
      </View>

      {/* ====== length ====== */}
      <View style={styles.card}>
        <View style={styles.rowTitle}>
          <View
            style={[styles.iconContainer, { backgroundColor: Theme.text + 15 }]}
          >
            <ListOrderedIcon size={22} color={Theme.text} />
          </View>
          <DoubleLabel
            topLabel={t("reports.serviceLength")}
            bottomLabel={numberFormat(
              statistics.services.serviceRecordsLength,
              { isRTL },
            )}
            size="large"
            bottomSpanLabel={t("common.times")}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={[styles.col, styles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.lengthThisYear
                  : statistics.services.lengthThisYear,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.thisYear")}
              topSpanLabel={t("common.times")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.lengthPreviousYear
                  : statistics.services.lengthPreviousYear,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.previousYear")}
              topSpanLabel={t("common.times")}
              size="small"
            />
          </View>
          <View style={[styles.col, styles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.lengthThisMonth
                  : statistics.services.lengthThisMonth,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.thisMonth")}
              topSpanLabel={t("common.times")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.lengthPreviousMonth
                  : statistics.services.lengthPreviousMonth,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.previousMonth")}
              topSpanLabel={t("common.times")}
              size="small"
            />
          </View>
        </View>
      </View>

      {/* ====== average ====== */}
      <View style={styles.card}>
        <View style={styles.rowTitle}>
          <View
            style={[styles.iconContainer, { backgroundColor: Theme.text + 15 }]}
          >
            <BanknoteIcon size={22} color={Theme.text} />
          </View>
          <DoubleLabel
            topLabel={t("reports.averageCostPerMonth")}
            bottomLabel={numberFormat(statistics.services.averageCostPerMonth, {
              isRTL,
              type: "decimal",
            })}
            size="large"
            bottomSpanLabel={t("common.priceSign")}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={[styles.col, styles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.averageCostPerDay
                  : statistics.services.averageCostPerDay,
                {
                  isRTL,
                  type: "decimal",
                },
              )}
              bottomLabel={t("reports.averageCostPerDay")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.averageCostPerKilometer
                  : statistics.services.averageCostPerKilometer,
                {
                  isRTL,
                  type: "decimal",
                },
              )}
              bottomLabel={t("reports.averageCostPerKilometer")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
          </View>
          <View style={[styles.col, styles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.maxServiceAmount
                  : statistics.services.maxServiceAmount,
                {
                  isRTL,
                  type: "decimal",
                },
              )}
              bottomLabel={t("reports.maxServiceAmount")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.minServiceAmount
                  : statistics.services.minServiceAmount,
                {
                  isRTL,
                  type: "decimal",
                },
              )}
              bottomLabel={t("reports.minServiceAmount")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    marginTop: 5,
    marginBottom: 5,
    height: 1,
    backgroundColor: Theme.borderLight,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
  },
  rowTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  col: {
    flexDirection: "column",
    alignItems: "baseline",
    gap: 10,
  },
  card: {
    backgroundColor: Theme.surface,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: 140,
    marginBottom: 10,
  },
});
