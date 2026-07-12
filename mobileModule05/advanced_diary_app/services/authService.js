import { Platform } from 'react-native';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signOut as firebaseSignOut,
} from 'firebase/auth';

import { auth } from './firebase';

// Web sign-in: Firebase handles the whole OAuth dance in a popup.
export async function signInWithGoogleWeb() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signInWithGithubWeb() {
  const provider = new GithubAuthProvider();
  return signInWithPopup(auth, provider);
}

// Native sign-in: expo-auth-session gives us tokens, we exchange them
// for a Firebase credential.
export async function signInWithGoogleIdToken(idToken) {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

export async function signInWithGithubAccessToken(accessToken) {
  const credential = GithubAuthProvider.credential(accessToken);
  return signInWithCredential(auth, credential);
}

export function signOut() {
  return firebaseSignOut(auth);
}

export const isWeb = Platform.OS === 'web';
