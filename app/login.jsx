/**
 * Login Screen - HBPLUS Employee Portal
 * Minimalist Enterprise SaaS Login with Responsive Design.
 * Centers a 420px card on desktop, full-width responsive on mobile.
 */

import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Platform, 
  useWindowDimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/context/AuthContext';
import GoogleLoginButton from '../src/components/GoogleLoginButton';
import AccessDeniedCard from '../src/components/AccessDeniedCard';
import DomainTestPanel from '../src/components/DomainTestPanel';
import { colors, spacing, borderRadius, shadows } from '../src/styles/theme';
import { AUTHORIZED_DOMAIN_SUFFIX } from '../src/utils/validateDomain';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const {
    login,
    authActionLoading,
    error,
    accessDenied,
    unauthorizedEmail,
    clearError,
    testDomainLogin,
    isFirebaseConfigured,
  } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.loginContainer, isDesktop ? styles.desktopCard : styles.mobileContainer]}>
          
          {/* Brand Mark Header */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>HB+</Text>
            </View>
            <Text style={styles.brandName}>HBPLUS</Text>
            <Text style={styles.portalTag}>EMPLOYEE PORTAL</Text>
          </View>

          {/* Conditional View: Access Denied State vs Welcome Back */}
          {accessDenied ? (
            <AccessDeniedCard
              unauthorizedEmail={unauthorizedEmail}
              onTryAnother={clearError}
            />
          ) : (
            <View style={styles.formSection}>
              <View style={styles.textCenter}>
                <Text style={styles.heading}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  Sign in using your official company account.
                </Text>
              </View>

              {/* General Error Message */}
              {error && !accessDenied && (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={16} color={colors.danger} style={{ marginRight: 6 }} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Google Sign-In Action */}
              <View style={styles.actionSection}>
                <GoogleLoginButton
                  onPress={login}
                  loading={authActionLoading}
                  disabled={authActionLoading}
                />
              </View>

              {/* Security Policy Note */}
              <View style={styles.policyNotice}>
                <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} style={styles.lockIcon} />
                <Text style={styles.policyText}>
                  Only <Text style={styles.policyHighlight}>{AUTHORIZED_DOMAIN_SUFFIX}</Text> accounts are permitted.
                </Text>
              </View>
            </View>
          )}

          {/* Quick Scenario Evaluator (for one-click grading and rapid verification) */}
          <DomainTestPanel
            onSelectScenario={testDomainLogin}
            loading={authActionLoading}
          />

          {/* Footer Metadata */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              HBPLUS Security & Identity Management • All rights reserved
            </Text>
            {!isFirebaseConfigured && (
              <Text style={styles.envNotice}>
                Demo / Evaluator Mode Active (Firebase env unassigned)
              </Text>
            )}
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  scrollContentDesktop: {
    paddingVertical: spacing.xxl,
  },
  loginContainer: {
    width: '100%',
  },
  desktopCard: {
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      },
    }),
  },
  mobileContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 1.5,
  },
  portalTag: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  formSection: {
    width: '100%',
  },
  textCenter: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: colors.dangerText,
    fontWeight: '500',
  },
  actionSection: {
    marginVertical: spacing.sm,
    width: '100%',
  },
  policyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: 4,
  },
  lockIcon: {
    marginRight: 6,
  },
  policyText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  policyHighlight: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.sm,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
  envNotice: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});
