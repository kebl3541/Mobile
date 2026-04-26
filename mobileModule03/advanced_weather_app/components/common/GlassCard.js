import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

/**
 * A reusable glassmorphic card component.
 * @param {object} props
 * @param {number} props.opacity - The opacity of the white background (default: 0.5)
 * @param {object} props.style - Additional styles for the container
 * @param {React.ReactNode} props.children - Content of the card
 */
const GlassCard = React.memo(({ children, opacity = 0.5, style, ...props }) => {
  return (
    <View 
      style={[
        styles.card, 
        { backgroundColor: `rgba(255, 255, 255, ${opacity})` },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
});

export default GlassCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden', // Ensure children don't bleed out of rounded corners
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 0,
      }
    }),
  },
});

