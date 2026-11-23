/**
 * Native Authentication Service (Android & iOS)
 * Uses @react-native-google-signin/google-signin in development builds,
 * and guards against crashes when running inside Expo Go (which lacks custom native binaries).
 */

import { NativeModules, TurboModuleRegistry } from 'react-native';
import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, isConfigured } from './firebase.native';

/**
 * Checks whether RNGoogleSignin native module is registered in the native binary.
 * TurboModuleRegistry.get() returns null safely without throwing invariant error.
 */
function isRNGoogleSigninAvailable() {
  try {
    if (TurboModuleRegistry && typeof TurboModuleRegistry.get === 'function') {
      const module = TurboModuleRegistry.get('RNGoogleSignin');
      if (module) return true;
    }
  } catch (e) {
    // Ignore and fallback to NativeModules
  }

  try {
    if (NativeModules && NativeModules.RNGoogleSignin) {
      return true;
    }
  } catch (e) {
    // Ignore
  }

  return false;
}

let isGoogleSigninConfigured = false;
let GoogleSigninModule = null;
let statusCodes = {};

function getGoogleSignin() {
  if (!isRNGoogleSigninAvailable()) {
    const error = new Error(
      'Google Sign-In with native SDK is not supported in Expo Go because custom native binaries are not bundled in Expo Go. Please use "Sign In with Company Email" to test in Expo Go, or test Google OAuth on Web at http://192.168.1.59:8081.'
    );
    error.code = 'auth/expo-go-unsupported';
    throw error;
  }

  if (!GoogleSigninModule) {
    const mod = require('@react-native-google-signin/google-signin');
    GoogleSigninModule = mod.GoogleSignin;
    statusCodes = mod.statusCodes || {};
  }

  if (!isGoogleSigninConfigured) {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
    const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';

    GoogleSigninModule.configure({
      webClientId: webClientId || undefined,
      iosClientId: iosClientId || undefined,
      hostedDomain: 'hbplus.fit', // Pre-fill / hint corporate domain
      offlineAccess: false,
    });
    isGoogleSigninConfigured = true;
  }

  return { GoogleSignin: GoogleSigninModule, statusCodes };
}

/**
 * Initiates native Google Sign-In and exchanges ID token with Firebase.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithGoogle() {
  if (!auth || !isConfigured) {
    const error = new Error('Firebase Authentication is not configured on native. Please check your .env configuration.');
    error.code = 'auth/not-configured';
    throw error;
  }

  const { GoogleSignin, statusCodes } = getGoogleSignin();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();
    // Support both modern { data: { idToken } } and legacy { idToken } shapes
    const idToken = response?.data?.idToken || response?.idToken;

    if (!idToken) {
      const missingTokenError = new Error('Google Sign-In succeeded but no ID token was returned.');
      missingTokenError.code = 'auth/missing-id-token';
      throw missingTokenError;
    }

    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential;
  } catch (error) {
    if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
      const cancelError = new Error('Google Sign-In was cancelled.');
      cancelError.code = 'auth/cancelled';
      throw cancelError;
    }
    if (error.code === statusCodes?.IN_PROGRESS) {
      const inProgressError = new Error('Sign-in is already in progress.');
      inProgressError.code = 'auth/in-progress';
      throw inProgressError;
    }
    if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
      const playServicesError = new Error('Google Play Services not available or outdated.');
      playServicesError.code = 'auth/play-services-unavailable';
      throw playServicesError;
    }
    throw error;
  }
}

/**
 * Signs out the current user on Native (both Google Sign-In and Firebase Auth).
 */
export async function signOutUser() {
  if (isRNGoogleSigninAvailable()) {
    try {
      const mod = require('@react-native-google-signin/google-signin');
      if (mod && mod.GoogleSignin) {
        await mod.GoogleSignin.signOut();
      }
    } catch (e) {
      // Non-fatal if already signed out
    }
  }

  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // Non-fatal
    }
  }
}

export default {
  signInWithGoogle,
  signOutUser,
};
