/**
 * Native Authentication Service (Android & iOS)
 * Uses @react-native-google-signin/google-signin and Firebase signInWithCredential.
 */

import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut } from 'firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { auth, isConfigured } from './firebase.native';

let isGoogleSigninConfigured = false;

function ensureGoogleSigninConfigured() {
  if (!isGoogleSigninConfigured) {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
    const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';

    GoogleSignin.configure({
      webClientId: webClientId || undefined,
      iosClientId: iosClientId || undefined,
      hostedDomain: 'hbplus.fit', // Pre-fill / hint corporate domain
      offlineAccess: false,
    });
    isGoogleSigninConfigured = true;
  }
}

/**
 * Initiates native Google Sign-In and exchanges ID token with Firebase.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithGoogle() {
  if (!auth || !isConfigured) {
    const error = new Error('Firebase Authentication is not configured on native.');
    error.code = 'auth/not-configured';
    throw error;
  }

  ensureGoogleSigninConfigured();

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
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      const cancelError = new Error('Google Sign-In was cancelled.');
      cancelError.code = 'auth/cancelled';
      throw cancelError;
    }
    if (error.code === statusCodes.IN_PROGRESS) {
      const inProgressError = new Error('Sign-in is already in progress.');
      inProgressError.code = 'auth/in-progress';
      throw inProgressError;
    }
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
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
  try {
    await GoogleSignin.signOut();
  } catch (e) {
    // Non-fatal if already signed out
  }

  if (auth) {
    await firebaseSignOut(auth);
  }
}

export default {
  signInWithGoogle,
  signOutUser,
};
