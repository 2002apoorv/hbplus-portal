/**
 * Application Header Component
 * Corporate navbar with HBPLUS branding, active user info, and logout action.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AppHeader({ user, role, onLogout, loading }) {
  const { width } = useWindowDimensions();
  const isAdmin = role === 'admin';
  const isSmallScreen = width < 600;
  const isVerySmall = width < 380;

  return (
    <View style={[styles.header, isVerySmall && styles.headerCompact]}>
      <View style={styles.innerContainer}>
        {/* Brand mark */}
        <View style={styles.brandContainer}>
          <View style={[styles.logoMark, isVerySmall && styles.logoMarkCompact]}>
            <Text style={[styles.logoText, isVerySmall && styles.logoTextCompact]}>HB+</Text>
          </View>
          <View>
            <Text style={[styles.brandTitle, isVerySmall && styles.brandTitleCompact]}>HBPLUS</Text>
            <Text style={[styles.brandSubtitle, isVerySmall && styles.brandSubtitleCompact]}>
              {isVerySmall ? 'Portal' : 'Employee Portal'}
            </Text>
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
              {/* Only show email in header on wider screens to prevent header crowding */}
              {!isSmallScreen && (
                <Text style={styles.userEmail} numberOfLines={1} ellipsizeMode="tail">
                  {user.email}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.logoutButton, isVerySmall && styles.logoutButtonCompact]}
              onPress={onLogout}
              disabled={loading}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              <Ionicons
                name="log-out-outline"
                size={isVerySmall ? 16 : 18}
                color={colors.danger}
                style={!isVerySmall && styles.logoutIcon}
              />
              {!isVerySmall && <Text style={styles.logoutText}>Sign Out</Text>}
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
    paddingVertical: 10,
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
  headerCompact: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  innerContainer: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  logoMark: {
    backgroundColor: '#2d2adbff',
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoMarkCompact: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 6,
  },
  logoText: {
    color: '#0A192F',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logoTextCompact: {
    fontSize: 12,
  },
  brandTitle: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  brandTitleCompact: {
    fontSize: 13,
    letterSpacing: 0.8,
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '500',
    marginTop: -2,
  },
  brandSubtitleCompact: {
    fontSize: 9,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    justifyContent: 'flex-end',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  roleBadge: {
    paddingHorizontal: 7,
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
    fontSize: 10,
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
    fontSize: 12,
    fontWeight: '500',
    maxWidth: 160,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  logoutButtonCompact: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  logoutIcon: {
    marginRight: 4,
  },
  logoutText: {
    color: colors.dangerText,
    fontSize: 12,
    fontWeight: '600',
  },
});
