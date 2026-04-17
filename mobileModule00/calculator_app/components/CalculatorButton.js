import { Pressable, StyleSheet, Text } from 'react-native';

export default function CalculatorButton({ value, type, onPress, isLandscape }) {
  const variantStyle =
    type === 'action'
      ? styles.actionButton
      : type === 'operator'
      ? styles.operatorButton
      : null;

  return (
    <Pressable
      onPress={() => onPress(value)}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        isLandscape && styles.buttonLandscape,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
        {value}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6f90a1',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buttonLandscape: {
    minHeight: 48,
    marginHorizontal: 3,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  buttonTextLandscape: {
    fontSize: 20,
  },
  operatorButton: {
    backgroundColor: '#ff9500',
  },
  actionButton: {
    backgroundColor: '#d9534f',
  },
});