import { sql } from "drizzle-orm";
import {
  check,
  integer,
  index,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import type {
  ReminderMode,
  ReminderTriggerType,
  ExpenseType,
  FuelType,
  LanguageType,
  ServiceType,
  VehicleType,
} from "@/types/interfaces";
import {
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_DISTANCE_UNIT,
  DEFAULT_FUEL_UNIT,
} from "@/constants";

export const profileRecords = sqliteTable("profile", {
  id: integer("id").primaryKey(),
  fullName: text("full_name").default("-"),
  activeVehicleId: integer("active_vehicle_id").notNull().default(1),
  language: text("language").$type<LanguageType>().default("fa"),
  distanceUnit: text("distance_unit").default(DEFAULT_DISTANCE_UNIT),
  fuelUnit: text("fuel_unit").default(DEFAULT_FUEL_UNIT),
  currencySymbol: text("currency_symbol").default(DEFAULT_CURRENCY_SYMBOL),
  lastUpdatedDate: text("last_updated_date"),
  onboarding: integer("onboarding", { mode: "boolean" })
    .notNull()
    .default(false),
});

export const vehiclesRecords = sqliteTable("vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customName: text("custom_name").notNull(),
  makeModel: text("make_model"),
  year: integer("year"),
  purchaseDate: integer("purchase_date", { mode: "timestamp" }),
  purchasePrice: real("purchase_price"),
  purchaseOdometer: integer("purchase_odometer"),
  type: text("type").$type<VehicleType>(),
  fuelType: text("fuel_type").$type<FuelType>().notNull().default("Gasoline"),
  capacity: real("capacity"),
  sold: integer("sold", { mode: "boolean" }).notNull().default(false),
  soldDate: integer("sold_date", { mode: "timestamp" }),
  soldPrice: real("sold_price"),
  soldOdometer: integer("sold_odometer"),
});

export const servicesRecords = sqliteTable("services", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  type: text("type", { mode: "json" }).$type<ServiceType[]>().notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  odometer: integer("odometer").notNull(),
  cost: real("cost").notNull(),
  note: text("note"),
  vehicleId: integer("vehicle_id").notNull().default(1),
});

export const fuelsRecords = sqliteTable("fuels", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  date: integer("date", { mode: "timestamp" }).notNull(),
  odometer: integer("odometer").notNull(),
  liters: real("liters").notNull(),
  pricePerLiter: real("price_per_liter").notNull(),
  totalCost: real("total_cost").notNull(),
  fullTank: integer("full_tank", { mode: "boolean" }).notNull(),
  station: text("station"),
  note: text("note"),
  vehicleId: integer("vehicle_id").notNull().default(1),
});

export const expensesRecords = sqliteTable("expenses", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  type: text("type").$type<ExpenseType>().notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  odometer: integer("odometer").notNull(),
  amount: real("amount").notNull(),
  note: text("note"),
  vehicleId: integer("vehicle_id").notNull().default(1),
});

export const remindersRecords = sqliteTable(
  "reminders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    serviceId: integer("service_id").references(() => servicesRecords.id, {
      onDelete: "cascade",
    }),
    expenseId: integer("expense_id").references(() => expensesRecords.id, {
      onDelete: "cascade",
    }),
    serviceType: text("service_type").$type<ServiceType>(),
    expenseType: text("expense_type").$type<ExpenseType>(),

    // one-time | recurring
    mode: text("mode").$type<ReminderMode>().notNull().default("OneTime"),

    // mileage | date | either
    triggerType: text("trigger_type")
      .$type<ReminderTriggerType>()
      .notNull()
      .default("Either"),

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
    vehicleId: integer("vehicle_id").notNull().default(1),
  },
  (table) => [
    index("reminders_service_id_idx").on(table.serviceId),
    index("reminders_expense_id_idx").on(table.expenseId),
    index("reminders_vehicle_service_type_idx").on(
      table.vehicleId,
      table.serviceType,
    ),
    index("reminders_vehicle_expense_type_idx").on(
      table.vehicleId,
      table.expenseType,
    ),
    check(
      "reminders_single_source_check",
      sql`(${table.serviceId} IS NOT NULL AND ${table.expenseId} IS NULL AND ${table.serviceType} IS NOT NULL AND ${table.expenseType} IS NULL) OR (${table.serviceId} IS NULL AND ${table.expenseId} IS NOT NULL AND ${table.serviceType} IS NULL AND ${table.expenseType} IS NOT NULL)`,
    ),
  ],
);
