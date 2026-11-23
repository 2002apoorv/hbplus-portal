/**
 * Access Denied State Component
 * Displayed when a user logs in with an unauthorized email address (e.g. @gmail.com).
 * Includes clear messaging and an action to try another account.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { AUTHORIZED_DOMAIN_SUFFIX } from '../utils/validateDomain';

export default function AccessDeniedCard({ unauthorizedEmail, onTryAnother }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="shield-outline" size={32} color={colors.danger} />
      </View>

      <Text style={styles.heading}>Access Restricted</Text>
      
      <Text style={styles.message}>
        Access restricted. Please login using your official domain email.
      </Text>

      {unauthorizedEmail && (
        <View style={styles.attemptBox}>
          <Text style={styles.attemptLabel}>Attempted Account:</Text>
          <Text style={styles.attemptEmail}>{unauthorizedEmail}</Text>
          <View style={styles.deniedTag}>
            <Text style={styles.deniedTagText}>Unauthorized Domain</Text>
          </View>
        </View>
      )}

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={16} color={colors.infoText} style={styles.infoIcon} />
        <Text style={styles.infoText}>
          Only accounts ending strictly in <Text style={styles.boldDomain}>{AUTHORIZED_DOMAIN_SUFFIX}</Text> are authorized to access the HBPLUS Employee Portal.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={onTryAnother}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Try another account"
      >
        <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.retryButtonText}>Try Another Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    width: '100%',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(220, 38, 38, 0.08)',
      },
      default: {
        ...shadows.md,
      },
    }),
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dangerText,
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  attemptBox: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  attemptLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  attemptEmail: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  deniedTag: {
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deniedTagText: {
    color: colors.dangerText,
    fontSize: 11,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.infoBg,
    borderColor: colors.infoBorder,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    width: '100%',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.infoText,
    lineHeight: 18,
  },
  boldDomain: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
