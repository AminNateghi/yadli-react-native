import { Text } from '@/components/Text';
import { Colors } from '@/constants/theme';
import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { PriceValue } from './PriceValue';

interface RecordCardProps {
  title: string;
  date: string;
  amount: number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  rtl: boolean;
  onPress?: () => void;
}

export function RecordCard({ title, date, amount, subtitle, icon: Icon, color, rtl, onPress }: RecordCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + 15 }]}>
        <Icon
          size={20}
          color={color}
        />
      </View>
      <View style={[styles.content]}>
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text style={styles.date}>
          {format(new Date(date), 'MMM d, yyyy')}
          {subtitle && ` • ${subtitle}`}
        </Text>
      </View>
      <View style={styles.rightContent}>
        <PriceValue
          value={amount.toString()}
          style={styles.amount}
        />
        {rtl ? (
          <ChevronLeftIcon
            size={18}
            color={Colors.textMuted}
          />
        ) : (
          <ChevronRightIcon
            size={18}
            color={Colors.textMuted}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginStart: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: 600,
    color: Colors.text,
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  amount: {
    fontSize: 15,
    fontWeight: 600,
    color: Colors.text,
  },
});
