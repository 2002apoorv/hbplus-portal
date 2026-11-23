/**
 * Admin Panel Component
 * Visible only to authenticated users with the "admin" role.
 * Displays domain management policies, security audit metrics, and access rules.
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { AUTHORIZED_DOMAIN_SUFFIX } from '../utils/validateDomain';

export default function AdminPanel() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Ionicons name="shield-half-outline" size={16} color="#92400E" style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>ADMINISTRATOR CONTROL SECTION</Text>
        </View>
        <Text style={styles.title}>Corporate Domain & Security Governance</Text>
        <Text style={styles.subtitle}>
          Administrative overview for HBPLUS organization access policies and identity provider rules.
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>1</Text>
          <Text style={styles.metricLabel}>Authorized Domain</Text>
          <Text style={styles.metricSub}>{AUTHORIZED_DOMAIN_SUFFIX}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>100%</Text>
          <Text style={styles.metricLabel}>Email Verification</Text>
          <Text style={styles.metricSub}>Strict Enforcement</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>RBAC</Text>
          <Text style={styles.metricLabel}>Role Assignment</Text>
          <Text style={styles.metricSub}>Admin / Employee</Text>
        </View>
      </View>

      <View style={styles.rulesBox}>
        <Text style={styles.rulesHeading}>Active Security Invariants</Text>

        <View style={styles.ruleItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} style={styles.ruleIcon} />
          <Text style={styles.ruleText}>
            <Text style={styles.ruleBold}>Client Validation:</Text> All authentication callbacks verify regex ending with <Text style={styles.codeText}>@hbplus.fit</Text>.
          </Text>
        </View>

        <View style={styles.ruleItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} style={styles.ruleIcon} />
          <Text style={styles.ruleText}>
            <Text style={styles.ruleBold}>Firebase Immediate Revocation:</Text> Any non-matching token session is signed out instantly without creating a database profile.
          </Text>
        </View>

        <View style={styles.ruleItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} style={styles.ruleIcon} />
          <Text style={styles.ruleText}>
            <Text style={styles.ruleBold}>Cloud Firestore Rules:</Text> Document reads & writes enforce <Text style={styles.codeText}>request.auth.token.email.matches('.*@hbplus\\.fit$')</Text>.
          </Text>
        </View>

        <View style={styles.ruleItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} style={styles.ruleIcon} />
          <Text style={styles.ruleText}>
            <Text style={styles.ruleBold}>Profile Immutability:</Text> Standard users cannot modify or escalate their own role permissions.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.08)',
      },
      default: {
        ...shadows.md,
      },
    }),
  },
  header: {
    marginBottom: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  badgeText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: spacing.sm,
    flexWrap: 'wrap',
  },
  metricCard: {
    flex: 1,
    minWidth: 130,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricSub: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  rulesBox: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  rulesHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  ruleText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  ruleBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.primaryDark,
    backgroundColor: '#E2E8F0',
    fontSize: 12,
  },
});
