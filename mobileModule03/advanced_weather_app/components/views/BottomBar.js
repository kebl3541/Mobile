import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import { COLORS } from '../../constants/Colors';

export default function BottomBar(props) {
  const { responsive, pointerEvents, renderIcon, ...tabBarProps } = props;
  const { bottomBarPad } = responsive;

  return (
    <View style={styles.bottomBarWrapper}>
      <TabBar
        {...tabBarProps}
        renderIcon={renderIcon}
        // Appearance props
        activeColor={COLORS.primary}
        inactiveColor={COLORS.gray}
        style={[
          styles.bottomBar,
          {
            paddingBottom: Platform.OS === 'ios' ? bottomBarPad : 4,
            paddingTop: 4,
          },
        ]}
        labelStyle={styles.label}
        tabStyle={styles.tab}
        indicatorStyle={styles.indicator}
        pressColor="transparent"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  bottomBarWrapper: {
    width: '100%',
    backgroundColor: COLORS.overlay,
    zIndex: 2000,
    ...Platform.select({
      ios: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E5E5EA',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 0,
        borderWidth: 0,
        borderColor: 'transparent',
      },
      web: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E5E5EA',
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.05)',
      },
      default: {},
    }),
  },
  bottomBar: {
    backgroundColor: 'transparent',
    elevation: 0,
    ...Platform.select({
      web: {
        boxShadow: 'none',
      },
      default: {
        shadowOpacity: 0,
      },
    }),
  },
  tab: {
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Outfit-SemiBold',
    textTransform: 'none',
  },
  indicator: {
    backgroundColor: COLORS.primary,
    height: 3,
    borderRadius: 3,
  },
});