/**
 * Google Sign-In Button Component
 * Polished enterprise Google button with standard brand colors and clean styling.
 */

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  ActivityIndicator, 
  StyleSheet, 
  Platform 
} from 'react-native';
import { colors, borderRadius, spacing } from '../styles/theme';

export default function GoogleLoginButton({ onPress, loading, disabled }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || loading) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Sign in with Google"
    >
      {loading ? (
        <View style={styles.contentRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.buttonTextLoading}>Authenticating...</Text>
        </View>
      ) : (
        <View style={styles.contentRow}>
          {/* Custom Google "G" Logo */}
          <View style={styles.googleIconContainer}>
            <View style={styles.gLogoWrapper}>
              <Text style={styles.gLetter}>G</Text>
            </View>
          </View>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 52,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      },
      default: {
        elevation: 1,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.65,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      },
    }),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gLogoWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gLetter: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  buttonText: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  buttonTextLoading: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 10,
  },
});
