CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`custom_name` text NOT NULL,
	`make_model` text,
	`year` integer,
	`purchase_date` integer,
	`purchase_price` real,
	`purchase_odometer` integer,
	`type` text,
	`fuel_type` text DEFAULT 'Gasoline' NOT NULL,
	`capacity` real
);
--> statement-breakpoint
INSERT INTO `vehicles` (`id`, `custom_name`, `fuel_type`)
SELECT 1, COALESCE(NULLIF(NULLIF(`vehicle_name`, ''), '-'), 'My Vehicle'), 'Gasoline'
FROM `profile` WHERE `id` = 1;
--> statement-breakpoint
INSERT INTO `vehicles` (`id`, `custom_name`, `fuel_type`)
SELECT 1, 'My Vehicle', 'Gasoline'
WHERE NOT EXISTS (SELECT 1 FROM `vehicles` WHERE `id` = 1);
--> statement-breakpoint
ALTER TABLE `profile` ADD `active_vehicle_id` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
ALTER TABLE `profile` DROP COLUMN `vehicle_name`;
--> statement-breakpoint
ALTER TABLE `services` ADD `vehicle_id` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
ALTER TABLE `fuels` ADD `vehicle_id` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
ALTER TABLE `expenses` ADD `vehicle_id` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
ALTER TABLE `reminders` ADD `vehicle_id` integer DEFAULT 1 NOT NULL;
