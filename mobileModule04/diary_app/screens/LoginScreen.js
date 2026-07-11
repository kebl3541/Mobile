import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { isFirebaseConfigured } from '../firebaseConfig';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

// Ex00: entry point of the app. The Login button redirects to the
// authentication page; if the user is already logged in, App.js never
// shows this screen and goes straight to the diary.
export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📖</Text>
      <Text style={styles.title}>My Diary</Text>
      <Text style={styles.subtitle}>Your day, your words.</Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Auth')}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {!isFirebaseConfigured && (
        <Text style={styles.warning}>
          Firebase is not configured yet.{'\n'}
          Fill in firebaseConfig.js (see SETUP.md).
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
  emoji: {
    fontSize: 72,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl * 2,
    borderRadius: RADIUS.lg,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  warning: {
    marginTop: SPACING.xl,
    color: COLORS.danger,
    textAlign: 'center',
    fontSize: 13,
  },
});
