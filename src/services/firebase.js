/**
 * Cross-platform Firebase service bridge
 * Metro automatically resolves .web.js and .native.js,
 * this file serves as a fallback and central entry point.
 */

import { Platform } from 'react-native';

let service;
if (Platform.OS === 'web') {
  service = require('./firebase.web');
} else {
  service = require('./firebase.native');
}

export const app = service.app;
export const auth = service.auth;
export const db = service.db;
export const isConfigured = service.isConfigured;
export const firebaseConfig = service.firebaseConfig;

export default service;
