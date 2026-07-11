import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import { signInWithGoogleWeb, signInWithGithubWeb, isWeb } from '../services/authService';
import { useNativeGoogleAuth, useNativeGithubAuth } from '../hooks/useNativeAuth';
import { isFirebaseConfigured } from '../firebaseConfig';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

function showError(error) {
  const message = error?.message ?? String(error);
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(message);
  } else {
    Alert.alert('Sign-in failed', message);
  }
}

// Ex00: the authentication page. Google or GitHub sign-in; once
// Firebase reports a user, App.js swaps the stack to the diary.
export default function AuthScreen() {
  const [busy, setBusy] = useState(false);

  const onError = (error) => {
    setBusy(false);
    showError(error);
  };

  const googleNative = useNativeGoogleAuth(onError);
  const githubNative = useNativeGithubAuth(onError);

  const handleGoogle = async () => {
    if (!isFirebaseConfigured) {
      showError(new Error('Firebase is not configured: fill in firebaseConfig.js (see SETUP.md).'));
      return;
    }
    setBusy(true);
    try {
      if (isWeb) {
        await signInWithGoogleWeb();
      } else {
        await googleNative.promptAsync();
      }
    } catch (error) {
      onError(error);
    }
  };

  const handleGithub = async () => {
    if (!isFirebaseConfigured) {
      showError(new Error('Firebase is not configured: fill in firebaseConfig.js (see SETUP.md).'));
      return;
    }
    setBusy(true);
    try {
      if (isWeb) {
        await signInWithGithubWeb();
      } else {
        await githubNative.promptAsync();
      }
    } catch (error) {
      onError(error);
    }
  };

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
          Sign-in will not work until firebaseConfig.js is filled in (see SETUP.md).
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
