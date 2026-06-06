import { SettingsModal } from '@/components/SettingsModal';
import { Colors } from '@/constants/theme';
import { useAppFontFamily } from '@/hooks/useAppFontFamily';
import { useTranslation } from '@/languages/useTranslation';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  const { t, isRTL } = useTranslation();
  const fontFamily = useAppFontFamily();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerShadowVisible: false,
        headerTintColor: Colors.text,
        contentStyle: { backgroundColor: Colors.background },
        headerTitleStyle: { ...(fontFamily ? { fontFamily } : {}) },
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: t('menus.dashboard'),
          headerTitleAlign: 'center',
          headerLargeTitle: true,
          headerLeft: () => (isRTL ? <></> : <SettingsModal />),
          headerRight: () => (isRTL ? <SettingsModal /> : <></>),
        }}
      />
    </Stack>
  );
}
