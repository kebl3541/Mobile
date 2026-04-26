import React, { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';

/**
 * A component that fades in its children when it mounts.
 */
export default function FadeInView({ children, duration = 500, style }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fadeAnim, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0], // Slight slide up effect
            }),
          }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
