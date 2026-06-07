import { DataProvider } from '@/contexts/DataContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const [loaded] = useFonts({
    VazirRegular: require('@/assets/fonts/Vazirmatn-Regular.ttf'),
    VazirBold: require('@/assets/fonts/Vazirmatn-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider style={{ marginTop: 1, marginBottom: insets.bottom }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <DataProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style='auto' />
        </DataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
