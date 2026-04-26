import React from 'react';
import { StyleSheet, ImageBackground, View, LogBox, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WeatherTabsScreen from './components/views/WeatherTabsScreen';
import { WeatherProvider } from './context/WeatherContext';
import { COLORS } from './constants/Colors';

// Silence library-internal noise that LogBox doesn't catch on Web
if (Platform.OS === 'web') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const msg = args[0] || '';
    if (typeof msg === 'string' && (
      msg.includes('pointerEvents') || 
      msg.includes('transform-origin') ||
      msg.includes('Invalid DOM property')
    )) {
      return;
    }
    originalWarn(...args);
  };
}

LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  'Invalid DOM property `transform-origin`'
]);

import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('./assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium': require('./assets/fonts/Outfit-Medium.ttf'),
    'Outfit-SemiBold': require('./assets/fonts/Outfit-SemiBold.ttf'),
    'Outfit-Bold': require('./assets/fonts/Outfit-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ImageBackground 
        source={require('./assets/background.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <WeatherProvider>
            <WeatherTabsScreen />
          </WeatherProvider>
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
});