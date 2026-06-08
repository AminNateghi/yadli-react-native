import { EmptyState } from '@/components/EmptyState';
import { RecordCard } from '@/components/RecordCard';
import { StatCard } from '@/components/StatCard';
import { Text } from '@/components/AppText';
import { Colors, rtlStyles } from '@/constants/theme';
import { useData } from '@/contexts/DataContext';
import { useTranslation } from '@/languages/useTranslation';
import { expenseTypeOptions, serviceTypeOptions } from '@/types/interfaces';
import { useRouter } from 'expo-router';
import {
  CalendarIcon,
  CarIcon,
  FuelIcon,
  GaugeIcon,
  ReceiptIcon,
  TrendingUpIcon,
  WrenchIcon,
} from 'lucide-react-native';
import { getServiceReminders } from '@/utils/serviceReminders';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useMediaQuery } from 'react-responsive';

export default function DashboardScreen() {
  const { t, isRTL } = useTranslation();
  const { services, fuelRecords, expenses, stats, isLoading } = useData();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const reminders = useMemo(() => getServiceReminders(services, stats.totalKm), [services, stats.totalKm]);
  const overdueCount = reminders.filter(r => r.dateProgress?.overdue || r.odometerProgress?.overdue).length;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const recentServices = services.slice(0, 3);
  const recentExpenses = expenses.slice(0, 3);
  const recentFuel = fuelRecords.slice(0, 3);
  const totalSpent = stats.totalFuelCost + stats.totalServiceCost + stats.totalExpenses;

  const getServiceLabel = (type: string) => serviceTypeOptions(t).find(s => s.value === type)?.label || '-';

  const getExpenseLabel = (category: string) =>
    expenseTypeOptions(t).find(c => c.value === category)?.label || category;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, isRTL && rtlStyles.rtl]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.carInfo}>
            <View style={styles.carIconContainer}>
              <CarIcon
                size={24}
                color={Colors.primary}
              />
            </View>
            <View>
              <Text style={styles.carTitle}>{t('dashboard.myVehicle')}</Text>
              <Text style={styles.carSubtitle}>
                {stats.totalKm?.toLocaleString()} {t('common.kilometer')}
              </Text>
            </View>
          </View>
          {overdueCount > 0 && (
            <Pressable onPress={() => router.push('/reminders')}>
              <View style={styles.nextService}>
                <CalendarIcon
                  size={14}
                  color={Colors.danger}
                />
                <Text style={styles.nextServiceText}>{t('reminders.overdue')}</Text>
              </View>
            </Pressable>
          )}
        </View>

        <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
          <StatCard
            title={t('dashboard.totalSpent')}
            value={`${totalSpent.toFixed(0)}`}
            subtitle={t('dashboard.allTime')}
            icon={TrendingUpIcon}
            color={Colors.primary}
          />
          <StatCard
            title={t('dashboard.avgPerKm')}
            value={stats.avgKmPerLiter > 0 ? stats.avgKmPerLiter.toFixed(1) : '0'}
            valueWithSpan={false}
            subtitle={t('dashboard.fuelEfficiency')}
            icon={GaugeIcon}
            color={Colors.success}
          />
        </View>

        <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
          <StatCard
            title={t('dashboard.fuelCosts')}
            value={`${stats.totalFuelCost.toFixed(0)}`}
            subtitle={`${fuelRecords.length} ${t('dashboard.fillUps')}`}
            icon={FuelIcon}
            color={Colors.fuel}
          />
          <StatCard
            title={t('dashboard.serviceCosts')}
            value={`${stats.totalServiceCost.toFixed(0)}`}
            subtitle={`${services.length} ${t('dashboard.servicesCount')}`}
            icon={WrenchIcon}
            color={Colors.service}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.recentFillUps')}</Text>
            <Pressable onPress={() => router.push('/fuel')}>
              <Text style={styles.seeAll}>{t('dashboard.seeAll')}</Text>
            </Pressable>
          </View>
          {recentFuel.length === 0 ? (
            <EmptyState
              icon={FuelIcon}
              title={t('fuel.noFuelRecords')}
              subtitle={t('fuel.fuelDescription')}
            />
          ) : (
            recentFuel.map(fuel => (
              <RecordCard
                key={fuel.id}
                title={`${fuel.liters?.toFixed(1)} ${t('common.liter')}`}
                date={fuel.date}
                amount={fuel.totalCost}
                icon={FuelIcon}
                color={Colors.fuel}
                rtl={isRTL}
                onPress={() => router.push(`/fuel?edit=${fuel.id}`)}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.recentServices')}</Text>
            <Pressable onPress={() => router.push('/services')}>
              <Text style={styles.seeAll}>{t('dashboard.seeAll')}</Text>
            </Pressable>
          </View>
          {recentServices.length === 0 ? (
            <EmptyState
              icon={WrenchIcon}
              title={t('services.noServicesYet')}
              subtitle={t('services.servicesDescription')}
            />
          ) : (
            recentServices.map(service => (
              <RecordCard
                key={service.id}
                title={getServiceLabel(service.type)}
                date={service.date}
                amount={service.cost}
                icon={WrenchIcon}
                color={Colors.service}
                rtl={isRTL}
                onPress={() => router.push(`/services?edit=${service.id}`)}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.recentExpenses')}</Text>
            <Pressable onPress={() => router.push('/expenses')}>
              <Text style={styles.seeAll}>{t('dashboard.seeAll')}</Text>
            </Pressable>
          </View>
          {recentExpenses.length === 0 ? (
            <EmptyState
              icon={ReceiptIcon}
              title={t('expenses.noExpenseYet')}
              subtitle={t('expenses.expensesDescription')}
            />
          ) : (
            recentExpenses.map(expense => (
              <RecordCard
                key={expense.id}
                title={getExpenseLabel(expense.type)}
                date={expense.date}
                amount={expense.amount}
                icon={ReceiptIcon}
                color={Colors.expense}
                rtl={isRTL}
                onPress={() => router.push(`/expenses?edit=${expense.id}`)}
              />
            ))
          )}
        </View>

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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  carIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: Colors.text,
  },
  carSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  nextService: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.danger + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  nextServiceText: {
    fontSize: 12,
    fontWeight: 500,
    color: Colors.danger,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statsGridDesktop: {
    maxWidth: 600,
  },
  section: {
    marginTop: 36,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 500,
  },
});
