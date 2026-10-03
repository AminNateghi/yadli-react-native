import { migrate, useMigrations } from "drizzle-orm/expo-sqlite/migrator";

import { db } from "./index";
import migrations from "./migrations/migrations";

export default function MigrateDatabase() {
  const { success, error } = useMigrations(db, migrations);
  //   await migrate(db, migrations);
}
