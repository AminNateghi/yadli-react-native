import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type {
  ReminderMode,
  ReminderTriggerType,
  ExpenseType,
  LanguageType,
  ServiceType,
} from "@/types/interfaces";

export const profileRecords = sqliteTable("profile", {
  id: integer("id").primaryKey(),
  fullName: text("full_name").default("-"),
  vehicleName: text("vehicle_name").default("-"),
  language: text("language").$type<LanguageType>().default("fa"),
});

export const servicesRecords = sqliteTable("services", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  type: text("type").$type<ServiceType>().notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  odometer: integer("odometer").notNull(),
  cost: integer("cost").notNull(),
  note: text("note"),
});

export const fuelsRecords = sqliteTable("fuels", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  date: integer("date", { mode: "timestamp" }).notNull(),
  odometer: integer("odometer").notNull(),
  liters: integer("liters").notNull(),
  pricePerLiter: integer("price_per_liter").notNull(),
  totalCost: integer("total_cost").notNull(),
  fullTank: integer("full_tank", { mode: "boolean" }).notNull(),
  station: text("station"),
  note: text("note"),
});

export const expensesRecords = sqliteTable("expenses", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  type: text("type").$type<ExpenseType>().notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  odometer: integer("odometer").notNull(),
  amount: integer("amount").notNull(),
  note: text("note"),
});

export const remindersRecords = sqliteTable("reminders", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // What the reminder is for
  serviceType: text("service_type").$type<ServiceType>(),
  expenseType: text("expense_type").$type<ExpenseType>(),

  // one-time | recurring
  mode: text("mode").$type<ReminderMode>().notNull().default("OneTime"),

  // mileage | date | either
  triggerType: text("trigger_type")
    .$type<ReminderTriggerType>()
    .notNull()
    .default("Either"),

  // Mileage when the interval started
  startOdometer: integer("start_odometer"),
  // Date when the interval started
  startDate: integer("start_date", {
    mode: "timestamp",
  }),

  // How many km until next reminder
  odometerInterval: integer("odometer_interval"),

  // How many months/days until next reminder.
  // More on this below.
  dateIntervalMonths: integer("date_interval_months"),

  active: integer("active", {
    mode: "boolean",
  })
    .notNull()
    .default(true),

  note: text("note"),
});
