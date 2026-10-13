PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`date` integer NOT NULL,
	`odometer` integer NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_expenses`("id", "type", "date", "odometer", "amount", "note", "created_at", "updated_at") SELECT "id", "type", "date", "odometer", "amount", "note", "created_at", "updated_at" FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_fuels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer NOT NULL,
	`odometer` integer NOT NULL,
	`liters` integer NOT NULL,
	`price_per_liter` integer NOT NULL,
	`total_cost` integer NOT NULL,
	`full_tank` integer NOT NULL,
	`station` text,
	`note` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_fuels`("id", "date", "odometer", "liters", "price_per_liter", "total_cost", "full_tank", "station", "note", "created_at", "updated_at") SELECT "id", "date", "odometer", "liters", "price_per_liter", "total_cost", "full_tank", "station", "note", "created_at", "updated_at" FROM `fuels`;--> statement-breakpoint
DROP TABLE `fuels`;--> statement-breakpoint
ALTER TABLE `__new_fuels` RENAME TO `fuels`;--> statement-breakpoint
CREATE TABLE `__new_profile` (
	`id` integer PRIMARY KEY NOT NULL,
	`full_name` text DEFAULT '-',
	`vehicle_name` text DEFAULT '-',
	`language` text DEFAULT 'fa',
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_profile`("id", "full_name", "vehicle_name", "language", "created_at", "updated_at") SELECT "id", "full_name", "vehicle_name", "language", "created_at", "updated_at" FROM `profile`;--> statement-breakpoint
DROP TABLE `profile`;--> statement-breakpoint
ALTER TABLE `__new_profile` RENAME TO `profile`;--> statement-breakpoint
CREATE TABLE `__new_reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`service_type` text,
	`expense_type` text,
	`mode` text DEFAULT 'OneTime' NOT NULL,
	`trigger_type` text DEFAULT 'Either' NOT NULL,
	`start_odometer` integer,
	`start_date` integer,
	`odometer_interval` integer,
	`date_interval_months` integer,
	`active` integer DEFAULT true NOT NULL,
	`note` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_reminders`("id", "service_type", "expense_type", "mode", "trigger_type", "start_odometer", "start_date", "odometer_interval", "date_interval_months", "active", "note", "created_at", "updated_at") SELECT "id", "service_type", "expense_type", "mode", "trigger_type", "start_odometer", "start_date", "odometer_interval", "date_interval_months", "active", "note", "created_at", "updated_at" FROM `reminders`;--> statement-breakpoint
DROP TABLE `reminders`;--> statement-breakpoint
ALTER TABLE `__new_reminders` RENAME TO `reminders`;--> statement-breakpoint
CREATE TABLE `__new_services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`date` integer NOT NULL,
	`odometer` integer NOT NULL,
	`cost` integer NOT NULL,
	`note` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_services`("id", "type", "date", "odometer", "cost", "note", "created_at", "updated_at") SELECT "id", "type", "date", "odometer", "cost", "note", "created_at", "updated_at" FROM `services`;--> statement-breakpoint
DROP TABLE `services`;--> statement-breakpoint
ALTER TABLE `__new_services` RENAME TO `services`;