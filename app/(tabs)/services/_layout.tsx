import { Colors } from '@/constants/theme';
import { useAppFontFamily } from '@/hooks/useAppFontFamily';
import { useTranslation } from '@/languages/useTranslation';
import { Stack } from 'expo-router';

export default function ServicesLayout() {
  const { t } = useTranslation();
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
        options={{ title: t('menus.services'), headerLargeTitle: true, headerTitleAlign: 'center' }}
      />
    </Stack>
  );
}
