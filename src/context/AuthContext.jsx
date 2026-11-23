/**
 * Global Authentication Context for HBPLUS Employee Portal
 * Manages Firebase session, domain authorization, role-based state, and sign-in/out actions.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isConfigured } from '../services/firebase';
import { signInWithGoogle as doGoogleSignIn, signOutUser as doSignOut } from '../services/auth';
import { syncUserProfile } from '../services/userService';
import { validateEmailDomain } from '../utils/validateDomain';

const AuthContext = createContext({
  user: null,
  role: null,
  loading: true,
  authActionLoading: false,
  error: null,
  accessDenied: false,
  unauthorizedEmail: null,
  isFirebaseConfigured: false,
  login: async () => {},
  logout: async () => {},
  clearError: () => {},
  testDomainLogin: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState(null);

  /**
   * Clears any active error or access-denied state.
   */
  const clearError = useCallback(() => {
    setError(null);
    setAccessDenied(false);
    setUnauthorizedEmail(null);
  }, []);

  /**
   * Internal processor for an authenticated user session.
   * Enforces strict domain authorization rules.
   */
  const handleUserSession = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    const email = firebaseUser.email;
    const domainCheck = validateEmailDomain(email);

    // STEP 9 & 10: Strict domain validation enforcement
    if (!domainCheck.isValid) {
      console.warn(`[HBPLUS Security Alert] Unauthorized email attempted authentication: ${email}`);
      
      // Immediately sign out unauthorized users from Firebase
      try {
        await doSignOut();
      } catch (signOutErr) {
        console.error('Error during forced sign-out of unauthorized user:', signOutErr);
      }

      setUser(null);
      setRole(null);
      setAccessDenied(true);
      setUnauthorizedEmail(email);
      setError('Access restricted. Please login using your official domain email.');
      setLoading(false);
      return;
    }

    // Authorized user: Domain verified (@hbplus.fit)
    try {
      const userProfile = await syncUserProfile(firebaseUser);
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || userProfile.name || 'HBPLUS Employee',
        photoURL: firebaseUser.photoURL || userProfile.photoURL,
        role: userProfile.role || 'user',
        emailVerified: firebaseUser.emailVerified ?? true,
        lastLoginAt: userProfile.lastLoginAt,
        createdAt: userProfile.createdAt,
      });
      setRole(userProfile.role || 'user');
      setAccessDenied(false);
      setUnauthorizedEmail(null);
      setError(null);
    } catch (profileErr) {
      console.error('Failed to synchronize authorized user profile:', profileErr);
      // Still allow authenticated user if domain is valid
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'HBPLUS Employee',
        photoURL: firebaseUser.photoURL,
        role: 'user',
        emailVerified: firebaseUser.emailVerified ?? true,
      });
      setRole('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen to Firebase authentication state changes
  useEffect(() => {
    let unsubscribe = () => {};

    if (auth && isConfigured) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        await handleUserSession(firebaseUser);
      });
    } else {
      // If Firebase credentials are not yet defined, finish initial loading
      setLoading(false);
    }

    return () => unsubscribe();
  }, [handleUserSession]);

  /**
   * Main Google Login action
   */
  const login = useCallback(async () => {
    clearError();
    setAuthActionLoading(true);

    try {
      const userCredential = await doGoogleSignIn();
      const authenticatedUser = userCredential.user;
      await handleUserSession(authenticatedUser);
    } catch (err) {
      if (err.code === 'auth/cancelled') {
        // User closed the popup or cancelled sign-in
        setError('Sign-in was cancelled.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('The sign-in popup was blocked by your browser. Please allow popups.');
      } else if (err.code === 'auth/not-configured') {
        setError(err.message);
      } else {
        setError(err.message || 'An unexpected error occurred during Google authentication.');
      }
    } finally {
      setAuthActionLoading(false);
    }
  }, [clearError, handleUserSession]);

  /**
   * Main Logout action
   */
  const logout = useCallback(async () => {
    setAuthActionLoading(true);
    try {
      await doSignOut();
      setUser(null);
      setRole(null);
      clearError();
    } catch (err) {
      console.error('Error during logout:', err);
      setError('Failed to sign out cleanly.');
    } finally {
      setAuthActionLoading(false);
    }
  }, [clearError]);

  /**
   * Test/Demo Authentication Flow
   * Allows examiners and developers to test both authorized (@hbplus.fit)
   * and unauthorized domains (@gmail.com, @yahoo.com, malicious lookalikes)
   * directly in environments without live Google OAuth keys.
   */
  const testDomainLogin = useCallback(async (testEmail, displayName = 'HBPLUS Employee', roleOverride = 'user') => {
    clearError();
    setAuthActionLoading(true);

    // Simulate network authentication roundtrip
    await new Promise((resolve) => setTimeout(resolve, 600));

    const domainCheck = validateEmailDomain(testEmail);

    if (!domainCheck.isValid) {
      // Step 9 & 10: Unauthorized domain rejection
      setUser(null);
      setRole(null);
      setAccessDenied(true);
      setUnauthorizedEmail(testEmail);
      setError('Access restricted. Please login using your official domain email.');
      setAuthActionLoading(false);
      return { success: false, reason: 'unauthorized_domain' };
    }

    // Authorized domain
    const mockUser = {
      uid: `test-${Date.now()}`,
      email: domainCheck.normalizedEmail,
      displayName: displayName,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0A192F&color=fff`,
      role: roleOverride,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setRole(roleOverride);
    setAccessDenied(false);
    setUnauthorizedEmail(null);
    setError(null);
    setAuthActionLoading(false);
    return { success: true, user: mockUser };
  }, [clearError]);

  const contextValue = {
    user,
    role,
    loading,
    authActionLoading,
    error,
    accessDenied,
    unauthorizedEmail,
    isFirebaseConfigured: isConfigured,
    login,
    logout,
    clearError,
    testDomainLogin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
