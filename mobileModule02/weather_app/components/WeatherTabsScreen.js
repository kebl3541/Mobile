import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';

import TopBar from './TopBar';
import BottomBar from './BottomBar';
import MiddleArea from './MiddleArea';
import { getResponsiveSizes } from '../utils/responsive';
import { useWeatherSearch } from '../hooks/useWeatherSearch';
import { renderWeatherTabIcon, weatherTabs } from '../constants/weatherTabs';

export default function WeatherTabsScreen() {
  const { width, height } = useWindowDimensions();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {
    inputText,
    setInputText,
    submittedText,
    submitText,
    handleGeolocationPress,
  } = useWeatherSearch();

  const responsive = getResponsiveSizes(width, height);

  const handleSubmit = () => {
    submitText(inputText);
  };

  const renderScene = ({ route }) => (
    <MiddleArea
      title={route.title}
      extraText={submittedText}
      responsive={responsive}
    />
  );

  return (
    <>
      <TopBar
        inputText={inputText}
        setInputText={setInputText}
        onSubmitEditing={handleSubmit}
        onGeolocationPress={handleGeolocationPress}
        responsive={responsive}
      />

      <TabView
        navigationState={{ index: selectedIndex, routes: weatherTabs }}
        commonOptions={{
          icon: renderWeatherTabIcon,
        }}
        renderScene={renderScene}
        onIndexChange={setSelectedIndex}
        initialLayout={{ width }}
        renderTabBar={(props) => (
          <BottomBar {...props} responsive={responsive} />
        )}
        tabBarPosition="bottom"
      />
    </>
  );
}