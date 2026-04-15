import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { getResponsiveSizes } from '../utils/responsive';

export default function MiddleArea({ title, extraText }) {
  const { width, height } = useWindowDimensions();
  const { middleText, middlePadH } = getResponsiveSizes(width, height);

  const displayText = extraText ? `${title} ${extraText}` : title;

  return (
    <View
      style={[
        styles.page,
        { paddingHorizontal: middlePadH },
      ]}
    >
      <Text
        style={[
          styles.pageText,
          { fontSize: middleText },
        ]}
      >
        {displayText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});