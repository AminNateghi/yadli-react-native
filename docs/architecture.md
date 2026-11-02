# Architecture

## 1. Stack (pinned in `package.json`)

- Expo SDK ~57 (`expo: ~57.0.26`), React 19.2.3, React Native 0.86.3
- Navigation: `expo-router ~57.0.24`, typed routes enabled (`app.json:38`)
- Local DB: `expo-sqlite ^57.0.3` + `drizzle-orm ^0.45.3` + `drizzle-kit`
- Server-state: `@tanstack/react-query ^5.104.0`
- Forms: `react-hook-form ^7.89.0` + `@hookform/resolvers` + `zod ^4.6.5`
- Dates: `dayjs` + `jalaliday` (for Persian calendar)
- UI: `lucide-react-native`, `react-native-ui-datepicker`, custom `Text/Button/Input`

- Package Manager: pnpm / pnx
- Project only develop for Android device.

## 2. Routing (`src/app/`)

```
app/_layout.tsx          Root Stack (headerShown:false)
  providers: SafeAreaProvider > ThemeProvider > QueryClientProvider
  boot: useFonts(Vazir) + useMigrations(db, migrations) + SplashScreen gate
app/index.tsx            Redirect → /(tabs)/(home)
app/(tabs)/_layout.tsx   5-tab Tabs: (home), services, fuel, expenses, reminders + hidden settings (href:null)
app/(tabs)/(home)/       dashboard: totals + reports + vehicle registration
app/(tabs)/fuel|services|expenses|reminders/  each: _layout.tsx (Stack) + index.tsx (list + form modal)
app/+not-found.tsx
```

Record CRUD uses in-place modals. Vehicle registration has a dedicated
screen; the dashboard and navigation drawer switch the active vehicle.

## 3. Data layer

- Client: `src/db/index.ts` — `openDatabaseSync("yadli.db")` + `drizzle(sqlite, {schema})`
- Schema: `src/db/schema.ts` — `profile`, `vehicles`, `services`, `fuels`,
  `expenses`, and `reminders`. Log and reminder records are scoped to a
  vehicle; the active vehicle is stored in `profile`.
- Config: `drizzle.config.ts` — `dialect:sqlite, driver:expo, schema:./src/db/schema.ts`
- Migrations: bundled `src/db/migrations/migrations.js`, applied via
  `useMigrations(db, migrations)` in `app/_layout.tsx:27`
- Repositories: `src/repositories/*-repository.ts` — one per entity:
  `*QueryKey` + `use* (useQuery select orderBy desc limit ??1000)` +
  `useCreate/useUpdate/useDelete (useMutation + invalidateQueries)` +
  `useGet* (findFirst, enabled:id!==null)`
- `src/repositories/statistics-repository.ts` derives `totalKm` etc. from raw tables.
- `src/repositories/query-client.ts` — bare `new QueryClient()`, no `staleTime/retry`.

Flow: form → mutation → drizzle → sqlite → `invalidateQueries` → list refetch.

## 4. Theming + i18n + fonts

- `src/constants/theme.ts` — `Colors` palette (incl. per-domain
  fuel/service/expense/reminder), `Fonts`, `getAppFontFamily()`, `globalStyles`
  (FAB, bottom-sheet modal, summaryCard)
- Fonts loaded in `_layout.tsx:29-32` from `src/assets/fonts/Vazirmatn-*.ttf`;
  `fontFamily` resolved per language via `useAppFontFamily()`
- `src/languages/useTranslation.ts` — language from
  `useGetProfile().data.language ?? "fa"`, `t(key)`, `isRTL` from `app.rtl` key.
  Dictionaries: `i18n/en.json`, `i18n/fa.json`. No `expo-localization`.

## 5. Types + validation

- `src/types/interfaces.ts` — DTOs (`$inferSelect`) + enums:
  `ReminderMode (OneTime|Recurring)`, `ReminderTriggerType (Odometer|Date|Either)`
- `src/types/*-schema.ts` — zod schemas built per locale: `fuel/expense/service/reminder-schema.ts`
