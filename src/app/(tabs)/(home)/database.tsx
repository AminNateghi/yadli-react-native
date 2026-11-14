import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { Text } from "@/components/Text";
import { db, sqlite } from "@/db";
import { vehiclesRecords } from "@/db/schema";
import { Theme } from "@/constants";
import { useTranslation } from "@/languages/useTranslation";
import { Toast } from "@/components/CustomToast";
import {
  removeAllReminderNotifications,
  syncVehicleReminderNotifications,
} from "@/utils/reminder-notifications";
import { queryClient } from "@/utils/query-client";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  backupDatabaseAsync,
  openDatabaseAsync,
  type SQLiteDatabase,
} from "expo-sqlite";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { IconButton } from "@/components/IconButton";
import { ArrowRightIcon } from "lucide-react-native";

const requiredColumns = {
  profile: ["id", "active_vehicle_id", "language", "onboarding"],
  vehicles: ["id", "custom_name", "fuel_type", "sold"],
  services: ["id", "type", "date", "vehicle_id"],
  fuels: ["id", "date", "liters", "vehicle_id"],
  expenses: ["id", "type", "date", "vehicle_id"],
  reminders: ["id", "mode", "trigger_type", "vehicle_id"],
} as const;

async function isValidBackup(database: SQLiteDatabase) {
  const integrity = await database.getFirstAsync<{
    integrity_check: string;
  }>("PRAGMA integrity_check");
  if (integrity?.integrity_check !== "ok") {
    return false;
  }

  const tables = await database.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table'",
  );
  const tableNames = new Set(tables.map(({ name }) => name));
  if (!tableNames.has("__drizzle_migrations")) {
    return false;
  }

  for (const [table, columns] of Object.entries(requiredColumns)) {
    if (!tableNames.has(table)) {
      return false;
    }

    const tableColumns = await database.getAllAsync<{ name: string }>(
      `PRAGMA table_info("${table}")`,
    );
    const columnNames = new Set(tableColumns.map(({ name }) => name));
    if (!columns.every((column) => columnNames.has(column))) {
      return false;
    }
  }

  return true;
}

export default function DatabaseScreen() {
  const { t, isRTL } = useTranslation();
  const navigation = useNavigation();
  const [action, setAction] = useState<"export" | "restore" | "pick" | null>(
    null,
  );
  const [restoreConfirmationVisible, setRestoreConfirmationVisible] =
    useState(false);
  const pendingBackup = useRef<SQLiteDatabase | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("database.title"),
      headerLargeTitle: true,
      headerTitleAlign: "center",
      headerRight: () => (
        <IconButton icon={<ArrowRightIcon />} onPress={() => router.back()} />
      ),
      headerLeft: () => <></>,
    });
  }, [navigation, t]);

  const handleExport = async () => {
    if (Platform.OS === "web") {
      Toast({ text: t("database.unsupported"), type: "error" });
      return;
    }

    setAction("export");
    try {
      if (!(await Sharing.isAvailableAsync())) {
        throw new Error("File sharing is not available");
      }

      const backup = await sqlite.serializeAsync();
      const file = new File(
        Paths.cache,
        `yadli-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.db`,
      );
      file.create({ overwrite: true });
      await file.write(backup);
      await Sharing.shareAsync(file.uri, {
        dialogTitle: t("database.exportTitle"),
        mimeType: "application/vnd.sqlite3",
      });
      Toast({ text: t("database.exportSuccess"), type: "success" });
    } catch (error) {
      console.error("Database export failed", error);
      Toast({ text: t("database.exportFailed"), type: "error" });
    } finally {
      setAction(null);
    }
  };

  const handlePickBackup = async () => {
    if (Platform.OS === "web") {
      Toast({ text: t("database.unsupported"), type: "error" });
      return;
    }

    setAction("pick");
    let candidate: SQLiteDatabase | null = null;
    try {
      const result = await File.pickFileAsync({
        mimeTypes: [
          "application/vnd.sqlite3",
          "application/x-sqlite3",
          "application/octet-stream",
        ],
      });
      if (result.canceled) {
        return;
      }

      const file = result.result;
      const bytes = await file.bytes();

      const dbName = `candidate-${Date.now()}.db`;
      const tempFile = new File(Paths.cache, dbName);
      tempFile.create({ overwrite: true });
      await tempFile.write(bytes);

      candidate = await openDatabaseAsync(dbName, undefined, Paths.cache.uri);

      if (!(await isValidBackup(candidate))) {
        Toast({ text: t("database.invalidBackup"), type: "error" });
        return;
      }

      pendingBackup.current = candidate;
      candidate = null;
      setRestoreConfirmationVisible(true);
    } catch (error) {
      console.error("Database backup selection failed", error);
      Toast({ text: t("database.restoreFailed"), type: "error" });
    } finally {
      try {
        await candidate?.closeAsync();
      } catch (error) {
        console.error("[DB-RESTORE] temporary database close failed", error);
      }
      setAction(null);
    }
  };

  const handleRestore = async () => {
    const sourceDatabase = pendingBackup.current;
    setRestoreConfirmationVisible(false);
    if (!sourceDatabase) {
      return;
    }

    setAction("restore");
    try {
      await backupDatabaseAsync({
        sourceDatabase,
        destDatabase: sqlite,
      });
      let notificationSyncFailed = false;
      try {
        await removeAllReminderNotifications();
        const vehicles = await db
          .select({ id: vehiclesRecords.id })
          .from(vehiclesRecords);
        const results = await Promise.allSettled(
          vehicles.map(({ id }) => syncVehicleReminderNotifications(id)),
        );
        notificationSyncFailed = results.some(
          (result) => result.status === "rejected",
        );
      } catch (error) {
        console.error("Reminder notification sync after restore failed", error);
        notificationSyncFailed = true;
      }
      await queryClient.invalidateQueries();
      Toast({
        text: notificationSyncFailed
          ? t("database.restoreNotificationWarning")
          : t("database.restoreSuccess"),
        type: notificationSyncFailed ? "warning" : "success",
      });
    } catch (error) {
      console.error("Database restore failed", error);
      Toast({ text: t("database.restoreFailed"), type: "error" });
    } finally {
      pendingBackup.current = null;
      await sourceDatabase.closeAsync();
      setAction(null);
      router.navigate("/(tabs)/(home)");
    }
  };

  const cancelRestore = () => {
    setRestoreConfirmationVisible(false);
    pendingBackup.current?.closeSync();
    pendingBackup.current = null;
  };

  return (
    <ScrollView
      style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Card title={t("database.exportTitle")} style={styles.card}>
        <Text style={styles.description}>
          {t("database.exportDescription")}
        </Text>
        <Button
          title={t("database.export")}
          onPress={() => void handleExport()}
          loading={action === "export"}
          disabled={action !== null}
          color="green"
          variant="subtle"
        />
      </Card>

      <Card title={t("database.restoreTitle")} style={styles.card}>
        <Text style={styles.description}>
          {t("database.restoreDescription")}
        </Text>
        <Button
          title={t("database.restore")}
          onPress={() => void handlePickBackup()}
          loading={action === "pick" || action === "restore"}
          disabled={action !== null}
          color="orange"
          variant="subtle"
        />
      </Card>

      <ConfirmationDialog
        visible={restoreConfirmationVisible}
        onConfirm={() => void handleRestore()}
        onCancel={cancelRestore}
        message={t("database.restoreConfirmation")}
        confirmText={t("database.restore")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 12,
  },
});
