import type { ServiceDto } from "@/types/interfaces";

export interface DateReminderProgress {
  progress: number;
  remainingDays: number;
  overdue: boolean;
  dueDate: string;
}

export interface OdometerReminderProgress {
  progress: number;
  remainingKm: number;
  overdue: boolean;
  dueOdometer: number;
}

export interface ServiceReminder {
  service: ServiceDto;
  dateProgress?: DateReminderProgress;
  odometerProgress?: OdometerReminderProgress;
  urgency: number;
}

function clampProgress(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function getDateReminderProgress(
  service: ServiceDto,
): DateReminderProgress | undefined {
  if (!service.nextDueDate) return undefined;

  const start = new Date(service.date).getTime();
  const end = new Date(service.nextDueDate).getTime();
  const now = Date.now();

  if (end <= start) return undefined;

  const elapsed = now - start;
  const total = end - start;
  const remainingMs = end - now;
  const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

  return {
    progress: clampProgress(elapsed / total),
    remainingDays,
    overdue: remainingDays < 0,
    dueDate: service.nextDueDate,
  };
}

export function getOdometerReminderProgress(
  service: ServiceDto,
  currentOdometer: number,
): OdometerReminderProgress | undefined {
  if (!service.nextDueOdometer) return undefined;

  const start = service.odometer;
  const end = service.nextDueOdometer;

  if (end <= start) return undefined;

  const remainingKm = end - currentOdometer;

  return {
    progress: clampProgress((currentOdometer - start) / (end - start)),
    remainingKm,
    overdue: remainingKm < 0,
    dueOdometer: end,
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

export function getServiceReminders(
  services: ServiceDto[],
  currentOdometer: number,
): ServiceReminder[] {
  const reminders: ServiceReminder[] = [];

  return [];

  // for (const service of services) {
  //   const dateProgress = getDateReminderProgress(service);
  //   const odometerProgress = getOdometerReminderProgress(service, currentOdometer);

  //   if (!dateProgress && !odometerProgress) continue;

  //   reminders.push({
  //     service,
  //     dateProgress,
  //     odometerProgress,
  //     urgency: getUrgency(dateProgress, odometerProgress),
  //   });
  // }

  // return reminders.sort((a, b) => b.urgency - a.urgency);
}

export function getProgressColor(progress: number, overdue: boolean): string {
  if (overdue || progress >= 1) return "#EF4444";
  if (progress >= 0.85) return "#EF4444";
  if (progress >= 0.6) return "#F59E0B";
  return "#10B981";
}
