
import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { WidgetProvider } from '@/contexts/WidgetContext';
import { GameStateProvider } from '@/contexts/GameStateContext';
import { useFonts } from 'expo-font';
import { SystemBars } from 'react-native-edge-to-edge';
import 'react-native-reanimated';
import { useColorScheme, Alert } from 'react-native';
import { useNetworkState } from 'expo-network';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const networkState = useNetworkState();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <WidgetProvider>
          <GameStateProvider>
            <SystemBars style="auto" />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen
                name="transparent-modal"
                options={{
                  presentation: 'transparentModal',
                  animation: 'fade',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="formsheet"
                options={{
                  presentation: 'formSheet',
                  sheetAllowedDetents: [0.5, 1],
                  sheetLargestUndimmedDetent: 0.5,
                  sheetGrabberVisible: true,
                }}
              />
            </Stack>
            <StatusBar style="auto" />
          </GameStateProvider>
        </WidgetProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
