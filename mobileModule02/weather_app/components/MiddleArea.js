import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MiddleArea({ title, extraText, responsive }) {
  const { middleText, middlePadH } = responsive;

  return (
    <View style={[styles.container, { paddingHorizontal: middlePadH }]}>
      <Text style={[styles.text, { fontSize: middleText }]}>
        {extraText ? `${title} ${extraText}` : title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});