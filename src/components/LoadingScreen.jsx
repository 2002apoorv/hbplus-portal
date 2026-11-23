/**
 * Full-screen Loading Component
 * Displays a clean enterprise spinner during session recovery and routing.
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/theme';

export default function LoadingScreen({ message = 'Verifying authorization session...' }) {
  return (
    <View style={styles.container}>
      <View style={styles.brandBadge}>
        <Text style={styles.brandTitle}>HBPLUS</Text>
      </View>
      <ActivityIndicator size="large" color={colors.accent} style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subtext}>Employee Identity & Access Gateway</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  brandBadge: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  spinner: {
    marginVertical: spacing.md,
  },
  message: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  subtext: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
});
