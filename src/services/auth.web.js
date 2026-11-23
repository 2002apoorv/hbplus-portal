/**
 * Web Authentication Service
 * Uses Firebase GoogleAuthProvider and signInWithPopup for browser authentication.
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
    const error = new Error('Firebase Authentication is not configured. Please define EXPO_PUBLIC_FIREBASE_* in your environment or use the Demo Mode to test.');
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
      const domainError = new Error('Current web domain is not authorized in your Firebase console.');
      domainError.code = 'auth/unauthorized-domain';
      throw domainError;
    }
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
