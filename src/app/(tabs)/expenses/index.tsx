import { BanknoteIcon } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { EmptyState } from "@/components/EmptyState";
import { PriceValue } from "@/components/PriceValue";
import { RecordCard } from "@/components/RecordCard";
import { Text } from "@/components/Text";
import { Colors, globalStyles } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import { useExpenses } from "@/repositories/expense-repository";
import { useStatistics } from "@/repositories/statistics-repository";
import { getExpenseTypeTitle } from "@/types/interfaces";
import { router } from "expo-router";
import { Button } from "@/components/Button";

export default function ExpensesScreen() {
  const { t, isRTL } = useTranslation();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const { data: expenses } = useExpenses();
  const { totalExpenses } = useStatistics();

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
                subtitle={""}
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
  contentDesktop: {
    maxWidth: 1024,
    alignSelf: "center",
    width: "100%",
  },
});
