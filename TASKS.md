## Reminders & notifications status

| Area | Status |
|------|--------|
| Reminder CRUD + list UI | Done |
| Threshold calc (`nextOdometer`/`nextDate`), due/overdue logic, Complete action | Incomplete — dead code, see `docs/reminders.md` |
| Local notifications (`expo-notifications`) | Not implemented (package not installed), see `docs/notifications.md` |

Do not use `triggerType` (reminder domain field) confused with notification
triggers — they are unrelated.