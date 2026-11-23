/**
 * Cross-platform Authentication Dispatcher
 * Automatically routes to web or native authentication implementation.
 */

import { Platform } from 'react-native';

let authService;
if (Platform.OS === 'web') {
  authService = require('./auth.web');
} else {
  authService = require('./auth.native');
}

export const signInWithGoogle = authService.signInWithGoogle;
export const signOutUser = authService.signOutUser;

export default authService;
