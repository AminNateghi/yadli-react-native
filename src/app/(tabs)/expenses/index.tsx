import { BanknoteIcon, PlusIcon } from "lucide-react-native";
import { FlatList, StyleSheet, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { ValueWithHelp } from "@/components/ValueWithHelp";
import { RecordCard } from "@/components/RecordCard";
import { Text } from "@/components/Text";
import { Theme, GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { useExpenses } from "@/repositories/expense-repository";
import { useStatistics } from "@/repositories/statistics";
import { getExpenseTypeTitle } from "@/types/interfaces";
import { router } from "expo-router";
import { FloatButton } from "@/components/FloatButton";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";

export default function ExpensesScreen() {
  const { t, isRTL } = useTranslation();
  const navigateOnce = useNavigationGuard();

  const { data: expenses } = useExpenses();
  const { statistics } = useStatistics();

  return (
    <View style={[styles.wrapper, isRTL && { direction: "rtl" }]}>
      <FloatButton
        icon={PlusIcon}
        text={t("expenses.createTitle")}
        color={Theme.violet}
        placement={isRTL ? "left" : "right"}
        onPress={() => navigateOnce(() => router.push("/expenses/form"))}
      />
      <FlatList
        style={styles.container}
        data={expenses ?? []}
        keyExtractor={(expense) => String(expense.id)}
        renderItem={({ item: expense }) => (
          <RecordCard
            id={expense.id}
            title={getExpenseTypeTitle(expense.type, t)}
            date={expense.date}
            amount={expense.amount}
            help={t("common.priceSign")}
            icon={BanknoteIcon}
            color={Theme.violet}
            rtl={isRTL}
            onPress={(id) => {
              navigateOnce(() =>
                router.push({
                  pathname: "/expenses/form",
                  params: { id },
                }),
              );
            }}
          />
        )}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          statistics.expenses.totalExpenses > 0 ? (
            <View style={GlobalStyles.summaryCard}>
              <Text style={GlobalStyles.summaryTitle}>
                {t("fuel.totalFuelCost")}
              </Text>
              <ValueWithHelp
                value={statistics.expenses.totalExpenses}
                help={t("common.priceSign")}
                style={GlobalStyles.summaryValue}
              />
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          expenses?.length === 0 ? (
            <EmptyState
              icon={BanknoteIcon}
              title={t("expenses.noExpenseYet")}
              subtitle={t("expenses.expensesDescription")}
            />
          ) : undefined
        }
        ListFooterComponent={<View style={styles.listFooter} />}
      />
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
  listFooter: {
    height: 100,
  },
});
