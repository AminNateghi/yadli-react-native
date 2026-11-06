ALTER TABLE `vehicles` ADD `sold` integer DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE `vehicles` ADD `sold_date` integer;
--> statement-breakpoint
ALTER TABLE `vehicles` ADD `sold_price` real;
--> statement-breakpoint
ALTER TABLE `vehicles` ADD `sold_odometer` integer;
