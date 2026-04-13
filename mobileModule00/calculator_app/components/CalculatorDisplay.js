import { StyleSheet, TextInput, View } from 'react-native';

export default function CalculatorDisplay({ expression, result, isLandscape }) {
  return (
    <View style={[styles.displaySection, isLandscape && styles.displaySectionLandscape]}>
      <View style={[styles.textField, isLandscape && styles.textFieldLandscape]}>
        <TextInput
          style={[styles.textFieldText, isLandscape && styles.textFieldTextLandscape]}
          value={expression}
          editable={false}
        />
      </View>

      <View style={[styles.textField, isLandscape && styles.textFieldLandscape]}>
        <TextInput
          style={[styles.textFieldText, isLandscape && styles.textFieldTextLandscape]}
          value={result}
          editable={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  displaySection: {
    marginBottom: 8,
  },
  displaySectionLandscape: {
    marginBottom: 4,
  },
  textField: {
    padding: 16,
    backgroundColor: '#1c1c1e',
    borderBottomWidth: 1,
    borderBottomColor: '#e4d9d9ff',
  },
  textFieldLandscape: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  textFieldText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },
  textFieldTextLandscape: {
    fontSize: 20,
  },
});