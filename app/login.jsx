/**
 * Login Screen - HBPLUS Employee Portal
 * Minimalist Enterprise SaaS Login with Direct Email Authentication & Google Sign-In.
 * Users can type their email directly or click Continue with Google.
 * Surfaces exact errors and domain restrictions.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
  Image,
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

  const [emailInput, setEmailInput] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [localError, setLocalError] = useState('');

  const {
    login,
    authenticateWithEmail,
    authActionLoading,
    error,
    accessDenied,
    unauthorizedEmail,
    clearError,
    testDomainLogin,
    isFirebaseConfigured,
  } = useAuth();

  const handleEmailSubmit = async () => {
    const trimmed = emailInput.trim();
    if (!trimmed) {
      setLocalError('Please type your company email address.');
      return;
    }
    setLocalError('');
    await authenticateWithEmail(trimmed);
  };

  const handleGoogleClick = async () => {
    setLocalError('');
    await login();
  };

  const handleTryAnother = () => {
    clearError();
    setEmailInput('');
    setLocalError('');
  };

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

          {/* Watermark Background Image */}
          <View style={styles.watermarkWrapper} pointerEvents="none">
            <Image
              source={require('../assets/Watermark.jpg')}
              style={styles.watermarkImage}
              resizeMode="cover"
            />
          </View>

          {/* Brand Mark Header */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>HB+</Text>
            </View>
            <Text style={styles.brandName}>HBPLUS</Text>
            <Text style={styles.portalTag}>EMPLOYEE PORTAL</Text>
          </View>

          {/* Conditional View: Access Denied State vs Sign-In Form */}
          {accessDenied ? (
            <AccessDeniedCard
              unauthorizedEmail={unauthorizedEmail || emailInput}
              onTryAnother={handleTryAnother}
            />
          ) : (
            <View style={styles.formSection}>
              <View style={styles.textCenter}>
                <Text style={styles.heading}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  Sign in using your official company account.
                </Text>
              </View>

              {/* General Error Message Banner */}
              {Boolean((error || localError) && !accessDenied) ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={18} color={colors.danger} style={{ marginRight: 8, marginTop: 1 }} />
                  <Text style={styles.errorText}>{localError || error}</Text>
                </View>
              ) : null}

              {/* Direct Email Address Input Form */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Official Company Email</Text>
                <View style={[
                  styles.inputWrapper,
                  inputFocused && styles.inputWrapperFocused,
                  (localError || (error && !accessDenied)) && styles.inputWrapperError,
                ]}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={inputFocused ? colors.accent : colors.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder={`e.g. name${AUTHORIZED_DOMAIN_SUFFIX}`}
                    placeholderTextColor={colors.textMuted}
                    value={emailInput}
                    onChangeText={(text) => {
                      setEmailInput(text);
                      if (localError) setLocalError('');
                    }}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="go"
                    onSubmitEditing={handleEmailSubmit}
                    editable={!authActionLoading}
                  />
                  {Boolean(emailInput.length > 0 && !authActionLoading) ? (
                    <TouchableOpacity
                      onPress={() => setEmailInput('')}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={styles.clearIcon}
                    >
                      <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              {/* Submit Email Button */}
              <TouchableOpacity
                style={[
                  styles.emailSubmitButton,
                  authActionLoading && styles.buttonDisabled,
                ]}
                onPress={handleEmailSubmit}
                disabled={authActionLoading}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Sign in with email"
              >
                {authActionLoading ? (
                  <View style={styles.buttonContentRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.emailSubmitTextLoading}>Verifying Authorization...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContentRow}>
                    <Text style={styles.emailSubmitText}>Sign In with Company Email</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR SIGN IN WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Sign-In Action */}
              <View style={styles.actionSection}>
                <GoogleLoginButton
                  onPress={handleGoogleClick}
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

          {/* Quick Scenario Evaluator */}
          <DomainTestPanel
            onSelectScenario={(scenarioEmail) => {
              setEmailInput(scenarioEmail);
              authenticateWithEmail(scenarioEmail);
            }}
            loading={authActionLoading}
          />

          {/* Footer Metadata */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              HBPLUS Security & Identity Management • All rights reserved
            </Text>
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
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      },
    }),
  },
  mobileContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 240,
    overflow: 'hidden',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    zIndex: 0,
  },
  watermarkImage: {
    width: '100%',
    height: '100%',
    opacity: 0.12,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    zIndex: 1,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#3f63f6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#0A192F',
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
    zIndex: 1,
  },
  textCenter: {
    alignItems: 'center',
    marginBottom: spacing.md,
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
    alignItems: 'flex-start',
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: colors.dangerText,
    fontWeight: '500',
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: spacing.sm,
    width: '100%',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    height: 48,
    ...Platform.select({
      web: {
        transition: 'border-color 0.15s ease',
      },
    }),
  },
  inputWrapperFocused: {
    borderColor: colors.accent,
    backgroundColor: '#FFFFFF',
  },
  inputWrapperError: {
    borderColor: colors.danger,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: colors.textPrimary,
    fontSize: 15,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  clearIcon: {
    marginLeft: 6,
  },
  emailSubmitButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.md,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    width: '100%',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(10, 25, 47, 0.15)',
      },
      default: {
        elevation: 1,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.7,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      },
    }),
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailSubmitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  emailSubmitTextLoading: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    paddingHorizontal: 10,
    letterSpacing: 0.5,
  },
  actionSection: {
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
});
