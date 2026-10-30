import { Theme, ReportStyles } from "@/constants";
import {
  BanknoteIcon,
  DropletIcon,
  GaugeIcon,
  ListOrderedIcon,
} from "lucide-react-native";
import { View } from "react-native";
import { DoubleLabel } from "../DoubleLabel";
import { numberFormat } from "@/utils/number-format";
import { useTranslation } from "@/languages/useTranslation";
import { useStatistics } from "@/repositories/statistics";

export default function ReportFuel() {
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
            <BanknoteIcon size={22} color={Theme.text} />
          </View>
          <DoubleLabel
            topLabel={t("reports.totalFuelCost")}
            bottomLabel={numberFormat(statistics.refueling.totalFuelCost, {
              isRTL,
            })}
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
                  ? persianStatistics.refueling.gasPriceThisYear
                  : statistics.refueling.gasPriceThisYear,
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
                  ? persianStatistics.refueling.gasPricePreviousYear
                  : statistics.refueling.gasPricePreviousYear,
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
                  ? persianStatistics.refueling.gasPriceThisMonth
                  : statistics.refueling.gasPriceThisMonth,
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
                  ? persianStatistics.refueling.gasPricePreviousMonth
                  : statistics.refueling.gasPricePreviousMonth,
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

      {/* ====== fill-ups ====== */}
      <View style={ReportStyles.card}>
        <View style={ReportStyles.rowTitle}>
          <View
            style={[
              ReportStyles.iconContainer,
              { backgroundColor: Theme.text + 15 },
            ]}
          >
            <ListOrderedIcon size={22} color={Theme.text} />
          </View>
          <DoubleLabel
            topLabel={t("reports.fillUps")}
            bottomLabel={numberFormat(statistics.refueling.totalFillUps, {
              isRTL,
            })}
            size="large"
            bottomSpanLabel={t("common.times")}
          />
        </View>
        <View style={ReportStyles.separator} />
        <View style={ReportStyles.row}>
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.refueling.fillUpsThisYear
                  : statistics.refueling.fillUpsThisYear,
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
                  ? persianStatistics.refueling.fillUpsPreviousYear
                  : statistics.refueling.fillUpsPreviousYear,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.previousYear")}
              topSpanLabel={t("common.times")}
              size="small"
            />
          </View>
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.refueling.fillUpsThisMonth
                  : statistics.refueling.fillUpsThisMonth,
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
                  ? persianStatistics.refueling.fillUpsPreviousMonth
                  : statistics.refueling.fillUpsPreviousMonth,
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

      {/* ====== fuel ====== */}
      <View style={ReportStyles.card}>
        <View style={ReportStyles.rowTitle}>
          <View
            style={[
              ReportStyles.iconContainer,
              { backgroundColor: Theme.text + 15 },
            ]}
          >
            <DropletIcon size={22} color={Theme.text} />
          </View>
          <DoubleLabel
            topLabel={t("reports.gas")}
            bottomLabel={numberFormat(statistics.refueling.totalGas, { isRTL })}
            size="large"
            bottomSpanLabel={t("common.liter")}
          />
        </View>
        <View style={ReportStyles.separator} />
        <View style={ReportStyles.row}>
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.refueling.gasThisYear
                  : statistics.refueling.gasThisYear,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.thisYear")}
              topSpanLabel={t("common.liter")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.refueling.gasPreviousYear
                  : statistics.refueling.gasPreviousYear,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.previousYear")}
              topSpanLabel={t("common.liter")}
              size="small"
            />
          </View>
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.refueling.gasThisMonth
                  : statistics.refueling.gasThisMonth,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.thisMonth")}
              topSpanLabel={t("common.liter")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.refueling.gasPreviousMonth
                  : statistics.refueling.gasPreviousMonth,
                {
                  isRTL,
                },
              )}
              bottomLabel={t("dashboard.previousMonth")}
              topSpanLabel={t("common.liter")}
              size="small"
            />
          </View>
        </View>
        <View style={ReportStyles.separator} />
        <View style={[ReportStyles.row, ReportStyles.container]}>
          <DoubleLabel
            topLabel={numberFormat(statistics.refueling.minFillUpLiter, {
              isRTL,
            })}
            bottomLabel={t("reports.minFillUps")}
            topSpanLabel={t("common.liter")}
            size="small"
          />
          <DoubleLabel
            topLabel={numberFormat(statistics.refueling.maxFillUpLiter, {
              isRTL,
            })}
            bottomLabel={t("reports.maxFillUps")}
            topSpanLabel={t("common.liter")}
            size="small"
          />
        </View>
      </View>

      {/* ====== Average liter per km ====== */}
      <View style={ReportStyles.card}>
        <View style={ReportStyles.rowTitle}>
          <View
            style={[
              ReportStyles.iconContainer,
              { backgroundColor: Theme.text + 15 },
            ]}
          >
            <GaugeIcon size={22} color={Theme.text} />
          </View>
          <DoubleLabel
            topLabel={t("dashboard.avgPerKm")}
            bottomLabel={numberFormat(statistics.refueling.averageLiterPerKm, {
              isRTL,
            })}
            size="large"
            bottomSpanLabel={t("common.liter")}
          />
        </View>
        <View style={ReportStyles.separator} />
        <View style={[ReportStyles.row, ReportStyles.container]}>
          <DoubleLabel
            topLabel={numberFormat(statistics.refueling.bestFuelConsumption, {
              isRTL,
            })}
            bottomLabel={t("reports.minFillUps")}
            topSpanLabel={t("common.liter")}
            size="small"
          />
          <DoubleLabel
            topLabel={numberFormat(statistics.refueling.worstFuelConsumption, {
              isRTL,
            })}
            bottomLabel={t("reports.maxFillUps")}
            topSpanLabel={t("common.liter")}
            size="small"
          />
        </View>
      </View>
    </>
  );
}
