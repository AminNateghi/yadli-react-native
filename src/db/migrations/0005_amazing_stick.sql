PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`date` integer NOT NULL,
	`odometer` integer NOT NULL,
	`amount` real NOT NULL,
	`note` text
);
--> statement-breakpoint
INSERT INTO `__new_expenses`("id", "type", "date", "odometer", "amount", "note") SELECT "id", "type", "date", "odometer", "amount", "note" FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_fuels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer NOT NULL,
	`odometer` integer NOT NULL,
	`liters` real NOT NULL,
	`price_per_liter` real NOT NULL,
	`total_cost` real NOT NULL,
	`full_tank` integer NOT NULL,
	`station` text,
	`note` text
);
--> statement-breakpoint
INSERT INTO `__new_fuels`("id", "date", "odometer", "liters", "price_per_liter", "total_cost", "full_tank", "station", "note") SELECT "id", "date", "odometer", "liters", "price_per_liter", "total_cost", "full_tank", "station", "note" FROM `fuels`;--> statement-breakpoint
DROP TABLE `fuels`;--> statement-breakpoint
ALTER TABLE `__new_fuels` RENAME TO `fuels`;--> statement-breakpoint
CREATE TABLE `__new_services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`date` integer NOT NULL,
	`odometer` integer NOT NULL,
	`cost` real NOT NULL,
	`note` text
);
--> statement-breakpoint
INSERT INTO `__new_services`("id", "type", "date", "odometer", "cost", "note") SELECT "id", "type", "date", "odometer", "cost", "note" FROM `services`;--> statement-breakpoint
DROP TABLE `services`;--> statement-breakpoint
ALTER TABLE `__new_services` RENAME TO `services`;