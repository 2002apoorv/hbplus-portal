/**
 * Root Index Route
 * Directs traffic dynamically based on authentication state.
 */

import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import LoadingScreen from '../src/components/LoadingScreen';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Loading HBPLUS Portal..." />;
  }

  if (user) {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/login" />;
}
