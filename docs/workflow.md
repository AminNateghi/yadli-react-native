# Workflow — develop, migrate, add a feature

## 1. Daily dev loop

```bash
npx expo start          # then `a` / `i` / `w` or scan QR
npx expo lint           # Biome / Expo lint
npx tsc --noEmit        # typecheck — run before every commit
npx expo-doctor         # when deps behave oddly
npx expo install --fix  # fix SDK-mismatched versions
```

> Install any native lib with `npx expo install <pkg>` (resolves SDK 57
> versions). Plain `npm add` can pull incompatible versions.
> After adding native code you need a dev build:
> `npx expo run:android|ios` locally or `eas build --profile development`.

## 2. DB migrations (Drizzle + expo-sqlite)

1. Edit `src/db/schema.ts` (source of truth).
2. Generate: `npm run db:generate` → new SQL in `src/db/migrations/` +
   updated `migrations.js` + `meta/_journal.json`.
3. The app applies them at boot via `useMigrations(db, migrations)`
   (`src/app/_layout.tsx:27`). Test on a fresh install AND on an
   existing `yadli.db` (upgrade path).
4. Commit `schema.ts` + the whole `migrations/` folder together.
5. Never hand-edit applied SQL; never delete `migrations.js` entries.

Dead code note: `src/db/migrate.ts` (`MigrateDatabase()` returns `undefined`)
is unused — the real gate is `_layout.tsx`. Delete or consolidate (see
`docs/structure.md`).

## 3. How to add / change a feature (example: fuel)

1. Schema first: `src/db/schema.ts` → `db:generate`.
2. Validation: `src/types/fuel-schema.ts` (`fuelSchema(t)` with translated messages).
3. Repository: `src/repositories/fuel-repository.ts` —
   `useFuels / useCreateFuel / useUpdateFuel / useDeleteFuel / useGetFuel`.
   Invalidate `["fuel-list"]` (and statistics — currently missing, add it).
4. Form: `src/components/forms/FuelForm.tsx` — copy the shell
   (FAB + transparent Modal + `globalStyles.modal*` + `react-hook-form + zodResolver`).
   Long-term: extract a shared `FormModalShell` (see `structure.md`).
5. List screen: `src/app/(tabs)/fuel/index.tsx` — `useFuels()` → map to
   `RecordCard`, `EmptyState` when empty, `editingId` state for edit modal.
6. i18n: add keys to **both** `en.json` and `fa.json`, update
   `TranslationKeys.d.ts` if hand-maintained.
7. Verify: `npx tsc --noEmit && npx expo lint`, manual test in RTL (FA) +
   LTR (EN), fresh-install + upgrade.

## 4. Translations

- Source: `useGetProfile().data.language ?? "fa"`.
- `t("reminders.title")` etc.; `isRTL = t("app.rtl") === "true"`.
- Every user string must exist in both locales. Known missing keys:
  `reminders.needAttention` (referenced in `services/index.tsx:55`),
  legacy `ReminderCard` keys (`lastService/byDate/byOdometer/overdue/…`),
  `fa.json: expenseType.Registration`.
