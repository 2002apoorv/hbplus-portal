/**
 * User Service - Cloud Firestore integration
 * Handles user profile synchronization, role-based access, and login tracking.
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  collection, 
  getDocs,
  query,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';

// Configurable admin emails list (can be extended via environment or server claims)
const DEFAULT_ADMIN_EMAILS = [
  'admin@hbplus.fit',
  'security@hbplus.fit',
  'lead@hbplus.fit',
];

/**
 * Synchronizes an authorized user's profile in Firestore upon successful login.
 * 
 * Rules:
 * - Uses Firebase UID as document ID.
 * - Updates lastLoginAt on every login.
 * - Never overwrites an existing user's role with a default role!
 * 
 * @param {import('firebase/auth').User} firebaseUser
 * @returns {Promise<{ uid: string, name: string, email: string, photoURL: string, role: string, lastLoginAt: any, createdAt: any }>}
 */
export async function syncUserProfile(firebaseUser) {
  if (!firebaseUser || !firebaseUser.uid) {
    throw new Error('Valid authenticated Firebase user is required.');
  }

  const userRef = db ? doc(db, USERS_COLLECTION, firebaseUser.uid) : null;
  const now = new Date().toISOString();

  // If Firestore is available, perform real database operations
  if (db && userRef) {
    try {
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const role = existingData.role || 'user';

        // Update lastLoginAt, without overwriting existing role
        const updates = {
          lastLoginAt: serverTimestamp(),
          name: firebaseUser.displayName || existingData.name || 'HBPLUS Employee',
          photoURL: firebaseUser.photoURL || existingData.photoURL || null,
          email: firebaseUser.email,
        };

        await updateDoc(userRef, updates);

        return {
          uid: firebaseUser.uid,
          name: updates.name,
          email: firebaseUser.email,
          photoURL: updates.photoURL,
          role,
          createdAt: existingData.createdAt,
          lastLoginAt: new Date(),
        };
      } else {
        // First-time authorized user registration
        // Determine role: assign admin if email matches admin list, else 'user'
        const normalizedEmail = (firebaseUser.email || '').toLowerCase().trim();
        const isAdmin = DEFAULT_ADMIN_EMAILS.includes(normalizedEmail) || normalizedEmail.startsWith('admin');
        const role = isAdmin ? 'admin' : 'user';

        const newProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'HBPLUS Employee',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || null,
          role,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        };

        await setDoc(userRef, newProfile);

        return {
          ...newProfile,
          createdAt: new Date(),
          lastLoginAt: new Date(),
        };
      }
    } catch (firestoreError) {
      console.warn('Firestore sync failed, falling back to local session profile:', firestoreError);
    }
  }

  // Fallback for demo or when Firestore is uninitialized
  const email = (firebaseUser.email || '').toLowerCase().trim();
  const isAdmin = DEFAULT_ADMIN_EMAILS.includes(email) || email.startsWith('admin');
  
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || 'HBPLUS Employee',
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL || null,
    role: isAdmin ? 'admin' : 'user',
    createdAt: now,
    lastLoginAt: now,
  };
}

/**
 * Retrieves a user's stored profile from Firestore.
 * @param {string} uid
 */
export async function getUserProfile(uid) {
  if (!db || !uid) return null;

  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

/**
 * Lists authorized employees for Admin view.
 * @param {number} maxResults
 */
export async function getAuthorizedUsersList(maxResults = 25) {
  if (!db) return [];

  try {
    const q = query(collection(db, USERS_COLLECTION), limit(maxResults));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (err) {
    console.warn('Error fetching users list:', err);
    return [];
  }
}

export default {
  syncUserProfile,
  getUserProfile,
  getAuthorizedUsersList,
};
