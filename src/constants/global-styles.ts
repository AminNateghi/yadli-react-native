import { StyleSheet } from "react-native";
import { Colors } from "./colors";

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
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 4,
  },
});

export const ReportStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.borderLight,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: 140,
    marginBottom: 10,
  },
});
