import { Colors, ReportStyles } from "@/constants";
import { BinaryIcon, GaugeCircleIcon } from "lucide-react-native";
import { View } from "react-native";
import { DoubleLabel } from "../DoubleLabel";
import { numberFormat } from "@/utils/number-format";
import { useTranslation } from "@/languages/useTranslation";
import { useStatistics } from "@/repositories/statistics";

export default function ReportDistance() {
  const { t, isRTL } = useTranslation();
  const { statistics, persianStatistics } = useStatistics();

  return (
    <>
      {/* ====== Distance ====== */}
      <View style={ReportStyles.card}>
        <View style={ReportStyles.rowTitle}>
          <View
            style={[
              ReportStyles.iconContainer,
              { backgroundColor: Colors.text + 15 },
            ]}
          >
            <BinaryIcon size={22} color={Colors.text} />
          </View>
          <DoubleLabel
            topLabel={t("reports.totalDistanceKm")}
            bottomLabel={numberFormat(statistics.distance.totalDistanceKm, {
              isRTL,
              type: "decimal",
            })}
            size="large"
            bottomSpanLabel={t("common.kilometer")}
          />
        </View>
      </View>

      {/* ====== odometer ====== */}
      <View style={ReportStyles.card}>
        <View style={ReportStyles.rowTitle}>
          <View
            style={[
              ReportStyles.iconContainer,
              { backgroundColor: Colors.text + 15 },
            ]}
          >
            <GaugeCircleIcon size={22} color={Colors.text} />
          </View>
          <DoubleLabel
            topLabel={t("reports.latestOdometer")}
            bottomLabel={numberFormat(statistics.distance.latestOdometer, {
              isRTL,
            })}
            size="large"
          />
        </View>
        <View style={ReportStyles.separator} />
        <View style={ReportStyles.row}>
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.distance.distanceThisYear
                  : statistics.distance.distanceThisYear,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.thisYear")}
              topSpanLabel={t("common.kilometer")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.distance.distancePreviousYear
                  : statistics.distance.distancePreviousYear,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.previousYear")}
              topSpanLabel={t("common.kilometer")}
              size="small"
            />
          </View>
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.distance.distanceThisMonth
                  : statistics.distance.distanceThisMonth,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.thisMonth")}
              topSpanLabel={t("common.kilometer")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.distance.distancePreviousMonth
                  : statistics.distance.distancePreviousMonth,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.previousMonth")}
              topSpanLabel={t("common.kilometer")}
              size="small"
            />
          </View>
        </View>
      </View>

      {/* ====== odometer ====== */}
      <View style={ReportStyles.card}>
        <View style={ReportStyles.row}>
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                statistics.distance.averageMileagePerYear,
                {
                  isRTL,
                  type: "decimal",
                },
              )}
              bottomLabel={t("reports.averageMileagePerYear")}
              topSpanLabel={t("common.kilometer")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                statistics.distance.averageMileagePerMonth,
                {
                  isRTL,
                  type: "decimal",
                },
              )}
              bottomLabel={t("reports.averageMileagePerMonth")}
              topSpanLabel={t("common.kilometer")}
              size="small"
            />
          </View>
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(statistics.distance.averageMileagePerDay, {
                isRTL,
                type: "decimal",
              })}
              bottomLabel={t("reports.averageMileagePerDay")}
              topSpanLabel={t("common.kilometer")}
              size="small"
            />
          </View>
        </View>
      </View>
    </>
  );
}
