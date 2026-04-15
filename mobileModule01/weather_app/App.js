import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { TabView } from 'react-native-tab-view';

import TopBar from './components/TopBar';
import BottomBar from './components/BottomBar';
import MiddleArea from './components/MiddleArea';

const tabs = [
  { key: 'currently', title: 'Currently' },
  { key: 'today', title: 'Today' },
  { key: 'weekly', title: 'Weekly' },
];

export default function App() {
  const { width } = useWindowDimensions();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [extraText, setExtraText] = useState('');

  const activeTab = tabs[selectedIndex].title;

  const renderScene = ({ route }) => (
    <MiddleArea title={route.title} extraText={extraText} />
  );

  const selectTab = (tabName) => {
    const nextIndex = tabs.findIndex((tab) => tab.title === tabName);
    if (nextIndex !== -1) {
      setSelectedIndex(nextIndex);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <TopBar extraText={extraText} setExtraText={setExtraText} />

        <TabView
          navigationState={{ index: selectedIndex, routes: tabs }}
          renderScene={renderScene}
          onIndexChange={setSelectedIndex}
          initialLayout={{ width }}
          renderTabBar={() => null}
          style={styles.tabView}
        />

        <BottomBar activeTab={activeTab} setActiveTab={selectTab} />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8cf0c18a',
  },
  tabView: {
    flex: 1,
  },
});
