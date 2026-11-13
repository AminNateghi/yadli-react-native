import { GlobalStyles, Theme } from "@/constants";
import { BanknoteIcon, ListOrderedIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { DoubleLabel } from "../DoubleLabel";
import { numberFormat } from "@/utils/number-format";
import { useTranslation } from "@/languages/useTranslation";
import { useStatistics } from "@/repositories/statistics";

export default function ReportServices() {
  const { t, isRTL, currencySymbol } = useTranslation();
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
            })}
            size="large"
            bottomSpanLabel={currencySymbol}
          />
        </View>
        <View style={GlobalStyles.separator} />
        <View style={styles.row}>
          <View style={[styles.col, styles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.serviceCostThisYear
                  : statistics.services.serviceCostThisYear,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.thisYear")}
              topSpanLabel={currencySymbol}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.serviceCostPreviousYear
                  : statistics.services.serviceCostPreviousYear,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.previousYear")}
              topSpanLabel={currencySymbol}
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
                },
              )}
              bottomLabel={t("dashboard.thisMonth")}
              topSpanLabel={currencySymbol}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.serviceCostPreviousMonth
                  : statistics.services.serviceCostPreviousMonth,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.previousMonth")}
              topSpanLabel={currencySymbol}
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
        <View style={GlobalStyles.separator} />
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
            })}
            size="large"
            bottomSpanLabel={currencySymbol}
          />
        </View>
        <View style={GlobalStyles.separator} />
        <View style={styles.row}>
          <View style={[styles.col, styles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.averageCostPerDay
                  : statistics.services.averageCostPerDay,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("reports.averageCostPerDay")}
              topSpanLabel={currencySymbol}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.averageCostPerKilometer
                  : statistics.services.averageCostPerKilometer,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("reports.averageCostPerKilometer")}
              topSpanLabel={currencySymbol}
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
                },
              )}
              bottomLabel={t("reports.maxServiceAmount")}
              topSpanLabel={currencySymbol}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.services.minServiceAmount
                  : statistics.services.minServiceAmount,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("reports.minServiceAmount")}
              topSpanLabel={currencySymbol}
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
