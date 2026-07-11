// Fill these values from your Firebase console (see SETUP.md).
// Project settings > General > Your apps > Web app > SDK setup and configuration.
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
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
