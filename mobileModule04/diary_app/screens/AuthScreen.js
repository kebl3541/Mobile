import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { signInWithGoogleWeb, signInWithGithubWeb, isWeb } from '../services/authService';
import { useNativeGoogleAuth, useNativeGithubAuth } from '../hooks/useNativeAuth';
import { isFirebaseConfigured } from '../firebaseConfig';
import { showError } from '../utils/alert';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

// Ex00: the authentication page. Google or GitHub sign-in; once
// Firebase reports a user, App.js swaps the stack to the diary.
export default function AuthScreen() {
  const [busy, setBusy] = useState(false);

  const onError = (error) => {
    setBusy(false);
    showError('Sign-in failed', error);
  };

  const googleNative = useNativeGoogleAuth(onError);
  const githubNative = useNativeGithubAuth(onError);

  // One flow for both providers. On native, promptAsync RESOLVES (never
  // throws) with type 'dismiss'/'cancel' when the user backs out of the
  // OAuth browser, so busy must be reset on any non-success result.
  const handleSignIn = async (webSignIn, nativeAuth) => {
    if (!isFirebaseConfigured) {
      showError('Sign-in failed', new Error('Firebase is not configured: create a .env file (see SETUP.md).'));
      return;
    }
    setBusy(true);
    try {
      if (isWeb) {
        await webSignIn();
      } else {
        const result = await nativeAuth.promptAsync();
        if (result?.type !== 'success') {
          setBusy(false);
        }
      }
    } catch (error) {
      onError(error);
    }
  };

  const handleGoogle = () => handleSignIn(signInWithGoogleWeb, googleNative);
  const handleGithub = () => handleSignIn(signInWithGithubWeb, githubNative);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Choose how you want to sign in</Text>

      {busy ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <>
          <TouchableOpacity
            style={[styles.providerButton, { backgroundColor: COLORS.google }]}
            onPress={handleGoogle}
          >
            <Text style={styles.providerIcon}>G</Text>
            <Text style={styles.providerText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.providerButton, { backgroundColor: COLORS.github }]}
            onPress={handleGithub}
          >
            <Text style={styles.providerIcon}>{'\u{1F419}'}</Text>
            <Text style={styles.providerText}>Continue with GitHub</Text>
          </TouchableOpacity>
        </>
      )}

      {!isFirebaseConfigured && (
        <Text style={styles.warning}>
          Firebase is not configured yet.{'\n'}
          Sign-in will not work until .env is created (see SETUP.md).
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  providerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  providerIcon: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: SPACING.sm,
  },
  providerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  warning: {
    marginTop: SPACING.xl,
    color: COLORS.danger,
    textAlign: 'center',
    fontSize: 13,
  },
});
