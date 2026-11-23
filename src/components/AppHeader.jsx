/**
 * Application Header Component
 * Corporate navbar with HBPLUS branding, active user info, and logout action.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AppHeader({ user, role, onLogout, loading }) {
  const isAdmin = role === 'admin';

  return (
    <View style={styles.header}>
      <View style={styles.innerContainer}>
        {/* Brand mark */}
        <View style={styles.brandContainer}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>HB+</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>HBPLUS</Text>
            <Text style={styles.brandSubtitle}>Employee Portal</Text>
          </View>
        </View>

        {/* Right Actions */}
        {user && (
          <View style={styles.actionsContainer}>
            <View style={styles.badgeRow}>
              <View style={[styles.roleBadge, isAdmin ? styles.adminBadge : styles.userBadge]}>
                <Text style={[styles.roleBadgeText, isAdmin ? styles.adminBadgeText : styles.userBadgeText]}>
                  {isAdmin ? 'ADMIN' : 'EMPLOYEE'}
                </Text>
              </View>
              {Platform.OS === 'web' && (
                <Text style={styles.userEmail} numberOfLines={1}>
                  {user.email}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={onLogout}
              disabled={loading}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              <Ionicons name="log-out-outline" size={18} color={colors.danger} style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  innerContainer: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMark: {
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandTitle: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: -2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  userBadge: {
    backgroundColor: colors.accentLight,
  },
  adminBadge: {
    backgroundColor: '#FEF3C7',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  userBadgeText: {
    color: colors.accent,
  },
  adminBadgeText: {
    color: '#92400E',
  },
  userEmail: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    maxWidth: 180,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.sm,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  logoutIcon: {
    marginRight: 4,
  },
  logoutText: {
    color: colors.dangerText,
    fontSize: 13,
    fontWeight: '600',
  },
});
