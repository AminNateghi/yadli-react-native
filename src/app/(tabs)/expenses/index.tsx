import { ReceiptIcon } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { EmptyState } from "@/components/EmptyState";
import { PriceValue } from "@/components/PriceValue";
import { RecordCard } from "@/components/RecordCard";
import { Text } from "@/components/Text";
import { Colors, globalStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { expenseTypeOptions } from "@/types/interfaces";
import { useExpenses } from "@/contexts/expense-repository";
import { useStatistics } from "@/contexts/statistics-repository";
import { ExpenseForm } from "@/components/forms/ExpenseForm";

export default function ExpensesScreen() {
  const { t, isRTL } = useTranslation();
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: expenses } = useExpenses();
  const { totalExpenses } = useStatistics();

  const getExpenseTypeTitle = (expenseType: string) =>
    expenseTypeOptions(t).find((s) => s.value === expenseType)?.label || "-";

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
        {totalExpenses > 0 && (
          <View style={globalStyles.summaryCard}>
            <Text style={globalStyles.summaryTitle}>
              {t("fuel.totalFuelCost")}
            </Text>
            <PriceValue
              value={totalExpenses?.toFixed(2)}
              style={globalStyles.summaryValue}
            />
          </View>
        )}

        {expenses?.length === 0 ? (
          <EmptyState
            icon={ReceiptIcon}
            title={t("expenses.noExpenseYet")}
            subtitle={t("expenses.expensesDescription")}
          />
        ) : (
          expenses?.map((expense) => {
            return (
              <RecordCard
                id={expense.id}
                key={expense.id}
                title={getExpenseTypeTitle(expense.type)}
                date={expense.date}
                amount={expense.amount}
                subtitle={""}
                icon={ReceiptIcon}
                color={Colors.expense}
                rtl={isRTL}
                onPress={(id) => {
                  setEditingId(id);
                }}
              />
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <ExpenseForm editingId={editingId} onClose={() => setEditingId(null)} />
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
