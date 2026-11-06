import type {
  ExpenseDto,
  FuelDto,
  ReminderDto,
  ServiceDto,
} from "@/types/interfaces";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type LatestData = {
  maxOdometer: number;
};

type ReminderThresholds = {
  nextOdometer: number | null;
  nextDate: Date | null;
};

interface DateReminderProgress {
  progress: number;
  remainingDays: number;
  overdue: boolean;
  dueDate: Date;
}

interface OdometerReminderProgress {
  progress: number;
  remainingKm: number;
  overdue: boolean;
  dueOdometer: number;
}

export interface ReminderCardProp {
  data: ReminderDto;
  dateProgress?: DateReminderProgress;
  odometerProgress?: OdometerReminderProgress;
  urgency: number;
  progressColor: string;
}

function clampProgress(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function getLatestOdometer(
  services: ServiceDto[],
  fuels: FuelDto[],
  expense: ExpenseDto[],
): LatestData {
  const getHighestOdometerRecord = (records: { odometer: number }[]) => {
    let highestRecord: (typeof records)[number] | undefined;
    for (const record of records) {
      if (!highestRecord || record.odometer > highestRecord.odometer) {
        highestRecord = record;
      }
    }
    return highestRecord;
  };

  const highestOdometerRecords = [
    getHighestOdometerRecord(services),
    getHighestOdometerRecord(fuels),
    getHighestOdometerRecord(expense),
  ];
  let maxOdometer = 0;

  for (const record of highestOdometerRecords) {
    if (record?.odometer && record.odometer > maxOdometer) {
      maxOdometer = record.odometer;
    }
  }

  return { maxOdometer };
}

// compute the progress of a reminder based on its trigger type and the latest data
function getDateReminderProgress(
  reminder: ReminderDto,
  today: Date,
): DateReminderProgress | undefined {
  if (!reminder.startDate) return undefined;

  const startDate = reminder.startDate ? dayjs(reminder.startDate) : null;
  const nextDateRaw = calculateNextThresholds(reminder).nextDate;
  const endDate = nextDateRaw ? dayjs(nextDateRaw) : null;

  if (!startDate || !endDate) {
    return undefined;
  }

  const currentDate = dayjs(today).startOf("day");
  const dueDate = endDate.startOf("day");

  const totalDurationMs = dueDate.diff(startDate.startOf("day"));
  if (totalDurationMs <= 0) return undefined;

  const elapsedMs = currentDate.diff(startDate.startOf("day"));
  const progress = clampProgress(elapsedMs / totalDurationMs);

  // Calculate remaining whole days between the reference date and due date
  const remainingDays = dueDate.diff(currentDate, "day");

  return {
    progress,
    remainingDays,
    overdue: remainingDays < 0,
    dueDate: endDate.toDate(),
  };
}

function getOdometerReminderProgress(
  reminder: ReminderDto,
  latest: LatestData,
): OdometerReminderProgress | undefined {
  if (!reminder.startOdometer) return undefined;

  const latestOdometer = latest.maxOdometer;
  const startOdometer = reminder.startOdometer;
  const endOdometer = calculateNextThresholds(reminder).nextOdometer;

  if (startOdometer == null || endOdometer == null) {
    return undefined;
  }

  if (endOdometer <= startOdometer) return undefined;

  const remainingKm = endOdometer - latestOdometer;

  return {
    progress: clampProgress(
      (latestOdometer - startOdometer) / (endOdometer - startOdometer),
    ),
    remainingKm,
    overdue: remainingKm < 0,
    dueOdometer: endOdometer,
  };
}

function getUrgency(
  dateProgress?: DateReminderProgress,
  odometerProgress?: OdometerReminderProgress,
): number {
  const scores: number[] = [];

  if (dateProgress) {
    scores.push(
      dateProgress.overdue
        ? -dateProgress.remainingDays
        : dateProgress.progress,
    );
  }

  if (odometerProgress) {
    scores.push(odometerProgress.overdue ? 2 : odometerProgress.progress);
  }

  return scores.length > 0 ? Math.max(...scores) : 0;
}

function getProgressColor(progress: number, overdue: boolean): string {
  if (overdue || progress >= 1) return "#c13030";
  if (progress >= 0.85) return "#EF4444";
  if (progress >= 0.75) return "#F59E0B";
  return "#10B981";
}

function calculateNextThresholds(reminder: ReminderDto): ReminderThresholds {
  let nextOdometer: number | null = null;
  let nextDate: Date | null = null;

  if (
    (reminder.triggerType === "Odometer" ||
      reminder.triggerType === "Either") &&
    reminder.startOdometer != null &&
    reminder.odometerInterval != null
  ) {
    nextOdometer = reminder.startOdometer + reminder.odometerInterval;
  }

  if (
    (reminder.triggerType === "Date" || reminder.triggerType === "Either") &&
    reminder.startDate != null &&
    reminder.dateIntervalMonths != null
  ) {
    const startDate = dayjs(reminder.startDate);
    nextDate = startDate.add(reminder.dateIntervalMonths, "month").toDate();
  }

  return {
    nextOdometer,
    nextDate,
  };
}

export function getReminderDueDate(reminder: ReminderDto): Date | null {
  return calculateNextThresholds(reminder).nextDate;
}

export function getReminders(
  reminders: ReminderDto[],
  inputData: {
    services: ServiceDto[];
    fuels: FuelDto[];
    expense: ExpenseDto[];
  },
  today: Date = new Date(),
): ReminderCardProp[] {
  const latest = getLatestOdometer(
    inputData.services,
    inputData.fuels,
    inputData.expense,
  );

  const result: ReminderCardProp[] = [];

  for (const reminder of reminders) {
    const dateProgress = getDateReminderProgress(reminder, today);
    const odometerProgress = getOdometerReminderProgress(reminder, latest);

    if (!dateProgress && !odometerProgress) continue;

    result.push({
      data: reminder,
      dateProgress,
      odometerProgress,
      urgency: getUrgency(dateProgress, odometerProgress),
      progressColor: getProgressColor(
        dateProgress?.progress ?? odometerProgress?.progress ?? 0,
        !!(dateProgress?.overdue || odometerProgress?.overdue),
      ),
    });
  }

  return result.sort((a, b) => b.urgency - a.urgency);
}
