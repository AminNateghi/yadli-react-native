import { StyleSheet } from "react-native";
import { Theme } from "./theme";
import { Fonts } from "./fonts";

export const ScreenStyle = {
  headerStyle: { backgroundColor: Theme.background },
  headerShadowVisible: false,
  headerTintColor: Theme.text,
  contentStyle: { backgroundColor: Theme.background },
  headerTitleStyle: { fontFamily: Fonts.vazirRegular },
};

export const GlobalStyles = StyleSheet.create({
  rtl: {
    direction: "rtl",
  },

  modalScroll: {
    padding: 20,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },
  buttonColumn: {
    flexDirection: "column",
    marginTop: 8,
    gap: 10,
  },

  // summery card
  summaryCard: {
    backgroundColor: Theme.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    color: Theme.textSecondary,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Theme.text,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: Theme.border + 20,
    marginTop: 5,
    marginBottom: 5,
  },
});

export const ReportStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Theme.background,
    paddingLeft: 10,
    paddingRight: 10,
  },
  container: {
    flex: 1,
  },

  content: {
    padding: 16,
  },

  separator: {
    marginTop: 5,
    marginBottom: 5,
    height: 1,
    backgroundColor: Theme.borderLight,
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
