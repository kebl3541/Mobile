import { Alert, Platform } from 'react-native';

// One place for user-facing error messages (React Native's Alert is a
// no-op on web, so web falls back to window.alert).
export function showError(title, error) {
  const message = error?.message ?? String(error);
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}
