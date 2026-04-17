import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { handlePress } from './calculatorLogic';
import CalculatorDisplay from './components/CalculatorDisplay';
import CalculatorKeypad from './components/CalculatorKeypad';

export default function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  function handleButtonPress(value) {
    const nextState = handlePress(value, expression, result);
    setExpression(nextState.expression);
    setResult(nextState.result);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        <View style={[styles.appBar, isLandscape && styles.appBarLandscape]}>
          <Text style={[styles.appBarTitle, isLandscape && styles.appBarTitleLandscape]}>
            Calculator
          </Text>
        </View>

        <CalculatorDisplay
          expression={expression}
          result={result}
          isLandscape={isLandscape}
        />

        <CalculatorKeypad
          isLandscape={isLandscape}
          onButtonPress={handleButtonPress}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
  },
  appBar: {
    padding: 16,
    backgroundColor: '#000000ff',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  appBarLandscape: {
    paddingVertical: 10,
  },
  appBarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  appBarTitleLandscape: {
    fontSize: 20,
  },
});