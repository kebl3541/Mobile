import { StyleSheet, View } from 'react-native';
import CalculatorButton from './CalculatorButton';

const BUTTON_ROWS = [
  [
    { value: '7' },
    { value: '8' },
    { value: '9' },
    { value: 'C', type: 'action' },
    { value: 'AC', type: 'action' },
  ],
  [
    { value: '4' },
    { value: '5' },
    { value: '6' },
    { value: '+', type: 'operator' },
    { value: '-', type: 'operator' },
  ],
  [
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '*', type: 'operator' },
    { value: '/', type: 'operator' },
  ],
  [
    { value: '0' },
    { value: '.' },
    { value: '00' },
    { value: '=', type: 'operator' },
    { value: null },
  ],
];

export default function CalculatorKeypad({ isLandscape, onButtonPress }) {
  return (
    <View style={styles.keypad}>
      {BUTTON_ROWS.map((row, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          style={[
            styles.row,
            isLandscape && styles.rowLandscape,
            rowIndex === 0 && styles.firstRow,
            rowIndex === 0 && isLandscape && styles.firstRowLandscape,
          ]}
        >
          {row.map((item, colIndex) =>
            item.value ? (
              <CalculatorButton
                key={`${rowIndex}-${colIndex}-${item.value}`}
                value={item.value}
                type={item.type}
                onPress={onButtonPress}
                isLandscape={isLandscape}
              />
            ) : (
              <View
                key={`${rowIndex}-${colIndex}-placeholder`}
                style={[
                  styles.placeholder,
                  isLandscape && styles.placeholderLandscape,
                ]}
              />
            )
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  rowLandscape: {
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  firstRow: {
    marginTop: 16,
  },
  firstRowLandscape: {
    marginTop: 8,
  },
  placeholder: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 64,
  },
  placeholderLandscape: {
    minHeight: 48,
    marginHorizontal: 3,
  },
});