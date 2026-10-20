# Project structure review + proposed changes

## Hygiene

 1. **i18n loader indirection** (`translationLoaders` wraps static imports) +
    hand-maintained `TranslationKeys.d.ts` will drift.
    Change: plain dict lookup; generate the keys type.
 2. **Redundant `tsconfig` path** (`@/assets/*` already covered by `@/*`).
 3. **Add `src/services/`** for notifications scheduler (see `notifications.md`);
    keep `utils/` pure (date math, formatting).
