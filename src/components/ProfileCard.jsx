/**
 * Profile Card Component
 * Displays authenticated user profile, email verification, domain status, and session details.
 */

import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileCard({ user, role }) {
  if (!user) return null;

  const isAdmin = role === 'admin';
  const formattedLastLogin = user.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString()
    : 'Active now';

  return (
    <View style={styles.card}>
      {/* Header with Avatar and Basic Info */}
      <View style={styles.userHeader}>
        <View style={styles.avatarWrapper}>
          {user.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.avatar}
              accessibilityLabel={`${user.displayName || 'User'} profile avatar`}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{user.displayName || 'HBPLUS Employee'}</Text>
            <View style={[styles.roleTag, isAdmin ? styles.roleAdmin : styles.roleUser]}>
              <Text style={[styles.roleText, isAdmin ? styles.roleAdminText : styles.roleUserText]}>
                {isAdmin ? 'Admin' : 'Employee'}
              </Text>
            </View>
          </View>
          <Text style={styles.emailText}>{user.email}</Text>
          <View style={styles.statusRow}>
            <View style={styles.activeDot} />
            <Text style={styles.statusText}>Authorized Session</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Security & Verification Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Email Domain</Text>
          <View style={styles.domainBadge}>
            <Ionicons name="shield-checkmark" size={14} color={colors.success} style={{ marginRight: 4 }} />
            <Text style={styles.domainText}>@hbplus.fit (Verified)</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Authentication Provider</Text>
          <View style={styles.providerBadge}>
            <Text style={styles.providerText}>Google OAuth 2.0</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Last Login</Text>
          <Text style={styles.detailValue}>{formattedLastLogin}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Account UID</Text>
          <Text style={styles.uidText} numberOfLines={1} ellipsizeMode="middle">
            {user.uid}
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
    borderColor: colors.border,
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
      },
      default: {
        ...shadows.md,
      },
    }),
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.backgroundAlt,
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.success,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  displayName: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  roleAdmin: {
    backgroundColor: '#FEF3C7',
  },
  roleUser: {
    backgroundColor: colors.accentLight,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  roleAdminText: {
    color: '#92400E',
  },
  roleUserText: {
    color: colors.accent,
  },
  emailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.successText,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  domainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.successBg,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  domainText: {
    color: colors.successText,
    fontSize: 12,
    fontWeight: '600',
  },
  providerBadge: {
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  providerText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  uidText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.textSecondary,
  },
});
