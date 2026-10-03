import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type {
  ExpenseType,
  LanguageType,
  ServiceType,
} from "@/types/interfaces";

export const profileRecords = sqliteTable("profile", {
  id: integer("id").primaryKey(),
  fullName: text("full_name").default("-"),
  vehicleName: text("vehicle_name").default("-"),
  language: text("language").$type<LanguageType>().default("fa"),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const servicesRecords = sqliteTable("services", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  type: text("type").$type<ServiceType>().notNull(),
  date: text("date").notNull(),
  odometer: integer("odometer").notNull(),
  cost: integer("cost").notNull(),
  note: text("note"),
  nextDueDate: text("next_due_date"),
  nextDueOdometer: integer("next_due_odometer"),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const fuelsRecords = sqliteTable("fuels", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  date: text("date").notNull(),
  odometer: integer("odometer").notNull(),
  liters: integer("liters").notNull(),
  pricePerLiter: integer("price_per_liter").notNull(),
  totalCost: integer("total_cost").notNull(),
  fullTank: integer("full_tank", { mode: "boolean" }).notNull(),
  station: text("station"),
  note: text("note"),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const expensesRecords = sqliteTable("expenses", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  type: text("type").$type<ExpenseType>().notNull(),
  date: text("date").notNull(),
  odometer: integer("odometer").notNull(),
  amount: integer("amount").notNull(),
  note: text("note"),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});
