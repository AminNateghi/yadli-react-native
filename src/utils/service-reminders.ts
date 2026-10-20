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
  maxDate: Date | null;
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

async function getLatestOdometerAndDate(
  services: ServiceDto[],
  fuels: FuelDto[],
  expense: ExpenseDto[],
) {
  const servicesList = services.sort((a, b) => b.odometer - a.odometer).at(0);
  const fuelsList = fuels.sort((a, b) => b.odometer - a.odometer).at(0);
  const expensesList = expense.sort((a, b) => b.odometer - a.odometer).at(0);

  // ====== Maximum Odometer / Date
  const flatOdometer = [
    servicesList?.odometer,
    fuelsList?.odometer,
    expensesList?.odometer,
  ].filter((v): v is number => !!v);
  const maxOdometer = flatOdometer.length > 0 ? Math.max(...flatOdometer) : 0;

  const flatDate = [
    servicesList?.date,
    fuelsList?.date,
    expensesList?.date,
  ].filter((v): v is Date => !!v);
  const maxDate =
    flatDate.length > 0
      ? new Date(Math.max(...flatDate.map((d) => d.getTime())))
      : null;

  return { maxOdometer, maxDate };
}

// compute the progress of a reminder based on its trigger type and the latest data
async function getDateReminderProgress(
  reminder: ReminderDto,
  latest: LatestData,
): Promise<DateReminderProgress | undefined> {
  if (!reminder.startDate) return undefined;

  const startDate = reminder.startDate ? dayjs(reminder.startDate) : null;
  const nextDateRaw = calculateNextThresholds(reminder).nextDate;
  const endDate = nextDateRaw ? dayjs(nextDateRaw) : null;

  if (!startDate || !endDate) {
    return undefined;
  }

  // Fallback to current date if no log entries exist yet
  const currentDate = latest.maxDate ? dayjs(latest.maxDate) : dayjs();

  const totalDurationMs = endDate.diff(startDate);
  if (totalDurationMs <= 0) return undefined;

  const elapsedMs = currentDate.diff(startDate);
  const progress = clampProgress(elapsedMs / totalDurationMs);

  // Calculate remaining whole days between the reference date and due date
  const remainingDays = endDate.diff(currentDate, "day");

  return {
    progress,
    remainingDays,
    overdue: remainingDays < 0 || currentDate.isAfter(endDate),
    dueDate: endDate.toDate(),
  };
}

async function getOdometerReminderProgress(
  reminder: ReminderDto,
  latest: LatestData,
): Promise<OdometerReminderProgress | undefined> {
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

export async function getReminders(
  reminders: ReminderDto[],
  inputData: {
    services: ServiceDto[];
    fuels: FuelDto[];
    expense: ExpenseDto[];
  },
): Promise<ReminderCardProp[]> {
  const latest = await getLatestOdometerAndDate(
    inputData.services,
    inputData.fuels,
    inputData.expense,
  );

  const result: ReminderCardProp[] = [];

  for (const reminder of reminders) {
    const dateProgress = await getDateReminderProgress(reminder, latest);

    const odometerProgress = await getOdometerReminderProgress(
      reminder,
      latest,
    );

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
