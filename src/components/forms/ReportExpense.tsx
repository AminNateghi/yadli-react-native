import { Colors, ReportStyles } from "@/constants";
import { BanknoteIcon, ListOrderedIcon } from "lucide-react-native";
import { View } from "react-native";
import { DoubleLabel } from "../DoubleLabel";
import { numberFormat } from "@/utils/number-format";
import { useTranslation } from "@/languages/useTranslation";
import { useStatistics } from "@/repositories/statistics";

export default function ReportExpense() {
  const { t, isRTL } = useTranslation();
  const { statistics, persianStatistics } = useStatistics();

  return (
    <>
      {/* ====== Total Expense ====== */}
      <View style={ReportStyles.card}>
        <View style={ReportStyles.rowTitle}>
          <View
            style={[
              ReportStyles.iconContainer,
              { backgroundColor: Colors.text + 15 },
            ]}
          >
            <BanknoteIcon size={22} color={Colors.text} />
          </View>
          <DoubleLabel
            topLabel={t("reports.totalExpenses")}
            bottomLabel={numberFormat(statistics.expenses.totalExpenses, {
              isRTL,
              type: "decimal",
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
                  ? persianStatistics.expenses.expenseCostThisYear
                  : statistics.expenses.expenseCostThisYear,
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
                  ? persianStatistics.expenses.expenseCostPreviousYear
                  : statistics.expenses.expenseCostPreviousYear,
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

          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.expenses.expenseCostThisMonth
                  : statistics.expenses.expenseCostThisMonth,
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
                  ? persianStatistics.expenses.expenseCostPreviousMonth
                  : statistics.expenses.expenseCostPreviousMonth,
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
      <View style={ReportStyles.card}>
        <View style={ReportStyles.rowTitle}>
          <View
            style={[
              ReportStyles.iconContainer,
              { backgroundColor: Colors.text + 15 },
            ]}
          >
            <ListOrderedIcon size={22} color={Colors.text} />
          </View>
          <DoubleLabel
            topLabel={t("reports.expenseLength")}
            bottomLabel={numberFormat(
              statistics.expenses.expenseRecordsLength,
              { isRTL },
            )}
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
                  ? persianStatistics.expenses.lengthThisYear
                  : statistics.expenses.lengthThisYear,
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
                  ? persianStatistics.expenses.lengthPreviousYear
                  : statistics.expenses.lengthPreviousYear,
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
                  ? persianStatistics.expenses.lengthThisMonth
                  : statistics.expenses.lengthThisMonth,
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
                  ? persianStatistics.expenses.lengthPreviousMonth
                  : statistics.expenses.lengthPreviousMonth,
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
      <View style={ReportStyles.card}>
        <View style={ReportStyles.rowTitle}>
          <View
            style={[
              ReportStyles.iconContainer,
              { backgroundColor: Colors.text + 15 },
            ]}
          >
            <BanknoteIcon size={22} color={Colors.text} />
          </View>
          <DoubleLabel
            topLabel={t("reports.averageCostPerMonth")}
            bottomLabel={numberFormat(statistics.expenses.averageCostPerMonth, {
              isRTL,
              type: "decimal",
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
                  ? persianStatistics.expenses.averageCostPerDay
                  : statistics.expenses.averageCostPerDay,
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
                  ? persianStatistics.expenses.averageCostPerKilometer
                  : statistics.expenses.averageCostPerKilometer,
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
          <View style={[ReportStyles.col, ReportStyles.container]}>
            <DoubleLabel
              topLabel={numberFormat(
                isRTL
                  ? persianStatistics.expenses.maxExpenseAmount
                  : statistics.expenses.maxExpenseAmount,
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
                  ? persianStatistics.expenses.minExpenseAmount
                  : statistics.expenses.minExpenseAmount,
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
