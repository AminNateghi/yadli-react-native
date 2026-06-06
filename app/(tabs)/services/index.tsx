import { Button } from '@/components/Button';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { DatePicker } from '@/components/DatePicker';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/Input';
import { PriceValue } from '@/components/PriceValue';
import { RecordCard } from '@/components/RecordCard';
import { SelectPicker } from '@/components/SelectPicker';
import { Text } from '@/components/AppText';
import { Colors } from '@/constants/theme';
import { useData } from '@/contexts/DataContext';
import { useTranslation } from '@/languages/useTranslation';
import { ServiceDto, ServiceType, serviceTypeOptions } from '@/types/interfaces';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { PlusIcon, WrenchIcon, XIcon } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useMediaQuery } from 'react-responsive';

export default function ServicesScreen() {
  const { t, isRTL } = useTranslation();
  const { services, addService, updateService, deleteService, stats } = useData();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isConfirmValidation, setIsConfirmValidation] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const [type, setType] = useState<ServiceType>('EngineOil');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [odometer, setOdometer] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [nextDueOdometer, setNextDueOdometer] = useState('');

  useEffect(() => {
    if (edit) {
      const service = services.find(s => s.id === edit);
      if (service) {
        openEditModal(service);
      }
    }
  }, [edit, services]);

  const handleValidationClose = () => {
    setIsConfirmValidation(false);
  };

  const handleDeleteConfirm = async () => {
    if (!editingId) return;
    await deleteService(editingId);
    setIsConfirmDelete(false);
    setModalVisible(false);
    resetForm();
  };

  const handleDeleteClose = () => {
    setIsConfirmDelete(false);
  };

  const resetForm = () => {
    setType('EngineOil');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setOdometer('');
    setCost('');
    setNotes('');
    setNextDueDate('');
    setNextDueOdometer('');
    setEditingId(null);
  };

  const openEditModal = (service: ServiceDto) => {
    setEditingId(service.id);
    setType(service.type);
    setDate(service.date);
    setOdometer(service.odometer?.toString());
    setCost(service.cost.toString());
    setNotes(service.notes);
    setNextDueDate(service.nextDueDate || '');
    setNextDueOdometer(service.nextDueOdometer?.toString() || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!odometer || !cost) {
      setIsConfirmValidation(true);
      return;
    }

    setSaving(true);
    try {
      const data = {
        type,
        date,
        odometer: parseInt(odometer),
        cost: parseFloat(cost),
        notes,
        nextDueDate: nextDueDate || undefined,
        nextDueOdometer: nextDueOdometer ? parseInt(nextDueOdometer) : undefined,
      };

      if (editingId) {
        await updateService(editingId, data);
      } else {
        await addService(data);
      }

      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.warn('Error saving service:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingId) return;

    setIsConfirmDelete(true);
  };

  const getServiceLabel = (serviceType: string) =>
    serviceTypeOptions(t).find(s => s.value === serviceType)?.label || '-';

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    services.forEach(e => {
      totals[e.type] = (totals[e.type] || 0) + e.cost;
    });
    return totals;
  }, [services]);

  //#region JSX
  return (
    <View style={[styles.wrapper, isRTL && { direction: 'rtl' }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        {stats.totalServiceCost > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{t('services.totalServiceCost')}</Text>
            <PriceValue
              value={stats.totalServiceCost.toFixed(2)}
              style={styles.summaryValue}
            />
            <View style={styles.categoryBreakdown}>
              {Object.entries(categoryTotals).map(([cat, total]) => (
                <View
                  key={cat}
                  style={styles.categoryItem}
                >
                  <View style={[styles.categoryDot, { backgroundColor: Colors.service }]} />
                  <Text style={styles.categoryName}>{getServiceLabel(cat)}</Text>
                  <PriceValue
                    value={total.toFixed(0)}
                    style={styles.categoryTotal}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {services.length === 0 ? (
          <EmptyState
            icon={WrenchIcon}
            title={t('services.noServicesYet')}
            subtitle={t('services.servicesDescription')}
          />
        ) : (
          services.map(service => {
            return (
              <RecordCard
                key={service.id}
                title={getServiceLabel(service.type)}
                date={service.date}
                amount={service.cost}
                subtitle={`${service.odometer} ${t('common.km')}`}
                icon={WrenchIcon}
                color={Colors.service}
                rtl={isRTL}
                onPress={() => openEditModal(service)}
              />
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[isRTL ? styles.fabContainerRTL : styles.fabContainer, isDesktop && styles.fabContainerDesktop]}>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
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
        visible={modalVisible}
        animationType='fade'
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? t('services.updateTitle') : t('services.createTitle')}</Text>
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
              <SelectPicker
                label={t('services.serviceType')}
                value={type}
                options={serviceTypeOptions(t)}
                onValueChange={value => setType(value as ServiceType)}
              />

              <DatePicker
                label={t('services.date')}
                value={date}
                onChange={setDate}
              />

              <Input
                label={t('services.odometer')}
                value={odometer}
                onChangeText={setOdometer}
                keyboardType='numeric'
                placeholder={t('services.odometerPlaceholder')}
              />

              <Input
                label={t('services.cost')}
                value={cost}
                onChangeText={setCost}
                keyboardType='decimal-pad'
                placeholder={t('services.costPlaceholder')}
              />

              <Input
                label={t('services.note')}
                value={notes}
                onChangeText={setNotes}
                placeholder={t('services.notePlaceholder')}
                multiline
                style={{ height: 80, textAlignVertical: 'top', paddingTop: 12 }}
              />

              <Text style={styles.sectionLabel}>{t('services.nextServiceDue')}</Text>

              <DatePicker
                label={t('services.nextDueDate')}
                value={nextDueDate}
                onChange={setNextDueDate}
                placeholder={t('services.nextDueDatePlaceholder')}
              />

              <Input
                label={t('services.nextDueOdometer')}
                value={nextDueOdometer}
                onChangeText={setNextDueOdometer}
                keyboardType='numeric'
                placeholder={t('services.nextDueOdometerPlaceholder')}
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
                  title={editingId ? t('common.save') : t('common.save')}
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
        message={t('services.confirmValidation')}
      />

      <ConfirmationDialog
        visible={isConfirmDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteClose}
        message={t('services.confirmDelete')}
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
    backgroundColor: Colors.service,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
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
  sectionLabel: {
    fontSize: 16,
    fontWeight: 600,
    color: Colors.text,
    marginTop: 8,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 700,
    color: Colors.text,
    marginTop: 4,
  },
  categoryBreakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginEnd: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  categoryTotal: {
    fontSize: 14,
    fontWeight: 600,
    color: Colors.text,
  },
});
