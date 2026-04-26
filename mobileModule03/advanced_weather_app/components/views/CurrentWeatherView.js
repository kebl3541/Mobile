import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MESSAGES } from '../../constants/Messages';
import { COLORS } from '../../constants/Colors';
import { getWeatherIcon } from '../../utils/weatherUtils';

import SkeletonLoader from '../common/SkeletonLoader';
import WeatherViewLayout from '../weather/WeatherViewLayout';
import LocationHeader from '../weather/LocationHeader';

const CurrentWeatherView = React.forwardRef(({ 
  responsive, 
  onScroll,
  forecast, 
  submittedText,
  locationLabel, 
  error,
  interactionLoading,
  forecastLoading, 
  locationLoading
}, ref) => {
  
  const renderSkeleton = () => (
    <View style={styles.mainContent}>
      <SkeletonLoader width="60%" height={24} style={{ alignSelf: 'center', marginBottom: 20 }} />
      <View style={styles.weatherIconContainer}>
        <SkeletonLoader width={100} height={100} borderRadius={50} />
      </View>
      <SkeletonLoader width="40%" height={48} style={{ alignSelf: 'center', marginVertical: 20 }} />
      <SkeletonLoader width="30%" height={20} style={{ alignSelf: 'center', marginBottom: 10 }} />
    </View>
  );

  const { middlePadH } = responsive;
  const loading = interactionLoading || locationLoading || forecastLoading;

  if (forecast && !forecast.current) {
    return (
      <View style={[styles.container, { paddingHorizontal: middlePadH }]}>
        <WeatherViewLayout
          responsive={responsive}
          forecast={forecast}
          locationLabel={locationLabel}
          submittedText={submittedText}
          ref={ref}
        >
          <Text style={[styles.statusText, styles.errorText]}>{MESSAGES.WEATHER_NOT_AVAILABLE}</Text>
        </WeatherViewLayout>
      </View>
    );
  }

  const { current } = forecast || {};
  const iconName = current ? getWeatherIcon(current.weatherCode) : null;

  return (
    <View style={[styles.container, { paddingHorizontal: middlePadH }]}>
      <WeatherViewLayout
        loading={loading}
        error={error}
        forecast={forecast}
        renderSkeleton={renderSkeleton}
        responsive={responsive}
        locationLabel={locationLabel}
        submittedText={submittedText}
        onScroll={onScroll}
        ref={ref}
      >
        <View style={styles.weatherIconContainer}>
          <Ionicons name={iconName} size={100} color={COLORS.primary} />
        </View>

        <Text style={styles.temperatureText}>{current?.temperature?.toFixed(1)}°C</Text>
        <Text style={styles.descriptionText}>{current?.description}</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="weather-windy" size={24} color={COLORS.primary} />
            <Text style={styles.detailText}>{current?.windSpeed} km/h</Text>
          </View>
        </View>
      </WeatherViewLayout>
    </View>
  );
});

export default React.memo(CurrentWeatherView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  mainContent: {
    alignItems: 'center',
    width: '100%',
  },
  locationText: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  weatherIconContainer: {
    marginVertical: 20,
    // Add a subtle glow or shadow if desired
  },
  temperatureText: {
    fontSize: 72,
    fontFamily: 'Outfit-Regular',
    color: COLORS.dark,
  },
  descriptionText: {
    fontSize: 24,
    fontFamily: 'Outfit-Medium',
    color: COLORS.gray,
    textTransform: 'capitalize',
    marginBottom: 30,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: COLORS.dark,
  },
  statusText: {
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.gray,
    paddingHorizontal: 20,
  },
  errorText: {
    color: COLORS.errorText,
  },
  errorContainer: {
    alignItems: 'center',
  }
});
