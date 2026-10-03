import { Text } from '@/components/Text';
import { Colors } from '@/constants/theme';
import { NestedKeyOf, TranslationKeys } from '@/languages/TranslationKeys';
import { ServiceReminder, getProgressColor } from '@/utils/serviceReminders';
import { format } from 'date-fns';
import { CalendarIcon, GaugeIcon, LucideIcon, WrenchIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

interface Props {
  reminder: ServiceReminder;
  serviceLabel: string;
  t: (key: NestedKeyOf<TranslationKeys>) => string;
  icon?: LucideIcon;
  color?: string;
  onPress?: () => void;
}

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

export function ReminderCard({
  reminder,
  serviceLabel,
  t,
  icon: Icon = WrenchIcon,
  color = Colors.service,
  onPress,
}: Props) {
  const { service, dateProgress, odometerProgress } = reminder;

  const primaryProgress = dateProgress ?? odometerProgress;
  const headerColor = primaryProgress ? getProgressColor(primaryProgress.progress, primaryProgress.overdue) : color;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Icon
            size={20}
            color={color}
          />
        </View>
        <View style={styles.headerContent}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {serviceLabel}
          </Text>
          <Text style={styles.subtitle}>
            {t('reminders.lastService')}: {format(new Date(service.date), 'MMM d, yyyy')}
          </Text>
        </View>
        {primaryProgress?.overdue && (
          <View style={[styles.badge, { backgroundColor: Colors.danger + '15' }]}>
            <Text style={[styles.badgeText, { color: Colors.danger }]}>{t('reminders.overdue')}</Text>
          </View>
        )}
      </View>

      {dateProgress && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <CalendarIcon
              size={14}
              color={Colors.textSecondary}
            />
            <Text style={styles.progressLabel}>{t('reminders.byDate')}</Text>
            <Text
              style={[styles.progressValue, { color: getProgressColor(dateProgress.progress, dateProgress.overdue) }]}
            >
              {dateProgress.overdue
                ? `${Math.abs(dateProgress.remainingDays)} ${t('reminders.daysOverdue')}`
                : dateProgress.remainingDays === 0
                  ? t('reminders.dueToday')
                  : `${dateProgress.remainingDays} ${t('reminders.daysRemaining')}`}
            </Text>
          </View>
          <ProgressBar
            progress={dateProgress.progress}
            color={getProgressColor(dateProgress.progress, dateProgress.overdue)}
          />
          <Text style={styles.progressMeta}>
            {t('reminders.dueOn')} {format(new Date(dateProgress.dueDate), 'MMM d, yyyy')}
          </Text>
        </View>
      )}

      {odometerProgress && (
        <View style={[styles.progressSection, dateProgress && styles.progressSectionSpaced]}>
          <View style={styles.progressHeader}>
            <GaugeIcon
              size={14}
              color={Colors.textSecondary}
            />
            <Text style={styles.progressLabel}>{t('reminders.byOdometer')}</Text>
            <Text
              style={[
                styles.progressValue,
                { color: getProgressColor(odometerProgress.progress, odometerProgress.overdue) },
              ]}
            >
              {odometerProgress.overdue
                ? `${Math.abs(odometerProgress.remainingKm).toLocaleString()} ${t('common.km')} ${t('reminders.passed')}`
                : `${odometerProgress.remainingKm.toLocaleString()} ${t('common.km')} ${t('reminders.remaining')}`}
            </Text>
          </View>
          <ProgressBar
            progress={odometerProgress.progress}
            color={getProgressColor(odometerProgress.progress, odometerProgress.overdue)}
          />
          <Text style={styles.progressMeta}>
            {t('reminders.dueAt')} {odometerProgress.dueOdometer.toLocaleString()} {t('common.km')}
          </Text>
        </View>
      )}

      {!dateProgress?.overdue && !odometerProgress?.overdue && primaryProgress && (
        <View style={[styles.statusDot, { backgroundColor: headerColor + '20' }]}>
          <View style={[styles.dot, { backgroundColor: headerColor }]} />
          <Text style={[styles.statusText, { color: headerColor }]}>
            {Math.round((1 - primaryProgress.progress) * 100)}% {t('reminders.remaining')}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    marginStart: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 600,
  },
  progressSection: {},
  progressSectionSpaced: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  progressLabel: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: 500,
  },
  progressValue: {
    fontSize: 13,
    fontWeight: 600,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 6,
  },
  statusDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 500,
  },
});
