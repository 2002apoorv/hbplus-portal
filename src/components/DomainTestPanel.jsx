/**
 * Domain Test Panel Component
 * Provides immediate one-click testing of domain authorization scenarios
 * (Authorized @hbplus.fit, Unauthorized @gmail.com, Unauthorized lookalikes).
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function DomainTestPanel({ onSelectScenario, loading }) {
  const scenarios = [
    {
      label: 'Authorized Employee',
      email: 'example@hbplus.fit',
      name: 'John Doe',
      role: 'user',
      type: 'authorized',
    },
    {
      label: 'Unauthorized Public Email',
      email: 'example@gmail.com',
      name: 'John Outsider',
      role: 'user',
      type: 'denied',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="flask-outline" size={16} color={colors.accent} style={{ marginRight: 6 }} />
        <Text style={styles.title}>Fast Domain Scenario Tester</Text>
      </View>
      <Text style={styles.caption}>
        Click any scenario below to verify instant client & domain validation:
      </Text>

      <View style={styles.list}>
        {scenarios.map((item, idx) => {
          const isAuth = item.type === 'authorized';
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.itemButton, isAuth ? styles.itemAuth : styles.itemDenied]}
              onPress={() => onSelectScenario(item.email, item.name, item.role)}
              disabled={loading}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <View style={styles.itemContent}>
                <View style={styles.topRow}>
                  <Text style={styles.itemLabel}>{item.label}</Text>

                </View>
                <Text style={styles.itemEmail}>{item.email}</Text>

              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  caption: {
    fontSize: 12,
    color: "#222222f0",
    marginBottom: spacing.sm,
  },
  list: {
    gap: 8,
  },
  itemButton: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        backdropFilter: 'blur(8px)',
      },
    }),
  },
  itemAuth: {
    backgroundColor: 'rgba(240, 253, 244, 0.3)',
    borderColor: 'rgba(187, 247, 208, 0.65)',
  },
  itemDenied: {
    backgroundColor: 'rgba(254, 242, 242, 0.3)',
    borderColor: 'rgba(254, 202, 202, 0.65)',
  },
  itemContent: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeAuth: {
    backgroundColor: colors.success,
  },
  badgeDenied: {
    backgroundColor: colors.danger,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  badgeAuthText: {
    color: '#FFFFFF',
  },
  badgeDeniedText: {
    color: '#FFFFFF',
  },
  itemEmail: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  itemExpected: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
