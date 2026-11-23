/**
 * Root Layout with Authentication Provider and Session Protection
 * Expo Router root layout.
 */

import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import LoadingScreen from '../src/components/LoadingScreen';

function RootNavigationGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'dashboard';

    if (!user && inAuthGroup) {
      // Redirect unauthenticated user to login screen
      router.replace('/login');
    } else if (user && segments[0] === 'login') {
      // Redirect authenticated & authorized user to dashboard
      router.replace('/dashboard');
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return <LoadingScreen message="Checking authorization status..." />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigationGuard />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
