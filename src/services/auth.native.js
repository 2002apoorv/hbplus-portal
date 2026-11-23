/**
 * Native Authentication Service (Android & iOS)
 * Uses @react-native-google-signin/google-signin in development builds,
 * and guards against crashes when running inside Expo Go (which lacks custom native binaries).
 */

import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut } from 'firebase/auth';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { auth, isConfigured } from './firebase.native';

// Check if running inside Expo Go (where custom native modules like RNGoogleSignin are not included)
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  Constants.appOwnership === 'expo';

let GoogleSigninModule = null;
let statusCodes = {};
let isModuleChecked = false;
let isNativeModuleAvailable = false;

function loadGoogleSignin() {
  if (isModuleChecked) {
    return isNativeModuleAvailable;
  }
  isModuleChecked = true;

  if (isExpoGo) {
    isNativeModuleAvailable = false;
    return false;
  }

  try {
    const mod = require('@react-native-google-signin/google-signin');
    if (mod && mod.GoogleSignin) {
      GoogleSigninModule = mod.GoogleSignin;
      statusCodes = mod.statusCodes || {};
      isNativeModuleAvailable = true;
      return true;
    }
  } catch (err) {
    // RNGoogleSignin TurboModule not found in the current native binary
    isNativeModuleAvailable = false;
  }
  return isNativeModuleAvailable;
}

let isGoogleSigninConfigured = false;

function ensureGoogleSigninConfigured() {
  const available = loadGoogleSignin();
  if (!available || !GoogleSigninModule) {
    const error = new Error(
      isExpoGo
        ? 'Google Sign-In with native SDK requires a Development Build (npx expo run:android / eas build) because Expo Go does not bundle custom native modules. For Expo Go, please use "Sign In with Company Email" or test on Web.'
        : 'Native Google Sign-In module (RNGoogleSignin) is not registered in this binary. Please rebuild using npx expo run:android or run:ios.'
    );
    error.code = 'auth/expo-go-unsupported';
    throw error;
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

  ensureGoogleSigninConfigured();

  try {
    await GoogleSigninModule.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSigninModule.signIn();
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
  if (loadGoogleSignin() && GoogleSigninModule) {
    try {
      await GoogleSigninModule.signOut();
    } catch (e) {
      // Non-fatal if already signed out
    }
  }

  if (auth) {
    await firebaseSignOut(auth);
  }
}

export default {
  signInWithGoogle,
  signOutUser,
};
