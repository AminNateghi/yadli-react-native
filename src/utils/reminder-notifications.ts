import * as Notifications from "expo-notifications";
import dayjs from "dayjs";
import { Platform } from "react-native";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profileRecords } from "@/db/schema";
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

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const scheduledForReminder = scheduled.filter(
    (notification) =>
      Number(notification.content.data?.reminderId) === reminderId,
  );
  await Promise.all(
    scheduledForReminder.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier),
    ),
  );

  const presented = await Notifications.getPresentedNotificationsAsync();
  const presentedForReminder = presented.filter(
    (notification) =>
      Number(notification.request.content.data?.reminderId) === reminderId,
  );
  await Promise.all(
    presentedForReminder.map((notification) =>
      Notifications.dismissNotificationAsync(notification.request.identifier),
    ),
  );
}

export async function syncReminderNotification(
  reminder: ReminderDto,
): Promise<boolean> {
  if (Platform.OS === "web") return true;

  await removeReminderNotification(reminder.id);

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
