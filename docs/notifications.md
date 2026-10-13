# Notifications — step-by-step implementation (Expo SDK 57)

> Status today: **nothing implemented**. `expo-notifications` is not in
> `package.json`, no plugin in `app.json`, no handler/listeners in
> `app/_layout.tsx`, no helpers in `utils|hooks|contexts`.
> Only trace: stale `defaultValues.notificationId` (`ReminderForm.tsx:54`).
> Verified against SDK 57 docs (`docs.expo.dev/versions/v57.0.0/sdk/notifications/`):
> install via `npx expo install expo-notifications`, `setNotificationHandler`,
> `scheduleNotificationAsync({content, trigger})` with typed triggers
> (`TIME_INTERVAL` / `DATE`), `setNotificationChannelAsync` on Android,
> `Device.isDevice` guard. Local notifications work in Expo Go; push needs a dev build.

Your app is offline with no backend, so use **local scheduled notifications only**
— no push tokens, no FCM/APNs keys, no EAS projectId needed.

## Prerequisites

- `npx expo install expo-notifications expo-device` (SDK-compatible versions)
- Dev build after install: `npx expo run:android|ios` or
  `eas build --profile development` (Expo Go covers local notifications,
  but test on a real device — `Device.isDevice` is false on simulators).

## Step 0 — Config (`app.json`)

Add the plugin (build-time; requires a rebuild to take effect):

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      ["expo-splash-screen", { "backgroundColor": "#208AEF", "image": "./assets/images/splash-icon.png", "imageWidth": 76 }],
      ["expo-notifications", { "icon": "./assets/images/icon.png", "color": "#2563EB" }]
    ]
  }
}
```

Why: `RECEIVE_BOOT_COMPLETED` is auto-added; Android 13+ permission prompt
appears once a channel exists; icon/color brand the tray entry.

## Step 1 — Handler + permissions + channel (new file `src/services/notifications.ts`)

Create one module owning all notification logic (keeps it out of forms):

- `initNotifications()`:
  `setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner:true, shouldShowList:true, shouldPlaySound:false, shouldSetBadge:false }) })`
- `ensurePermissions()`:
  `getPermissionsAsync()` → if not granted, `requestPermissionsAsync()`;
  on Android create channel first:
  `setNotificationChannelAsync("reminders", { name:"Reminders", importance: AndroidImportance.HIGH })`
- Helpers: `scheduleDateNotification({title, body, date, data})` →
  `scheduleNotificationAsync({ content:{title, body, data:{reminderId, url:"/(tabs)/reminders"}}, trigger:{ type: DATE, date } })`;
  `cancelNotification(id)`, `cancelAll()`, `listScheduled()`.
- Guard everything with `Device.isDevice` (from `expo-device`) — skip on simulator.

## Step 2 — Wire into boot (`src/app/_layout.tsx`)

- In `RootLayout`, `useEffect(() => { initNotifications(); ensurePermissions(); }, [])`.
- Add tap-routing listener: `addNotificationResponseReceivedListener(r => router.push(r.notification.request.content.data?.url ?? "/(tabs)/reminders"))`
  with cleanup. Keep the existing fonts/migrations gate untouched.

## Step 3 — Persist the scheduling handle (DB migration)

1. Add to `remindersRecords` (`src/db/schema.ts`):
   `notificationId: text("notification_id")` (single date-based notification per reminder for v1).
2. `npm run db:generate` → confirm `migrations.js` + SQL updated.
3. Update `ReminderDto` consumers + `reminder-schema.ts` (optional string).
4. Test fresh install + upgrade from existing `yadli.db`.

Reason: without the stored id you cannot cancel/reschedule when the user
edits, completes, deactivates, or deletes a reminder — orphan notifications pile up.

## Step 4 — Schedule / cancel alongside CRUD

- **Create/Update** (`ReminderForm.tsx:handleSave` after Step 3 of reminders guide):
  if `triggerType` is `Date|Either` and `nextDate` is in the future →
  cancel old id (if any) → `scheduleDateNotification` → save returned id.
  If `Odometer`-only → skip scheduling (odometer cannot fire without tracking;
  surface it in-app instead — see Step 6).
- **Delete** (`ReminderDeletionModal`): `cancelNotification(reminder.notificationId)`.
- **Complete**: OneTime → cancel; Recurring → cancel + reschedule from new `nextDate`.
- **Toggle active=false** → cancel; re-activate → reschedule.

## Step 5 — Odometer triggers (cannot use the OS scheduler)

OS triggers are time-based only. For odometer:
- On each fuel/service save, compare new odometer against `useReminders()` thresholds
  via `isReminderDue` → fire an immediate local notification
  (`scheduleNotificationAsync({content, trigger:null})`) or show an in-app banner.
- Document this limitation in-app ("odometer reminders are checked when you log fuel/service").

## Step 6 — In-app due banners (covers odometer + foreground)

Even with OS notifications, add a home/dashboard section (reminders guide Step 6):
"Needs attention (N)" from `useReminders + isReminderDue`. This is the reliable
surface for odometer-based and already-overdue items.

## Step 7 — Verify matrix

- [ ] Permission denied → no crash, in-app section still works
- [ ] Date reminder 1 min ahead → banner fires foreground + tray when backgrounded
- [ ] Tap notification → opens `/(tabs)/reminders`
- [ ] Edit date → old id cancelled, exactly one scheduled (`listScheduled()`)
- [ ] Delete / complete OneTime / deactivate → cancelled
- [ ] Recurring complete → rescheduled to new `nextDate`
- [ ] Reboot (Android) → still fires (`RECEIVE_BOOT_COMPLETED`)
- [ ] `npx tsc --noEmit && npx expo lint`, FA + EN manual pass

## Suggested commits

`chore(notifs): install expo-notifications + app.json plugin` →
`feat(notifs): notifications service + boot wiring` →
`feat(db): add reminders.notification_id` →
`feat(reminders): schedule/cancel on CRUD` →
`feat(home): due banners + odometer check on log`.

## What NOT to do

- No push tokens / Expo Push Service — offline app, unnecessary credentials.
- No `SCHEDULE_EXACT_ALARM` manual manifest edits (CNG handles it).
- No background `expo-task-manager` for v1 — overkill for date reminders.
