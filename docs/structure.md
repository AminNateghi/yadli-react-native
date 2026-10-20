# Project structure review + proposed changes

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
