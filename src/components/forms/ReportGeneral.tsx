import { Theme, ReportStyles } from "@/constants";
import { WalletIcon } from "lucide-react-native";
import { View } from "react-native";
import { DoubleLabel } from "../DoubleLabel";
import { numberFormat } from "@/utils/number-format";
import { useTranslation } from "@/languages/useTranslation";
import { useStatistics } from "@/repositories/statistics";

export default function ReportGeneral() {
  const { t, isRTL } = useTranslation();
  const { statistics, persianStatistics } = useStatistics();

  return (
    <>
      {/* ====== Total Cost ====== */}
      <View style={ReportStyles.card}>
        <View style={ReportStyles.rowTitle}>
          <View
            style={[
              ReportStyles.iconContainer,
              { backgroundColor: Theme.text + 15 },
            ]}
          >
            <WalletIcon size={22} color={Theme.text} />
          </View>
          <DoubleLabel
            topLabel={t("dashboard.totalSpent")}
            bottomLabel={numberFormat(statistics.general.totalSpent, { isRTL })}
            size="large"
            bottomSpanLabel={t("common.priceSign")}
          />
        </View>
        <View style={ReportStyles.separator} />
        <View style={ReportStyles.row}>
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.general.totalCostThisYear
                  : statistics.general.totalCostThisYear,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.thisYear")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.general.totalCostPreviousYear
                  : statistics.general.totalCostPreviousYear,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.previousYear")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
          </View>

          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.general.totalCostThisMonth
                  : statistics.general.totalCostThisMonth,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.thisMonth")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.general.totalCostPreviousMonth
                  : statistics.general.totalCostPreviousMonth,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.previousMonth")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
          </View>
        </View>
      </View>

      {/* ====== Average ====== */}
      <View style={ReportStyles.card}>
        <View style={ReportStyles.row}>
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(statistics.general.averageCostPerMonth, {
                isRTL,
                type: "decimal",
              })}
              bottomLabel={t("reports.averageCostPerMonth")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(statistics.general.averageCostPerDay, {
                isRTL,
                type: "decimal",
              })}
              bottomLabel={t("reports.averageCostPerDay")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                statistics.general.averageCostPerKilometer,
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
        </View>
      </View>
    </>
  );
}
