# Reminders — audit + step-by-step completion guide

## 1. Where things live

| Concern | File |
|---|---|
| Table | `src/db/schema.ts:90-142` (`remindersRecords`) |
| DTO + enums | `src/types/interfaces.ts:12,82-84` |
| Validation | `src/types/reminder-schema.ts` |
| CRUD hooks | `src/repositories/reminder-repository.ts` |
| Create/Edit UI | `src/components/forms/ReminderForm.tsx` |
| Delete confirm | `src/components/forms/ReminderDeletionModal.tsx` |
| List screen | `src/app/(tabs)/reminders/index.tsx` (+ `_layout.tsx` Stack) |
| Cards | `src/components/ReminderCardV2.tsx` (used) vs `ReminderCard.tsx` (legacy, unused) |
| Due logic | `src/utils/revaluateReminders.ts` (dead), `src/utils/calculateNextThresholds.ts` (edit-prefill only) |
| Legacy progress | `src/utils/serviceReminders.ts` (`getServiceReminders()` stubbed to `return []:100`) |
| Complete mutation | `reminder-repository.ts:77-127 useCompleteReminder` — **zero callers** |
| Dashboard | `src/app/(tabs)/(home)/index.tsx` — no reminder usage; overdue badge commented out `:67-76` |

## 2. Data model today

`reminders` columns: `id`, `serviceType?`, `expenseType?` (plain nullable text,
no `$type<>`, no exactly-one constraint), `mode (OneTime|Recurring, default OneTime)`,
`triggerType (Odometer|Date|Either, default Either)`, `startOdometer?`,
`startDate?`, `odometerInterval?`, `dateIntervalMonths?`, `nextOdometer?`,
`nextDate?`, `active:boolean default true`, `note?`, timestamps.
No `completedAt/dismissedAt/snoozedUntil`, no `notificationId` column
(form has a stale `defaultValues.notificationId` at `ReminderForm.tsx:54`).

## 3. What works vs. what is incomplete

**Works:** schema + React Query CRUD, list + empty state, create/edit modal
(dependent/service/expense/mode/trigger/start/interval/note/active),
delete with confirm, i18n for form labels.

**Incomplete / buggy:**

1. `reminder-schema.ts:7-21` — all business fields optional, `mode/triggerType`
   as `z.string`. Empty reminder saves; `disabled={!isValid}` is meaningless.
2. Thresholds never reliably persisted: `calculateNextThresholds` runs only as
   edit-prefill (`ReminderForm.tsx:100-106`); `handleSave` copies stale
   `formData.next*`. Creates leave both `null`.
3. `reset()` on edit uses `data.x!` non-null assertions + `String(data.startDate)`
   (produces `"Wed Oct …"`, not ISO for `DatePicker`) — crashes/miscomputes on nulls.
4. `useCompleteReminder` unwired, no Complete/Done/Snooze button, no
   invalidation on success, `nextDate?.toDate()` yields `undefined` not `null`.
5. No dashboard integration (`useReminders` + `isReminderDue` never used on home).
6. Display split-brain: `ReminderCardV2` shows only active/inactive subtitle;
   progress/overdue UI is commented out (`:43-45,69-161` reference undefined vars);
   legacy `ReminderCard + serviceReminders` targets old `ServiceDto`, stubbed.
7. Dead imports in `reminders/index.tsx` (`ReminderCard`, `getServiceReminders`,
   `RecordCard`, router/icons) and `drawer/index.tsx`.
8. Missing locale keys: `reminders.needAttention`, legacy card keys, `fa Registration`.
9. No `currentOdometer` source linked (likely `useStatistics.totalKm`, not wired).

## 4. Step-by-step completion plan (commit each step separately)

### Step 1 — Decide the status model (no code, 30 min)
- Keep `active:boolean` as master switch.
- Derive `due/overdue` live via `isReminderDue(reminder, {currentOdometer, currentDate})`;
  do **not** persist overdue as a column.
- `Either` = OR (due if either threshold hit). `currentDate = new Date()`,
  `currentOdometer = useStatistics().totalKm ?? 0`.
- `OneTime` complete → `active=false`. `Recurring` complete →
  `start=actual`, recompute `next*`, stay `active=true`.

### Step 2 — Fix validation (`src/types/reminder-schema.ts`)
- `mode: z.enum(["OneTime","Recurring"])`, `triggerType: z.enum(["Odometer","Date","Either"])`.
- `superRefine`: `dependent==="Service"` requires `serviceType` (and vice versa);
  `Odometer` requires `startOdometer>0 + odometerInterval>0`;
  `Date` requires `startDate + dateIntervalMonths>0`;
  `Either` requires both sides.
- Verify: empty form → Save disabled with translated errors.

### Step 3 — Fix threshold persistence (`ReminderForm.tsx:handleSave`)
- In `handleSave`, compute `next = calculateNextThresholds(formData)` and
  persist `nextOdometer/nextDate` (not stale `formData.next*`).
- Remove stale `notificationId` from `defaultValues` until notifications land
  (or keep as tracked TODO).
- Fix edit `reset()`: guard nulls (no `!`), parse dates to ISO/`Date` for `DatePicker`.
- Test: create Odometer / Date / Either reminders → DB rows have correct `next*`.

### Step 4 — Wire the lifecycle (`reminder-repository.ts` + UI)
- Add `onSuccess: invalidate ["reminder-list"] + byId` to `useCompleteReminder`.
- Normalize `undefined → null` for `nextDate/nextOdometer`.
- Add UI in `ReminderCardV2` (or list row swipe): **Complete** button opening a
  small sheet for `actualOdometer (default current)` + `actualDate (default today)`
  → `useCompleteReminder`. Add **Activate/Deactivate** toggle.
- Test: OneTime → disappears/deactivates; Recurring → `next*` advance.

### Step 5 — Revive display (pick ONE card, delete the other)
- Either delete legacy `ReminderCard.tsx + serviceReminders.getServiceReminders stub`
  (recommended) or port its progress UI into `V2` driven by
  `isReminderDue + getDateReminderProgress/getOdometerReminderProgress`.
- Needs `currentOdometer` (statistics) passed as prop.
- Add missing locale keys + fix `fa Registration`; remove dead imports.
- Sort list: overdue → due-soon → active → inactive.

### Step 6 — Surface on dashboard (`(home)/index.tsx`)
- `const { data: reminders } = useReminders()` + filter `isReminderDue` →
  "Needs attention (N)" section linking to `/reminders`; re-enable the
  commented badge `:67-76`.
- Test with 1 overdue + 1 future reminder.

### Step 7 — Migration + QA
- If you add columns (e.g. `notificationId`, `completedAt`), edit `schema.ts` →
  `npm run db:generate` → verify `migrations.js` updated → test fresh + upgrade.
- `npx tsc --noEmit && npx expo lint`, RTL + LTR manual pass.

Suggested commits: `fix(reminders): conditional validation` →
`fix(reminders): persist next thresholds` → `feat(reminders): complete/re-arm flow` →
`feat(reminders): due display + sorting` → `feat(home): needs-attention section`.
