import { Text } from '@/components/AppText';
import { EmptyState } from '@/components/EmptyState';
import { ServiceReminderCard } from '@/components/ServiceReminderCard';
import { Colors } from '@/constants/theme';
import { useData } from '@/contexts/DataContext';
import { useTranslation } from '@/languages/useTranslation';
import { serviceTypeOptions } from '@/types/interfaces';
import { getServiceReminders } from '@/utils/serviceReminders';
import { useRouter } from 'expo-router';
import { BellIcon, CalendarClockIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useMediaQuery } from 'react-responsive';

export default function ServiceRemindersScreen() {
  const { t, isRTL } = useTranslation();
  const { services, stats } = useData();
  const router = useRouter();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const reminders = useMemo(() => getServiceReminders(services, stats.totalKm), [services, stats.totalKm]);

  const overdueCount = reminders.filter(r => r.dateProgress?.overdue || r.odometerProgress?.overdue).length;

  const getServiceLabel = (serviceType: string) =>
    serviceTypeOptions(t).find(s => s.value === serviceType)?.label || '-';

  return (
    <View style={[styles.wrapper, isRTL && { direction: 'rtl' }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {reminders.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <CalendarClockIcon
                size={22}
                color={overdueCount > 0 ? Colors.danger : Colors.service}
              />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryValue}>
                {reminders.length} {t('reminders.activeReminders')}
              </Text>
              <Text style={styles.summaryLabel}>
                {overdueCount > 0 ? `${overdueCount} ${t('reminders.needAttention')}` : t('reminders.allOnTrack')}
              </Text>
            </View>
          </View>
        )}

        {reminders.length === 0 ? (
          <EmptyState
            icon={BellIcon}
            title={t('reminders.noReminders')}
            subtitle={t('reminders.noRemindersDescription')}
          />
        ) : (
          reminders.map(reminder => (
            <ServiceReminderCard
              key={reminder.service.id}
              reminder={reminder}
              serviceLabel={getServiceLabel(reminder.service.type)}
              t={t}
              onPress={() => router.push(`/services?edit=${reminder.service.id}`)}
            />
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  contentDesktop: {
    maxWidth: 1024,
    alignSelf: 'center',
    width: '100%',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.danger + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    // fontWeight: 'bold',
    // fontFamily: 'VazirBold',
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
