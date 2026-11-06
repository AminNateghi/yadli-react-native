import { Theme, ReportStyles, GlobalStyles } from "@/constants";
import { WalletIcon } from "lucide-react-native";
import { View } from "react-native";
import { DoubleLabel } from "../DoubleLabel";
import { numberFormat } from "@/utils/number-format";
import { useTranslation } from "@/languages/useTranslation";
import { useStatistics } from "@/repositories/statistics";
import { useActiveVehicle } from "@/repositories/active-vehicle";
import { useToday } from "@/hooks/useToday";
import dayjs from "dayjs";

export default function ReportGeneral() {
  const { t, isRTL } = useTranslation();
  const { statistics, persianStatistics } = useStatistics();
  const { data: vehicle } = useActiveVehicle();
  const today = useToday();

  const totalSpent = statistics.general.totalSpent;
  const purchasePrice = vehicle?.purchasePrice;
  const costRatio =
    purchasePrice != null && purchasePrice > 0
      ? totalSpent / purchasePrice
      : null;
  const costCategory =
    costRatio !== null
      ? costRatio <= 1.25
        ? t("reports.lowCost")
        : costRatio <= 1.5
          ? t("reports.moderateCost")
          : costRatio <= 2
            ? t("reports.highCost")
            : t("reports.veryHighCost")
      : null;
  const durationDays = (start: Date, end: Date) =>
    Math.max(
      0,
      dayjs(end).startOf("day").diff(dayjs(start).startOf("day"), "day"),
    );
  const purchaseDuration = vehicle?.purchaseDate
    ? durationDays(vehicle.purchaseDate, today)
    : null;
  const ownershipDuration =
    vehicle?.purchaseDate && vehicle.soldDate
      ? durationDays(vehicle.purchaseDate, vehicle.soldDate)
      : null;
  const distanceDriven =
    vehicle?.soldOdometer != null
      ? Math.max(0, vehicle.soldOdometer - (vehicle.purchaseOdometer ?? 0))
      : null;
  const saleBalance =
    vehicle?.soldPrice != null ? vehicle.soldPrice - totalSpent : null;

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
            bottomLabel={numberFormat(totalSpent, { isRTL })}
            size="large"
            bottomSpanLabel={t("common.priceSign")}
          />
        </View>
        <View style={GlobalStyles.separator} />
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

      {(costCategory ||
        purchaseDuration !== null ||
        ownershipDuration !== null ||
        saleBalance !== null ||
        distanceDriven !== null) && (
        <View style={ReportStyles.card}>
          <View style={ReportStyles.row}>
            <View style={[ReportStyles.col, ReportStyles.container]}>
              {costCategory && (
                <DoubleLabel
                  topLabel={costCategory}
                  bottomLabel={t("reports.costCategory")}
                  size="small"
                />
              )}
              {saleBalance !== null && (
                <DoubleLabel
                  topLabel={
                    saleBalance > 0
                      ? t("reports.profit")
                      : saleBalance < 0
                        ? t("reports.loss")
                        : t("reports.breakEven")
                  }
                  bottomLabel={numberFormat(Math.abs(saleBalance), { isRTL })}
                  bottomSpanLabel={t("common.priceSign")}
                  size="small"
                />
              )}
            </View>
            <View style={[ReportStyles.col, ReportStyles.container]}>
              {ownershipDuration === null && purchaseDuration !== null && (
                <DoubleLabel
                  topLabel={numberFormat(purchaseDuration, { isRTL })}
                  bottomLabel={t("reports.vehicleDuration")}
                  topSpanLabel={t("common.days")}
                  size="small"
                />
              )}
              {ownershipDuration !== null && (
                <DoubleLabel
                  topLabel={numberFormat(ownershipDuration, { isRTL })}
                  bottomLabel={t("reports.ownershipDuration")}
                  topSpanLabel={t("common.days")}
                  size="small"
                />
              )}
              {distanceDriven !== null && (
                <DoubleLabel
                  topLabel={numberFormat(distanceDriven, { isRTL })}
                  bottomLabel={t("reports.distanceDriven")}
                  topSpanLabel={t("common.km")}
                  size="small"
                />
              )}
            </View>
          </View>
        </View>
      )}

      {/* ====== Average ====== */}
      <View style={ReportStyles.card}>
        <View style={ReportStyles.row}>
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(statistics.general.averageCostPerMonth, {
                isRTL,
              })}
              bottomLabel={t("reports.averageCostPerMonth")}
              topSpanLabel={t("common.priceSign")}
              size="small"
            />
            <DoubleLabel
              topLabel={numberFormat(statistics.general.averageCostPerDay, {
                isRTL,
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
