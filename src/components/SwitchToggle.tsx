import { Text } from '@/components/Text';
import { Colors } from '@/constants/theme';
import { StyleSheet, Switch, View } from 'react-native';

interface SwitchToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
}

export function SwitchToggle({ label, value, onValueChange, description }: SwitchToggleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
        thumbColor={value ? Colors.primary : Colors.surface}
        ios_backgroundColor={Colors.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: Colors.text,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
