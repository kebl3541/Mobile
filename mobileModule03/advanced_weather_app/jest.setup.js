// jest.setup.js

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  Accuracy: {
    Balanced: 3,
    High: 4,
    Highest: 5,
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock react-native modules
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
