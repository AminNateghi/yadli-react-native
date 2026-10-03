CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`date` text NOT NULL,
	`odometer` integer NOT NULL,
	`amount` integer NOT NULL,
	`note` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `fuels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`odometer` integer NOT NULL,
	`liters` integer NOT NULL,
	`price_per_liter` integer NOT NULL,
	`total_cost` integer NOT NULL,
	`full_tank` integer NOT NULL,
	`station` text,
	`note` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` integer PRIMARY KEY NOT NULL,
	`full_name` text DEFAULT '-',
	`vehicle_name` text DEFAULT '-',
	`language` text DEFAULT 'fa',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`date` text NOT NULL,
	`odometer` integer NOT NULL,
	`cost` integer NOT NULL,
	`note` text,
	`next_due_date` text,
	`next_due_odometer` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
