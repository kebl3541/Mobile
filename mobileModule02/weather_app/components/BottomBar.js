import React from 'react';
import { StyleSheet } from 'react-native';
import { TabBar } from 'react-native-tab-view';

export default function BottomBar(props) {
  const { responsive, ...tabBarProps } = props;
  const { bottomBarPad } = responsive;

  return (
    <TabBar
      {...tabBarProps}
      activeColor="#007AFF"
      inactiveColor="#8E8E93"
      style={[
        styles.bottomBar,
        {
          paddingBottom: bottomBarPad,
          paddingTop: bottomBarPad / 2,
        },
      ]}
      tabStyle={styles.tab}
      indicatorStyle={styles.indicator}
    />
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: '#ddd',
  },
  tab: {
    flex: 1,
  },
  indicator: {
    backgroundColor: '#007AFF',
  },
});