// Fill these values from your Firebase console (see SETUP.md).
// Project settings > General > Your apps > Web app > SDK setup and configuration.
export const firebaseConfig = {
  apiKey: 'AIzaSy_REVOKED_AND_ROTATED',
  authDomain: 'diary-22d66.firebaseapp.com',
  projectId: 'diary-22d66',
  storageBucket: 'diary-22d66.firebasestorage.app',
  messagingSenderId: '740146262268',
  appId: '1:740146262268:web:d1c5dee51bedd061d76779',
};

// Only needed to sign in from a NATIVE build (Android/iOS).
// On web, Firebase popups handle everything and these stay unused.
export const googleNativeConfig = {
  // OAuth client IDs from Google Cloud console (created by Firebase).
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: '',
  iosClientId: '',
};

export const githubNativeConfig = {
  // GitHub OAuth app credentials (github.com/settings/developers).
  clientId: 'YOUR_GITHUB_CLIENT_ID',
  clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith('YOUR_');
