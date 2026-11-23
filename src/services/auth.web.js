/**
 * Web Authentication Service
 * Uses Firebase GoogleAuthProvider and signInWithPopup for browser authentication.
 * Transparently reports exact errors to the user.
 */

import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, isConfigured } from './firebase.web';

/**
 * Initiates Google OAuth popup flow for Web browsers.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithGoogle() {
  if (!auth || !isConfigured) {
    const error = new Error('Firebase Authentication is not configured. Please define valid EXPO_PUBLIC_FIREBASE_* variables in your .env file and restart the dev server.');
    error.code = 'auth/not-configured';
    throw error;
  }

  const provider = new GoogleAuthProvider();
  // Prompt user to select an account and hint the corporate domain
  provider.setCustomParameters({
    hd: 'hbplus.fit',
    prompt: 'select_account',
  });

  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error('Firebase signInWithPopup error:', error);

    if (error.code === 'auth/popup-closed-by-user') {
      const cancelError = new Error('Sign-in popup was closed before completing authentication.');
      cancelError.code = 'auth/cancelled';
      throw cancelError;
    }
    if (error.code === 'auth/popup-blocked') {
      const blockedError = new Error('The sign-in popup was blocked by your browser. Please allow popups for this site.');
      blockedError.code = 'auth/popup-blocked';
      throw blockedError;
    }
    if (error.code === 'auth/unauthorized-domain') {
      const domainError = new Error('Current web domain is not authorized. In Firebase Console, go to Authentication > Settings > Authorized domains and add this host.');
      domainError.code = 'auth/unauthorized-domain';
      throw domainError;
    }
    if (error.code === 'auth/invalid-api-key') {
      const keyError = new Error('Invalid Firebase API Key. Please verify EXPO_PUBLIC_FIREBASE_API_KEY in your .env file.');
      keyError.code = 'auth/invalid-api-key';
      throw keyError;
    }
    if (error.code === 'auth/operation-not-allowed') {
      const opError = new Error('Google Sign-In is disabled. In Firebase Console, go to Authentication > Sign-in method and enable Google.');
      opError.code = 'auth/operation-not-allowed';
      throw opError;
    }
    if (error.code === 'auth/network-request-failed') {
      const netError = new Error('Network error connecting to Firebase Authentication servers.');
      netError.code = 'auth/network-request-failed';
      throw netError;
    }

    // Pass through exact error message
    throw error;
  }
}

/**
 * Signs out the current user on Web.
 */
export async function signOutUser() {
  if (auth) {
    await firebaseSignOut(auth);
  }
}

export default {
  signInWithGoogle,
  signOutUser,
};
