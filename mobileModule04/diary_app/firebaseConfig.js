// Firebase config is loaded from environment variables (see .env.example).
// Put the real values in a local .env file - it is gitignored on purpose so
// no key ever lands in the repository. Expo inlines EXPO_PUBLIC_* variables
// at bundle time.
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Only needed to sign in from a NATIVE build (Android/iOS).
// On web, Firebase popups handle everything and these stay unused.
export const googleNativeConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '',
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
};

export const githubNativeConfig = {
  // WARNING: a GitHub client secret is a real secret. It stays in .env
  // (gitignored) and must never be committed.
  clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID ?? '',
  clientSecret: process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET ?? '',
};

export const isFirebaseConfigured = !!firebaseConfig.apiKey;
