# Yadli — Offline Vehicle Maintenance Manager

Offline-first React Native app for managing vehicle maintenance.
No registration, no login, no backend. All data stays on-device in SQLite.

Log refueling, periodic services, vehicle expenses, and set odometer/date
reminders for future maintenance.

> SDK: Expo ~57.0.26 (`package.json:15`) · React 19.2.3 · React Native 0.86.3 ·
> Expo Router ~57.0.24 · `expo-sqlite` + `drizzle-orm` + `@tanstack/react-query`

## Features

- **Fuel log:** date, odometer, liters, price/liter, total, full-tank flag, station
- **Services:** type, date, odometer, cost, note
- **Expenses:** type (insurance, registration, etc.), date, odometer, amount
- **Reminders:** one-time / recurring, by odometer and/or date —
  see `docs/reminders.md`
- **Dashboard:** totals + recent records (`src/app/(tabs)/(home)/index.tsx`)
- **Bilingual FA/EN + RTL:** language stored in `profile` table,
  hook `src/languages/useTranslation.ts`
- **Offline only:** `openDatabaseSync("yadli.db")` (`src/db/index.ts:1`),
  Drizzle migrations in `src/db/migrations/`

## Requirements

- Node LTS + `pnx` (pnpm: package manager)
- Expo Go for quick preview, or a dev build for native modules
- No Xcode / Android Studio required unless running `expo run:ios|android`

## Quickstart

```bash
# 1. install
pnpm install

# 2. start dev server
pnpm start
```

## Scripts

```bash
pnpm start          # dev server
pnpm lint           # lint (Biome / Expo)
pnpm tsc --noEmit   # typecheck — run before every commit
pnpm expo-doctor    # diagnose deps/config
pnpm expo install --fix   # fix SDK-incompatible versions
pnpm db:generate    # drizzle-kit generate
pnpm db:migrate     # drizzle-kit migrate (local tooling)
```

> Always install native libs with `pnx expo install <package>` (not plain
> `npm add`) so SDK 57-compatible versions are resolved.

## Project structure

```
src/
  app/                Expo Router screens — every file is a route
    index.tsx         → Redirect to /(tabs)/(home)
    (tabs)/           5 tabs + settings screen
      (home)/         dashboard
      fuel/           fuel page
      services/       services page
      expenses/       expense page
      reminders/      reminders page
      settings/       app settings (hidden in bottom-bar)
  components/         presentational UI (Button, Input, Text, …)
  components/forms/   all project forms
  repositories/       TanStack Query hooks per entity (*-repository.ts)
  db/                 drizzle schema (schema.ts), client (index.ts), 
    migrations/       migration files
  languages/          translation files
  types/              zod schemas + interfaces.ts (DTOs + enums)
  utils/              some of utils files
  hooks/ 
  constants/ 
  assets/
docs/                 project architecture and other documents 
```

## Offline data flow

No auth, no network. `query-client.ts` is a bare `new QueryClient()`.

## Building with EAS (no local native toolchain needed)

```bash
# dev build (needed after adding native modules like expo-notifications)
pnx eas-cli@latest build --profile development --platform all

# production / submit / OTA update
pnx eas-cli@latest build --platform all
pnx eas-cli@latest submit
pnx eas-cli@latest update
```

`ios/` and `android/` do not exist by design (Continuous Native Generation).
Configure native behavior in `app.json` + config plugins — never hand-edit
native folders.

## Docs

- `docs/architecture.md` — stack, routing, data layer, theming/i18n
- `docs/workflow.md` — dev setup, DB migrations, how to add a feature
- `docs/reminders.md` — current state audit + step-by-step completion guide
- `docs/notifications.md` — step-by-step local-notification implementation (SDK 57)
- `docs/structure.md` — structure review + proposed changes with reasons
