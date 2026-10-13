ALTER TABLE `reminders` RENAME COLUMN "start_mileage" TO "start_odometer";--> statement-breakpoint
ALTER TABLE `reminders` RENAME COLUMN "mileage_interval" TO "odometer_interval";--> statement-breakpoint
ALTER TABLE `reminders` DROP COLUMN `next_mileage`;--> statement-breakpoint
ALTER TABLE `reminders` DROP COLUMN `next_date`;