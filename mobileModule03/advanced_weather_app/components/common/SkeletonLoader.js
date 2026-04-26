import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';

/**
 * A reusable pulsing skeleton loader.
 * @param {object} props
 * @param {number} props.width 
 * @param {number} props.height 
 * @param {number} props.borderRadius 
 * @param {object} props.style
 */
export default function SkeletonLoader({ width = '100%', height = 20, borderRadius = 8, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View 
      style={[
        styles.skeleton, 
        { width, height, borderRadius, opacity }, 
        style
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
});
