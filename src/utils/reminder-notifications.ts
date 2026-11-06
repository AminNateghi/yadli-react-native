import * as Notifications from "expo-notifications";
import dayjs from "dayjs";
import { Platform } from "react-native";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profileRecords, remindersRecords, vehiclesRecords } from "@/db/schema";
import type { LanguageType, ReminderDto } from "@/types/interfaces";
import { getExpenseTypeTitle, getServiceTypeTitle } from "@/types/interfaces";
import { getTranslation } from "@/languages/translation";
import type { TranslationKey } from "@/languages/translation";
import { getReminderDueDate } from "@/utils/service-reminders";

const REMINDER_CHANNEL_ID = "reminders";

function notificationContent(
  reminder: ReminderDto,
  language: LanguageType,
): { title: string; body: string } {
  const translate = (key: TranslationKey) => getTranslation(language, key);
  const item = reminder.serviceType
    ? getServiceTypeTitle(reminder.serviceType, translate)
    : reminder.expenseType
      ? getExpenseTypeTitle(reminder.expenseType, translate)
      : translate("reminders.title");

  return {
    title: translate("reminders.notificationTitle"),
    body: translate("reminders.notificationBody").replace("{item}", item),
  };
}

export async function removeReminderNotification(
  reminderId: number,
): Promise<void> {
  if (Platform.OS === "web") return;

  await removeNotificationsForReminderIds([reminderId]);
}

async function removeNotificationsForReminderIds(
  reminderIds: number[],
): Promise<void> {
  const reminderIdSet = new Set(reminderIds);
  if (reminderIdSet.size === 0) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const scheduledForReminder = scheduled.filter((notification) =>
    reminderIdSet.has(Number(notification.content.data?.reminderId)),
  );
  const scheduledResults = await Promise.allSettled(
    scheduledForReminder.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier),
    ),
  );

  const presented = await Notifications.getPresentedNotificationsAsync();
  const presentedForReminder = presented.filter((notification) =>
    reminderIdSet.has(Number(notification.request.content.data?.reminderId)),
  );
  const presentedResults = await Promise.allSettled(
    presentedForReminder.map((notification) =>
      Notifications.dismissNotificationAsync(notification.request.identifier),
    ),
  );
  if (
    scheduledResults.some((result) => result.status === "rejected") ||
    presentedResults.some((result) => result.status === "rejected")
  ) {
    throw new Error("Could not clear all reminder notifications");
  }
}

export async function removeVehicleReminderNotifications(
  vehicleId: number,
): Promise<void> {
  if (Platform.OS === "web") return;

  const reminders = await db
    .select({ id: remindersRecords.id })
    .from(remindersRecords)
    .where(eq(remindersRecords.vehicleId, vehicleId));
  await removeNotificationsForReminderIds(
    reminders.map((reminder) => reminder.id),
  );
}

export async function syncVehicleReminderNotifications(
  vehicleId: number,
): Promise<void> {
  if (Platform.OS === "web") return;

  const reminders = await db
    .select()
    .from(remindersRecords)
    .where(eq(remindersRecords.vehicleId, vehicleId));
  await Promise.all(reminders.map(syncReminderNotification));
}

export async function syncReminderNotification(
  reminder: ReminderDto,
): Promise<boolean> {
  if (Platform.OS === "web") return true;

  await removeReminderNotification(reminder.id);

  const vehicle = await db.query.vehiclesRecords.findFirst({
    where: eq(vehiclesRecords.id, reminder.vehicleId),
  });
  if (!vehicle) {
    throw new Error("Vehicle not found");
  }
  if (vehicle.sold) return true;

  const dueDate = getReminderDueDate(reminder);
  if (!reminder.active || !dueDate) return true;

  const notificationDate = dayjs(dueDate)
    .hour(9)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate();
  if (notificationDate.getTime() <= Date.now()) return true;

  const profile = await db.query.profileRecords.findFirst({
    where: eq(profileRecords.id, 1),
  });
  const language = profile?.language ?? "fa";

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
      name: getTranslation(language, "reminders.title"),
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const { status } =
    existingStatus === "granted"
      ? { status: existingStatus }
      : await Notifications.requestPermissionsAsync();
  if (status !== "granted") return false;

  const content = notificationContent(reminder, language);

  await Notifications.scheduleNotificationAsync({
    content: {
      ...content,
      data: { reminderId: reminder.id },
      ...(Platform.OS === "android" ? { channelId: REMINDER_CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: notificationDate,
    },
  });
  return true;
}

export async function removeAllReminderNotifications(): Promise<void> {
  if (Platform.OS === "web") return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const scheduledReminders = scheduled.filter(
    (notification) => notification.content.data?.reminderId !== undefined,
  );
  await Promise.all(
    scheduledReminders.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier),
    ),
  );

  const presented = await Notifications.getPresentedNotificationsAsync();
  const presentedReminders = presented.filter(
    (notification) =>
      notification.request.content.data?.reminderId !== undefined,
  );
  await Promise.all(
    presentedReminders.map((notification) =>
      Notifications.dismissNotificationAsync(notification.request.identifier),
    ),
  );
}
