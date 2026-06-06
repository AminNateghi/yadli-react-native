import { Colors } from '@/constants/theme';
import { useAppFontFamily } from '@/hooks/useAppFontFamily';
import { useTranslation } from '@/languages/useTranslation';
import { Tabs } from 'expo-router';
import { FuelIcon, LayoutDashboardIcon, ReceiptIcon, WrenchIcon } from 'lucide-react-native';

export default function TabLayout() {
  const { t, isRTL } = useTranslation();
  const fontFamily = useAppFontFamily();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderLight,
          paddingTop: 0,
          marginBottom: 0,
          height: 60,
          direction: isRTL ? 'rtl' : 'ltr',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 500,
          ...(fontFamily ? { fontFamily } : {}),
        },
      }}
    >
      <Tabs.Screen
        name='(home)'
        options={{
          title: t('menus.dashboard'),
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboardIcon
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='fuel'
        options={{
          title: t('menus.fuel'),
          tabBarIcon: ({ color, size }) => (
            <FuelIcon
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='services'
        options={{
          title: t('menus.services'),
          tabBarIcon: ({ color, size }) => (
            <WrenchIcon
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='expenses'
        options={{
          title: t('menus.expenses'),
          tabBarIcon: ({ color, size }) => (
            <ReceiptIcon
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
