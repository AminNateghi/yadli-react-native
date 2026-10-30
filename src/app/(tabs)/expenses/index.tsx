import { BanknoteIcon, PlusIcon } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { ValueWithHelp } from "@/components/ValueWithHelp";
import { RecordCard } from "@/components/RecordCard";
import { Text } from "@/components/Text";
import { Colors, GlobalStyles } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { useExpenses } from "@/repositories/expense-repository";
import { useStatistics } from "@/repositories/statistics";
import { getExpenseTypeTitle } from "@/types/interfaces";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import { FloatButton } from "@/components/FloatButton";

export default function ExpensesScreen() {
  const { t, isRTL } = useTranslation();

  const { data: expenses } = useExpenses();
  const { statistics } = useStatistics();

  return (
    <View style={[styles.wrapper, isRTL && { direction: "rtl" }]}>
      <FloatButton
        icon={PlusIcon}
        text={t("expenses.createTitle")}
        color="green"
        placement={isRTL ? "left" : "right"}
        onPress={() => router.push("/expenses/form")}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {statistics.expenses.totalExpenses > 0 && (
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
        )}

        {expenses?.length === 0 ? (
          <>
            <EmptyState
              icon={BanknoteIcon}
              title={t("expenses.noExpenseYet")}
              subtitle={t("expenses.expensesDescription")}
            />

            <Button
              title={t("common.new")}
              onPress={() => router.push("/(tabs)/expenses/form")}
              style={{ flex: 1 }}
            />
          </>
        ) : (
          expenses?.map((expense) => {
            return (
              <RecordCard
                id={expense.id}
                key={expense.id}
                title={getExpenseTypeTitle(expense.type, t)}
                date={expense.date}
                amount={expense.amount}
                help={t("common.priceSign")}
                icon={BanknoteIcon}
                color={Colors.expense}
                rtl={isRTL}
                onPress={(id) => {
                  router.push({
                    pathname: "/expenses/form",
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
});
