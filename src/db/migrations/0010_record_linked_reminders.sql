CREATE TABLE `reminders_new` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `service_id` integer,
  `expense_id` integer,
  `service_type` text,
  `expense_type` text,
  `mode` text DEFAULT 'OneTime' NOT NULL,
  `trigger_type` text DEFAULT 'Either' NOT NULL,
  `odometer_interval` integer,
  `date_interval_months` integer,
  `active` integer DEFAULT true NOT NULL,
  `note` text,
  `vehicle_id` integer DEFAULT 1 NOT NULL,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE cascade,
  CONSTRAINT `reminders_single_source_check` CHECK (
    (`service_id` IS NOT NULL AND `expense_id` IS NULL AND `service_type` IS NOT NULL AND `expense_type` IS NULL) OR
    (`service_id` IS NULL AND `expense_id` IS NOT NULL AND `service_type` IS NULL AND `expense_type` IS NOT NULL)
  )
);
--> statement-breakpoint
INSERT INTO `reminders_new` (
  `id`,
  `service_id`,
  `expense_id`,
  `service_type`,
  `expense_type`,
  `mode`,
  `trigger_type`,
  `odometer_interval`,
  `date_interval_months`,
  `active`,
  `note`,
  `vehicle_id`
)
SELECT
  r.`id`,
  CASE
    WHEN r.`service_type` IS NOT NULL THEN (
      SELECT s.`id`
      FROM `services` s
      WHERE s.`vehicle_id` = r.`vehicle_id`
        AND EXISTS (
          SELECT 1
          FROM json_each(s.`type`) AS service_type
          WHERE service_type.`value` = r.`service_type`
        )
      ORDER BY s.`date` DESC, s.`id` DESC
      LIMIT 1
    )
    ELSE NULL
  END,
  CASE
    WHEN r.`service_type` IS NULL AND r.`expense_type` IS NOT NULL THEN (
      SELECT e.`id`
      FROM `expenses` e
      WHERE e.`vehicle_id` = r.`vehicle_id`
        AND e.`type` = r.`expense_type`
      ORDER BY e.`date` DESC, e.`id` DESC
      LIMIT 1
    )
    ELSE NULL
  END,
  r.`service_type`,
  r.`expense_type`,
  r.`mode`,
  r.`trigger_type`,
  r.`odometer_interval`,
  r.`date_interval_months`,
  r.`active`,
  r.`note`,
  r.`vehicle_id`
FROM `reminders` r
WHERE
  (r.`service_type` IS NOT NULL AND EXISTS (
    SELECT 1
    FROM `services` s
    WHERE s.`vehicle_id` = r.`vehicle_id`
      AND EXISTS (
        SELECT 1
        FROM json_each(s.`type`) AS service_type
        WHERE service_type.`value` = r.`service_type`
      )
  ))
  OR
  (r.`service_type` IS NULL AND r.`expense_type` IS NOT NULL AND EXISTS (
    SELECT 1
    FROM `expenses` e
    WHERE e.`vehicle_id` = r.`vehicle_id`
      AND e.`type` = r.`expense_type`
  ));
--> statement-breakpoint
DROP TABLE `reminders`;
--> statement-breakpoint
ALTER TABLE `reminders_new` RENAME TO `reminders`;
--> statement-breakpoint
CREATE INDEX `reminders_service_id_idx`
  ON `reminders` (`service_id`);
--> statement-breakpoint
CREATE INDEX `reminders_expense_id_idx`
  ON `reminders` (`expense_id`);
--> statement-breakpoint
CREATE INDEX `reminders_vehicle_service_type_idx`
  ON `reminders` (`vehicle_id`, `service_type`);
--> statement-breakpoint
CREATE INDEX `reminders_vehicle_expense_type_idx`
  ON `reminders` (`vehicle_id`, `expense_type`);