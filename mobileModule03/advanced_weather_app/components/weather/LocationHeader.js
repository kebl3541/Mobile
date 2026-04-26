import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../constants/Colors';

/**
 * A beautiful header that displays the city name and location.
 * Formats the city on the first line and the rest (region, country) underneath.
 */
const LocationHeader = ({ label, error, responsive }) => {
  const { middleText } = responsive;
  // Compact responsive font sizes
  const cityFontSize = Math.max(middleText * 1.15, 22);
  const restFontSize = Math.max(middleText * 0.65, 13);

  if (error || !label) {
    return null;
  }

  const parts = label.split(',').map(p => p.trim());
  const cityName = parts[0];
  const rest = parts.slice(1).join(', ');

  return (
    <View style={styles.container}>
      <Text 
        style={[styles.cityText, { fontSize: cityFontSize }]} 
      >
        {cityName}
      </Text>
      {rest ? (
        <Text style={[styles.restText, { fontSize: restFontSize }]}>
          {rest}
        </Text>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 5,
    paddingHorizontal: 25,
    backgroundColor: 'transparent',
  },
  cityText: {
    fontFamily: 'Outfit-Bold',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: -0.4,
    width: '100%',
    ...(Platform.OS === 'web'
      ? { textShadow: '0px 1px 2px rgba(255, 255, 255, 0.5)' }
      : {
          textShadowColor: 'rgba(255, 255, 255, 0.5)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }
    ),
  },
  restText: {
    fontFamily: 'Outfit-SemiBold',
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 6, // Added distance between city and region
    opacity: 0.9,
    letterSpacing: 0.1,
  },
  welcomeText: {
    fontFamily: 'Outfit-SemiBold',
    color: COLORS.gray,
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  spacer: {
    height: 20,
  }
});

export default React.memo(LocationHeader);
