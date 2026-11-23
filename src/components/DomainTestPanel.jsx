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
      email: 'john@hbplus.fit',
      name: 'John Doe',
      role: 'user',
      expected: 'Access Granted (Dashboard)',
      type: 'authorized',
    },
    {
      label: 'Authorized Administrator',
      email: 'sarah.admin@hbplus.fit',
      name: 'Sarah Connor',
      role: 'admin',
      expected: 'Access Granted (Admin Dashboard)',
      type: 'authorized',
    },
    {
      label: 'Unauthorized Public Email',
      email: 'john@gmail.com',
      name: 'John Outsider',
      role: 'user',
      expected: 'Access Denied (Access Restricted)',
      type: 'denied',
    },
    {
      label: 'Spoofed Lookalike Email',
      email: 'hbplus.fit@gmail.com',
      name: 'Lookalike Attacker',
      role: 'user',
      expected: 'Access Denied (Rejected)',
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
                  <View style={[styles.badge, isAuth ? styles.badgeAuth : styles.badgeDenied]}>
                    <Text style={[styles.badgeText, isAuth ? styles.badgeAuthText : styles.badgeDeniedText]}>
                      {isAuth ? 'ALLOW' : 'BLOCK'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.itemEmail}>{item.email}</Text>
                <Text style={styles.itemExpected}>Result: {item.expected}</Text>
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
    color: colors.textSecondary,
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
        transition: 'all 0.1s ease-in-out',
      },
    }),
  },
  itemAuth: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  itemDenied: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
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
