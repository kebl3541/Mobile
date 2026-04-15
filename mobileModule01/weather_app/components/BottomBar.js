import React from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getResponsiveSizes } from '../utils/responsive';

const tabs = [
  { title: 'Currently', icon: 'time-outline' },
  { title: 'Today', icon: 'today-outline' },
  { title: 'Weekly', icon: 'calendar-outline' },
];

export default function BottomBar({ activeTab, setActiveTab }) {
  const { width, height } = useWindowDimensions();
  const {
    bottomBarIcon,
    bottomBarText,
    bottomBarPad,
    isTinyWidth,
  } = getResponsiveSizes(width, height);

  const showTabText = !isTinyWidth;

  return (
    <View style={styles.bottomBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.title;

        return (
          <Pressable
            key={tab.title}
            style={[styles.tab, { paddingVertical: bottomBarPad }]}
            onPress={() => setActiveTab(tab.title)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={tab.icon}
              size={bottomBarIcon}
              color={isActive ? 'black' : '#666'}
            />

            {showTabText && (
              <Text
                style={[
                  styles.tabText,
                  { fontSize: bottomBarText },
                  isActive && styles.activeText,
                ]}
              >
                {tab.title}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#ddd',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 4,
  },
  activeText: {
    fontWeight: 'bold',
  },
});