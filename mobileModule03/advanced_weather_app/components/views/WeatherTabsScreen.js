import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, Keyboard, FlatList, Pressable, Text, Platform } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../constants/Colors';

import {
  TopBar, 
  BottomBar, 
  CurrentWeatherView, 
  TodayWeatherView, 
  WeeklyWeatherView 
} from './index';
import { LocationHeader } from '../weather';

import { getResponsiveSizes } from '../../utils/responsive';
import { useWeather } from '../../context/WeatherContext';
import { renderWeatherTabIcon, weatherTabs } from '../../constants/weatherTabs';
import { isErrorMessage } from '../../utils/weatherUtils';
import { ERROR_SNIPPETS, MESSAGES } from '../../constants/Messages';

export default function WeatherTabsScreen() {
  const { width, height } = useWindowDimensions();
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const {
    searchInput,
    setSearchInput,
    suggestions,
    location,
    locationLabel,
    forecast,
    error,
    geocodingError,
    locationError,
    forecastError,
    handleSubmit,
    handleSuggestionPress,
    handleGeolocationPress,
    handleFocus,
    locationLoading,
    submitText,
    fetchForecast,
    setGeocodingError,
    resolveLocationLabelFromCoords,
    submittedText,
    interactionLoading,
    forecastLoading
  } = useWeather();

  const responsive = useMemo(() => getResponsiveSizes(width, height), [width, height]);

  useEffect(() => {
    if (!location) return;

    const loadFromLocation = async () => {
      submitText('');
      setGeocodingError('');
      const resolvedLabel = await resolveLocationLabelFromCoords(location);
      await fetchForecast({
        latitude: location.latitude,
        longitude: location.longitude,
        locationLabel: resolvedLabel,
      });
    };

    loadFromLocation();
  }, [location, fetchForecast, setGeocodingError, submitText, resolveLocationLabelFromCoords]);

  const sharedScrollY = React.useRef(0);
  const currentRef = React.useRef(null);
  const todayRef = React.useRef(null);
  const weeklyRef = React.useRef(null);
  const isSyncing = React.useRef(false);

  const handleScroll = React.useCallback((event) => {
    // Only track the current scroll position for the active tab
    const y = event.nativeEvent.contentOffset.y;
    sharedScrollY.current = y;
  }, []);

  useEffect(() => {
    // Sync the new tab to the shared scroll position when it becomes active
    const timeout = setTimeout(() => {
      const targetRef = selectedIndex === 0 ? currentRef : selectedIndex === 1 ? todayRef : weeklyRef;
      if (targetRef.current && targetRef.current.scrollTo) {
        isSyncing.current = true;
        targetRef.current.scrollTo({ y: sharedScrollY.current, animated: false });
        requestAnimationFrame(() => { isSyncing.current = false; });
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [selectedIndex]);

  const commonProps = {
    forecast,
    submittedText,
    locationLabel,
    error,
    interactionLoading,
    forecastLoading,
    locationLoading
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'current':
        return (
          <CurrentWeatherView 
            responsive={responsive} 
            onScroll={handleScroll}
            scrollRef={currentRef}
            {...commonProps}
          />
        );
      case 'today':
        return (
          <TodayWeatherView 
            responsive={responsive} 
            onScroll={handleScroll}
            scrollRef={todayRef}
            {...commonProps}
          />
        );
      case 'weekly':
        return (
          <WeeklyWeatherView 
            responsive={responsive} 
            onScroll={handleScroll}
            scrollRef={weeklyRef}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  const [headerHeight, setHeaderHeight] = useState(0);
  const handleHeaderLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  return (
    <View style={styles.container}>
      {/* Weather Content rendered first in JSX */}
      <View style={[styles.tabViewContainer, { paddingTop: headerHeight }]}>
        <TabView
          navigationState={{ index: selectedIndex, routes: weatherTabs }}
          commonOptions={{
            icon: renderWeatherTabIcon,
          }}
          renderScene={renderScene}
          onIndexChange={(index) => {
            Keyboard.dismiss();
            setSelectedIndex(index);
          }}
          initialLayout={{ width }}
          lazy={true}
          lazyPreloadDistance={0}
          renderTabBar={(props) => {
            const { pointerEvents: _ignored, ...cleanProps } = props;
            return <BottomBar {...cleanProps} responsive={responsive} />;
          }}
          tabBarPosition="bottom"
        />
      </View>

      {/* Header Area rendered last in JSX to ensure it stays on top on iOS */}
      <View style={styles.topWrapper} pointerEvents="box-none">
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0)']}
          style={styles.topSection}
          pointerEvents="box-none"
          onLayout={handleHeaderLayout}
        >
          <TopBar
            inputText={searchInput}
            setInputText={setSearchInput}
            onSubmitEditing={handleSubmit}
            onGeolocationPress={handleGeolocationPress}
            geolocationLoading={locationLoading}
            suggestions={suggestions}
            onSuggestionPress={handleSuggestionPress}
            onFocus={handleFocus}
            responsive={responsive}
          />

          <LocationHeader 
            label={forecast?.location || locationLabel || submittedText} 
            error={!forecast && (geocodingError || locationError || forecastError)}
            responsive={responsive} 
          />
        </LinearGradient>

      {/* Render suggestions at the very end of the topWrapper siblings */}
      {suggestions.length > 0 && (
        <View
          style={[
            styles.suggestionsContainer,
            {
              top: Math.max(responsive.topBarFont + responsive.topBarPadV * 2 + 8, 48) + (responsive.topBarPadV * 1.5) + 5,
              marginHorizontal: responsive.topBarPadH,
            },
          ]}
        >
          <View style={styles.suggestionsList}>
            {suggestions.slice(0, 5).map((item, index) => (
              <Pressable
                key={`suggest-${index}`}
                onPress={() => {
                  Keyboard.dismiss();
                  handleSuggestionPress(item);
                }}
                style={({ pressed }) => [
                  styles.suggestionItem,
                  pressed && styles.suggestionItemPressed,
                ]}
              >
                <Ionicons name="map-outline" size={16} color={COLORS.primary} style={styles.suggestionIcon} />
                <View>
                  <Text style={styles.suggestionTitle}>{item.name}</Text>
                  <Text style={styles.suggestionSubtitle}>
                    {[item.region, item.country].filter(Boolean).join(', ')}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    zIndex: 999999,
    overflow: 'visible',
  },
  topSection: {
    width: '100%',
    overflow: 'visible',
  },
  tabViewContainer: {
    flex: 1,
    overflow: 'hidden',
    zIndex: 1,
  },
  suggestionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
      }
    }),
    zIndex: 99999,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  suggestionItemPressed: {
    backgroundColor: '#F2F2F7',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: COLORS.dark,
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: 'Outfit-Medium',
    marginTop: 2,
  },
});