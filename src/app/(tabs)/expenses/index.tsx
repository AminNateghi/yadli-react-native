import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { PlusIcon, ReceiptIcon, XIcon } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/components/Button";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { DatePicker } from "@/components/DatePicker";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/Input";
import { PriceValue } from "@/components/PriceValue";
import { RecordCard } from "@/components/RecordCard";
import { SelectPicker } from "@/components/SelectPicker";
import { Text } from "@/components/Text";
import { Colors } from "@/constants/theme";
import { useTranslation } from "@/languages/useTranslation";
import {
  ExpenseDto,
  ExpenseType,
  expenseTypeOptions,
} from "@/types/interfaces";

export default function ExpensesScreen() {
  // const { t, isRTL } = useTranslation();
  // const { expenses, addExpense, updateExpense, deleteExpense, stats } = useData();
  // const { edit } = useLocalSearchParams<{ edit?: string }>();
  // const isDesktop = useMediaQuery({ minWidth: 768 });

  // const [modalVisible, setModalVisible] = useState(false);
  // const [editingId, setEditingId] = useState<string | null>(null);
  // const [saving, setSaving] = useState(false);
  // const [isConfirmValidation, setIsConfirmValidation] = useState(false);
  // const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  // const [type, setType] = useState<ExpenseType>('Fine');
  // const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  // const [amount, setAmount] = useState('');
  // const [description, setDescription] = useState('');
  // const [odometer, setOdometer] = useState('');

  // useEffect(() => {
  //   if (edit) {
  //     const expense = expenses.find(e => e.id === edit);
  //     if (expense) {
  //       openEditModal(expense);
  //     }
  //   }
  // }, [edit, expenses]);

  // const handleValidationClose = () => {
  //   setIsConfirmValidation(false);
  // };

  // const handleDeleteConfirm = async () => {
  //   if (!editingId) return;
  //   await deleteExpense(editingId);
  //   setIsConfirmDelete(false);
  //   setModalVisible(false);
  //   resetForm();
  // };

  // const handleDeleteClose = () => {
  //   setIsConfirmDelete(false);
  // };

  // const resetForm = () => {
  //   setType('Fine');
  //   setDate(format(new Date(), 'yyyy-MM-dd'));
  //   setAmount('');
  //   setDescription('');
  //   setOdometer('');
  //   setEditingId(null);
  // };

  // const openEditModal = (expense: ExpenseDto) => {
  //   setEditingId(expense.id);
  //   setType(expense.type);
  //   setDate(expense.date);
  //   setAmount(expense.amount.toString());
  //   setDescription(expense.description);
  //   setOdometer(expense.odometer?.toString() || '');
  //   setModalVisible(true);
  // };

  // const handleSave = async () => {
  //   if (!amount || !description) {
  //     setIsConfirmValidation(true);
  //     return;
  //   }

  //   setSaving(true);
  //   try {
  //     const data = {
  //       type,
  //       date,
  //       amount: Number(amount),
  //       description,
  //       odometer: odometer ? Number(odometer) : undefined,
  //     };

  //     if (editingId) {
  //       await updateExpense(editingId, data);
  //     } else {
  //       await addExpense(data);
  //     }

  //     setModalVisible(false);
  //     resetForm();
  //   } catch (error) {
  //     console.warn('Error saving expense:', error);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // const handleDelete = async () => {
  //   if (!editingId) return;

  //   setIsConfirmDelete(true);
  // };

  // const getExpenseLabel = (cat: string) => expenseTypeOptions(t).find(c => c.value === cat)?.label || cat;

  // const categoryTotals = useMemo(() => {
  //   const totals: Record<string, number> = {};
  //   expenses.forEach(e => {
  //     totals[e.type] = (totals[e.type] || 0) + e.amount;
  //   });
  //   return totals;
  // }, [expenses]);

  // return (
  //   <View style={[styles.wrapper, isRTL && { direction: 'rtl' }]}>
  //     <ScrollView
  //       style={styles.container}
  //       contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
  //       showsVerticalScrollIndicator={false}
  //     >
  //       {stats.totalExpenses > 0 && (
  //         <View style={styles.summaryCard}>
  //           <Text style={styles.summaryTitle}>{t('expenses.totalExpenses')}</Text>
  //           <PriceValue
  //             value={stats.totalExpenses.toFixed(2)}
  //             style={styles.summaryValue}
  //           />
  //           <View style={styles.categoryBreakdown}>
  //             {Object.entries(categoryTotals).map(([cat, total]) => (
  //               <View
  //                 key={cat}
  //                 style={styles.categoryItem}
  //               >
  //                 <View style={[styles.categoryDot, { backgroundColor: Colors.expense }]} />
  //                 <Text style={styles.categoryName}>{getExpenseLabel(cat)}</Text>
  //                 <PriceValue
  //                   value={total.toFixed(0)}
  //                   style={styles.categoryTotal}
  //                 />
  //               </View>
  //             ))}
  //           </View>
  //         </View>
  //       )}

  //       {expenses.length === 0 ? (
  //         <EmptyState
  //           icon={ReceiptIcon}
  //           title={t('expenses.noExpenseYet')}
  //           subtitle={t('expenses.expensesDescription')}
  //         />
  //       ) : (
  //         expenses.map(expense => {
  //           return (
  //             <RecordCard
  //               key={expense.id}
  //               title={expense.description}
  //               date={expense.date}
  //               amount={expense.amount}
  //               subtitle={getExpenseLabel(expense.type)}
  //               icon={ReceiptIcon}
  //               color={Colors.expense}
  //               rtl={isRTL}
  //               onPress={() => openEditModal(expense)}
  //             />
  //           );
  //         })
  //       )}
  //       <View style={{ height: 100 }} />
  //     </ScrollView>

  //     <View style={[styles.fabContainer, isDesktop && styles.fabContainerDesktop]}>
  //       <Pressable
  //         style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
  //         onPress={() => {
  //           resetForm();
  //           setModalVisible(true);
  //         }}
  //       >
  //         <PlusIcon
  //           size={24}
  //           color='#FFFFFF'
  //         />
  //       </Pressable>
  //     </View>

  //     <Modal
  //       visible={modalVisible}
  //       animationType='fade'
  //       transparent
  //     >
  //       <View style={styles.modalOverlay}>
  //         <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}>
  //           <View style={styles.modalHeader}>
  //             <Text style={styles.modalTitle}>{editingId ? t('expenses.updateTitle') : t('expenses.createTitle')}</Text>
  //             <Pressable onPress={() => setModalVisible(false)}>
  //               <XIcon
  //                 size={24}
  //                 color={Colors.text}
  //               />
  //             </Pressable>
  //           </View>

  //           <ScrollView
  //             style={styles.modalScroll}
  //             showsVerticalScrollIndicator={false}
  //           >
  //             <SelectPicker
  //               label={t('expenses.category')}
  //               value={type}
  //               options={expenseTypeOptions(t)}
  //               onValueChange={value => setType(value as ExpenseType)}
  //             />

  //             <DatePicker
  //               label={t('expenses.date')}
  //               value={date}
  //               onChange={setDate}
  //             />

  //             <Input
  //               label={t('expenses.amount')}
  //               value={amount}
  //               onChangeText={setAmount}
  //               keyboardType='decimal-pad'
  //               placeholder={t('expenses.amountPlaceholder')}
  //             />

  //             <Input
  //               label={t('expenses.notes')}
  //               value={description}
  //               onChangeText={setDescription}
  //               placeholder={t('expenses.notesPlaceholder')}
  //             />

  //             <Input
  //               label={t('expenses.odometer')}
  //               value={odometer}
  //               onChangeText={setOdometer}
  //               keyboardType='numeric'
  //               placeholder={t('expenses.odometerPlaceholder')}
  //             />

  //             <View style={styles.buttonRow}>
  //               {editingId && (
  //                 <Button
  //                   title={t('common.delete')}
  //                   variant='danger'
  //                   onPress={handleDelete}
  //                   style={{ flex: 1 }}
  //                 />
  //               )}
  //               <Button
  //                 title={editingId ? t('common.update') : t('common.save')}
  //                 onPress={handleSave}
  //                 loading={saving}
  //                 style={{ flex: 1 }}
  //               />
  //             </View>

  //             <View style={{ height: 40 }} />
  //           </ScrollView>
  //         </View>
  //       </View>
  //     </Modal>

  //     <ConfirmationDialog
  //       visible={isConfirmValidation}
  //       onConfirm={handleValidationClose}
  //       onCancel={handleValidationClose}
  //       type='Ok'
  //       message={t('expenses.confirmValidation')}
  //     />

  //     <ConfirmationDialog
  //       visible={isConfirmDelete}
  //       onConfirm={handleDeleteConfirm}
  //       onCancel={handleDeleteClose}
  //       message={t('expenses.confirmDelete')}
  //     />
  //   </View>
  // );
  return <Text>expense</Text>;
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
    alignSelf: "center",
    width: "100%",
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
    flexDirection: "row",
    alignItems: "center",
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
  fabContainer: {
    position: "absolute",
    right: 16,
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
    backgroundColor: Colors.expense,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalContentDesktop: {
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
    borderRadius: 24,
    marginBottom: 40,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },
});
