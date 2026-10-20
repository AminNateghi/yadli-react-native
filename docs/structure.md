# Project structure review + proposed changes

## Should-fix (maintainability)

1. **Extract `FormModalShell`** (FAB + transparent Modal + header + button row).
   Reason: ~80% duplication across 4 forms; copy-paste bug already present
   (`FuelForm.tsx:48,51` declares `updateService/createService`).
   Change: one component with `title/onClose/onSubmit/isValid/children` props;
   migrate one form at a time.

2. **Delete one of `ReminderCard.tsx` vs `ReminderCardV2.tsx`.**
   Reason: two cards for the same entity, one legacy (targets old `ServiceDto`)
   and unused, one with commented-out progress referencing undefined vars.
   Change: delete legacy + `serviceReminders.getServiceReminders` stub (or port
   progress into V2 — see `reminders.md` Step 5). Remove dead imports in
   `reminders/index.tsx` and `drawer/index.tsx`.

3. **Move `(tabs)/drawer` out of Tabs.**
    Reason: hidden tab (`href:null`) inside `Tabs` is a hack; drawer is not a tab.
    Change: real `Drawer` layout outside `(tabs)` or a top-level route.

4. **Fix `_layout.tsx` SafeArea misuse** (`useSafeAreaInsets()` in the same
    component that renders `<SafeAreaProvider>` → always 0 first pass;
    `marginBottom` hack on provider).
    Reason: incorrect insets on notch devices.
    Change: plain `<SafeAreaProvider>` at root, `SafeAreaView edges=` in screens.
    Gate `hideAsync` on `loaded && (success || error)`.

5. **DB name drift `yadli.db` vs app `yadli`.**
    Reason: confusing for debugging / support. Change: rename to `yadli.db`
    with a one-time file migration, or document the legacy name. Do not rename
    silently — users would lose data.

## Hygiene

 1. **Triple date libs (`date-fns` + `dayjs` + `jalaliday`)** + web-only
    `react-responsive useMediaQuery` for `isDesktop`.
    Change: standardize on `dayjs` (+ jalali plugin), replace media query with
    `useWindowDimensions`.
 2. **Unused deps check:** `@libsql/client` (expo driver in use),
    `react-native-simple-toast` (compat), `@expo/ui`.
    Change: remove after confirming zero imports, `npx expo install --fix`.
 3. **Add `typecheck` script** (`"typecheck": "tsc --noEmit"`) — `typescript`
    exists but no script; only `expo lint` is wired.
 4. **i18n loader indirection** (`translationLoaders` wraps static imports) +
    hand-maintained `TranslationKeys.d.ts` will drift.
    Change: plain dict lookup; generate the keys type.
 5. **Redundant `tsconfig` path** (`@/assets/*` already covered by `@/*`).
 6. **Add `src/services/`** for notifications scheduler (see `notifications.md`);
    keep `utils/` pure (date math, formatting).

## Suggested order

Dead `migrate.ts` + query-key fixes → rename `repositories/` → dedupe hooks →
`FormModalShell` → card cleanup → SafeArea/drawer → dep hygiene.
One commit per bullet; run `npx tsc --noEmit && npx expo lint` each time.
