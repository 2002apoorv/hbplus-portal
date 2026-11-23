/**
 * Dashboard Screen - HBPLUS Employee Portal
 * Displays authenticated user profile, email verification, domain status,
 * role-based administrative section (for Admin role), and session management.
 */

import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Platform, 
  useWindowDimensions, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import AppHeader from '../src/components/AppHeader';
import ProfileCard from '../src/components/ProfileCard';
import AdminPanel from '../src/components/AdminPanel';
import LoadingScreen from '../src/components/LoadingScreen';
import { colors, spacing, borderRadius, shadows } from '../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { AUTHORIZED_DOMAIN_SUFFIX } from '../src/utils/validateDomain';

export default function DashboardScreen() {
  const { user, role, loading, authActionLoading, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  if (loading) {
    return <LoadingScreen message="Restoring session..." />;
  }

  // Session guard: unauthenticated users cannot access dashboard
  if (!user) {
    return <Redirect href="/login" />;
  }

  const isAdmin = role === 'admin';
  const firstName = user.displayName ? user.displayName.split(' ')[0] : 'Employee';

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        user={user}
        role={role}
        onLogout={logout}
        loading={authActionLoading}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isDesktop && styles.scrollContainerDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          
          {/* Welcome Banner */}
          <View style={styles.welcomeBanner}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.welcomeSubtitle}>HBPLUS EMPLOYEE PORTAL</Text>
              <Text style={styles.welcomeTitle}>
                Welcome back, {firstName}
              </Text>
              <Text style={styles.welcomeDescription}>
                You are securely signed in using your corporate Google account ({user.email}).
              </Text>
            </View>

            <View style={styles.domainConfirmedBadge}>
              <Ionicons name="shield-checkmark" size={16} color={colors.success} style={{ marginRight: 6 }} />
              <Text style={styles.domainConfirmedText}>
                {AUTHORIZED_DOMAIN_SUFFIX} Authorized
              </Text>
            </View>
          </View>

          {/* User Profile Card */}
          <ProfileCard user={user} role={role} />

          {/* Role-Based Section: If Admin, show Administrator Panel */}
          {isAdmin ? (
            <AdminPanel />
          ) : (
            /* Regular Employee Information Card */
            <View style={styles.employeeCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="briefcase-outline" size={18} color={colors.primaryLight} style={{ marginRight: 8 }} />
                <Text style={styles.cardTitle}>Employee Workspace Access</Text>
              </View>
              <Text style={styles.cardText}>
                Your corporate account has standard employee access rights. You can use single sign-on (SSO) with your <Text style={styles.bold}>{AUTHORIZED_DOMAIN_SUFFIX}</Text> credentials to access all connected internal services.
              </Text>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-done" size={16} color={colors.success} style={{ marginRight: 8 }} />
                  <Text style={styles.featureText}>Google OAuth 2.0 Corporate Identity Active</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-done" size={16} color={colors.success} style={{ marginRight: 8 }} />
                  <Text style={styles.featureText}>Strict Domain Policy Applied (@hbplus.fit)</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-done" size={16} color={colors.success} style={{ marginRight: 8 }} />
                  <Text style={styles.featureText}>Protected Firestore User Document Synchronized</Text>
                </View>
              </View>
            </View>
          )}

          {/* Explicit Sign Out Button in Dashboard Body */}
          <View style={styles.logoutSection}>
            <TouchableOpacity
              style={styles.fullLogoutButton}
              onPress={logout}
              disabled={authActionLoading}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Sign Out of HBPLUS Portal"
            >
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.fullLogoutButtonText}>
                {authActionLoading ? 'Signing out...' : 'Sign Out of HBPLUS Portal'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  scrollContainerDesktop: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  contentWrapper: {
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  welcomeBanner: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: spacing.sm,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(10, 25, 47, 0.15)',
      },
      default: {
        ...shadows.md,
      },
    }),
  },
  bannerTextContainer: {
    flex: 1,
    minWidth: 260,
  },
  welcomeSubtitle: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  welcomeDescription: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
  },
  domainConfirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 150, 105, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.4)',
    borderRadius: borderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  domainConfirmedText: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '700',
  },
  employeeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
      },
      default: {
        ...shadows.sm,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 4,
  },
  bold: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  featuresList: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  logoutSection: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  fullLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    maxWidth: 320,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(220, 38, 38, 0.2)',
      },
      default: {
        ...shadows.sm,
      },
    }),
  },
  fullLogoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
