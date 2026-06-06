import { Button } from '@/components/Button';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { DatePicker } from '@/components/DatePicker';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/Input';
import { PriceValue } from '@/components/PriceValue';
import { RecordCard } from '@/components/RecordCard';
import { SwitchToggle } from '@/components/SwitchToggle';
import { Text } from '@/components/AppText';
import { Colors } from '@/constants/theme';
import { useData } from '@/contexts/DataContext';
import { useTranslation } from '@/languages/useTranslation';
import { FuelDto } from '@/types/interfaces';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { FuelIcon, PlusIcon, TrendingUpIcon, XIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useMediaQuery } from 'react-responsive';

export default function FuelScreen() {
  const { t, isRTL } = useTranslation();

  const { fuelRecords, addFuelRecord, updateFuelRecord, deleteFuelRecord, stats } = useData();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmValidation, setIsConfirmValidation] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [odometer, setOdometer] = useState('');
  const [liters, setLiters] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [fullTank, setFullTank] = useState(true);
  const [station, setStation] = useState('');

  useEffect(() => {
    if (edit) {
      const fuel = fuelRecords.find(f => f.id === edit);
      if (fuel) {
        openEditModal(fuel);
      }
    }
  }, [edit, fuelRecords]);

  const handleValidationClose = () => {
    setIsConfirmValidation(false);
  };

  const handleDeleteConfirm = async () => {
    if (!editingId) return;
    await deleteFuelRecord(editingId);
    setIsConfirmDelete(false);
    setModalVisible(false);
    resetForm();
  };

  const handleDeleteClose = () => {
    setIsConfirmDelete(false);
  };

  const resetForm = () => {
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setOdometer('');
    setLiters('');
    setPricePerLiter('');
    setFullTank(true);
    setStation('');
    setEditingId(null);
  };

  const openEditModal = (fuel: FuelDto) => {
    setEditingId(fuel.id);
    setDate(fuel.date);
    setOdometer(fuel.odometer?.toString());
    setLiters(fuel.liters?.toString());
    setPricePerLiter(fuel.pricePerLiter.toString());
    setFullTank(fuel.fullTank);
    setStation(fuel.station || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!odometer || !liters || !pricePerLiter) {
      setIsConfirmValidation(true);
      return;
    }

    setSaving(true);
    try {
      const lt = parseFloat(liters);
      const price = parseFloat(pricePerLiter);

      const data = {
        date,
        odometer: parseInt(odometer),
        liters: lt,
        pricePerLiter: price,
        totalCost: lt * price,
        fullTank,
        station: station || undefined,
      };

      if (editingId) {
        await updateFuelRecord(editingId, data);
      } else {
        await addFuelRecord(data);
      }

      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.warn('Error saving fuel record:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingId) return;

    setIsConfirmDelete(true);
  };

  const totalCost = liters && pricePerLiter ? (parseFloat(liters) * parseFloat(pricePerLiter)).toFixed(2) : '0.00';

  //#region JSX
  return (
    <View style={[styles.wrapper, isRTL && { direction: 'rtl' }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {stats.avgKmPerLiter > 0 && (
          <View style={styles.disPerLiterCard}>
            <View style={styles.disPerLiterIconContainer}>
              <TrendingUpIcon
                size={20}
                color={Colors.success}
              />
            </View>
            <View>
              <Text style={styles.disPerLiterValue}>
                {stats.avgKmPerLiter.toFixed(1)} {t('fuel.kmPerLiter')}
              </Text>
              <Text style={styles.disPerLiterLabel}>{t('fuel.averageFuelEconomy')}</Text>
            </View>
          </View>
        )}

        {fuelRecords.length === 0 ? (
          <EmptyState
            icon={FuelIcon}
            title={t('fuel.noFuelRecords')}
            subtitle={t('fuel.fuelDescription')}
          />
        ) : (
          fuelRecords.map(fuel => (
            <RecordCard
              key={fuel.id}
              title={`${fuel.liters?.toFixed(1)} ${t('common.liter')}`}
              date={fuel.date}
              amount={fuel.totalCost}
              subtitle={`${fuel.odometer} ${t('common.km')}`}
              icon={FuelIcon}
              color={Colors.fuel}
              rtl={isRTL}
              onPress={() => openEditModal(fuel)}
            />
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[isRTL ? styles.fabContainerRTL : styles.fabContainer, isDesktop && styles.fabContainerDesktop]}>
        <Pressable
          style={({ pressed }) => [styles.fab, isRTL && styles.fabRTL, pressed && styles.fabPressed]}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <PlusIcon
            size={24}
            color='#FFFFFF'
          />
        </Pressable>
      </View>

      <Modal
        visible={isModalVisible}
        animationType='fade'
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? t('fuel.updateTitle') : t('fuel.createTitle')}</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <XIcon
                  size={24}
                  color={Colors.text}
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <DatePicker
                label={t('fuel.date')}
                value={date}
                onChange={setDate}
              />

              <Input
                label={t('fuel.odometer')}
                value={odometer}
                onChangeText={setOdometer}
                keyboardType='numeric'
                placeholder={t('fuel.odometerPlaceholder')}
              />

              <Input
                label={t('fuel.liters')}
                value={liters}
                onChangeText={setLiters}
                keyboardType='decimal-pad'
                placeholder={t('fuel.litersPlaceholder')}
              />

              <Input
                label={t('fuel.price')}
                value={pricePerLiter}
                onChangeText={setPricePerLiter}
                keyboardType='decimal-pad'
                placeholder={t('fuel.pricePlaceholder')}
              />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t('fuel.totalCost')}</Text>
                <PriceValue value={totalCost} />
              </View>

              <SwitchToggle
                label={t('fuel.fullTank')}
                value={fullTank}
                onValueChange={setFullTank}
                description={t('fuel.fullTankPlaceholder')}
              />

              <Input
                label={t('fuel.station')}
                value={station}
                onChangeText={setStation}
                placeholder={t('fuel.stationPlaceHolder')}
              />

              <View style={styles.buttonRow}>
                {editingId && (
                  <Button
                    title={t('common.delete')}
                    variant='danger'
                    onPress={handleDelete}
                    style={{ flex: 1 }}
                  />
                )}
                <Button
                  title={editingId ? t('common.update') : t('common.save')}
                  onPress={handleSave}
                  loading={saving}
                  style={{ flex: 1 }}
                />
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ConfirmationDialog
        visible={isConfirmValidation}
        onConfirm={handleValidationClose}
        onCancel={handleValidationClose}
        type='Ok'
        message={t('fuel.confirmValidation')}
      />

      <ConfirmationDialog
        visible={isConfirmDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteClose}
        message={t('fuel.confirmDelete')}
      />
    </View>
  );
  //#endregion
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
  disPerLiterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '15',
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 16,
  },
  disPerLiterIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.success + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disPerLiterValue: {
    fontSize: 20,
    fontWeight: 700,
    color: Colors.success,
  },
  disPerLiterLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fabContainerRTL: {
    position: 'absolute',
    left: 16,
    bottom: 16,
  },
  fabContainerDesktop: {
    right: 32,
    bottom: 32,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.fuel,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  fabRTL: {
    flexDirection: 'row-reverse',
  },

  fabPressed: {
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalContentDesktop: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 24,
    marginBottom: 40,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: Colors.text,
  },
  modalScroll: {
    padding: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 700,
    color: Colors.text,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
});
