// SCREEN CONTROLLER

import React, { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';

import TopBar from './TopBar';
import BottomBar from './BottomBar';
import MiddleArea from './MiddleArea';
import { getResponsiveSizes } from '../utils/responsive';
import { useWeatherSearch } from '../hooks/useWeatherSearch';
import { useGeocoding } from '../hooks/useGeocoding';
import { useWeatherForecast } from '../hooks/useWeatherForecast';
import { renderWeatherTabIcon, weatherTabs } from '../constants/weatherTabs';
import { useLocation } from '../hooks/useLocation';

function buildLocationLabel(place) {
  return [place?.name, place?.region, place?.country].filter(Boolean).join(', ');
}

const connectionLostMessage = 'The service connection is lost, please check your internet connection or try again later';

function normalizeText(value) {
  return (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function formatCoordinates(location) {
  if (!location) {
    return '';
  }

  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
}

function isExactCityMatch(place, query) {
  const normalizedQuery = normalizeText(query);
  const normalizedName = normalizeText(place?.name);
  const normalizedLabel = normalizeText(buildLocationLabel(place));

  return normalizedQuery === normalizedName || normalizedQuery === normalizedLabel;
}

function buildResolvedLocationLabel(place, latitude, longitude) {
  return buildLocationLabel({
    name: place?.name || place?.city || 'Current location',
    region: place?.admin1 || place?.region || '',
    country: place?.country || '',
  }) || `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
}

function formatHour(time) {
  if (!time) {
    return '--:--';
  }

  return time.slice(11, 16);
}

function formatDate(date) {
  if (!date) {
    return '--';
  }

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function buildCurrentText(forecast, submittedText, location, geocodingError, forecastLoading, forecastError, locationLoading, locationError) {
  if (locationLoading && !forecast && !submittedText) {
    return 'Fetching location...';
  }

  if ((geocodingError === connectionLostMessage || forecastError === connectionLostMessage) && !forecast) {
    return connectionLostMessage;
  }

  if (geocodingError && !forecast) {
    return geocodingError;
  }

  if (forecastError && !forecast) {
    return forecastError;
  }

  if (locationError && !forecast && !submittedText) {
    return locationError;
  }

  if (forecastLoading && !forecast) {
    return 'Fetching weather...';
  }

  if (!forecast) {
    if (submittedText) {
      return submittedText;
    }

    if (location) {
      return `Currently ${formatCoordinates(location)}`;
    }

    return 'Search for a city to see weather.';
  }

  if (!forecast.current) {
    return `${forecast.location}\nCurrent weather data is not available.`;
  }

  return [
    `LOCATION`,
    `${forecast.location}`,
    '',
    `TEMPERATURE`,
    `${forecast.current.temperature} °C`,
    '',
    `WEATHER`,
    `${forecast.current.description}`,
    '',
    `WIND SPEED`,
    `${forecast.current.windSpeed} km/h`,
  ].join('\n');
}

function buildTodayText(forecast, submittedText, geocodingError, forecastLoading, forecastError, locationLoading, locationError) {
  if (locationLoading && !forecast && !submittedText) {
    return 'Fetching location...';
  }

  if ((geocodingError === connectionLostMessage || forecastError === connectionLostMessage) && !forecast) {
    return connectionLostMessage;
  }

  if (geocodingError && !forecast) {
    return geocodingError;
  }

  if (forecastError && !forecast) {
    return forecastError;
  }

  if (locationError && !forecast && !submittedText) {
    return locationError;
  }

  if (forecastLoading && !forecast) {
    return 'Fetching weather...';
  }

  if (!forecast) {
    return submittedText || 'Search for a city to see today\'s weather.';
  }

  const items = (forecast.hourly || []).slice(0, 24).map((item) => (
    `${formatHour(item.time)}\n${item.temperature} °C  •  ${item.description}  •  ${item.windSpeed} km/h`
  ));

  return [
    `LOCATION`,
    `${forecast.location}`,
    '',
    ...(items.length > 0 ? items.flatMap((item) => [item, '']) : ['No hourly weather data available.']),
  ].join('\n');
}

function buildWeeklyText(forecast, submittedText, geocodingError, forecastLoading, forecastError, locationLoading, locationError) {
  if (locationLoading && !forecast && !submittedText) {
    return 'Fetching location...';
  }

  if ((geocodingError === connectionLostMessage || forecastError === connectionLostMessage) && !forecast) {
    return connectionLostMessage;
  }

  if (geocodingError && !forecast) {
    return geocodingError;
  }

  if (forecastError && !forecast) {
    return forecastError;
  }

  if (locationError && !forecast && !submittedText) {
    return locationError;
  }

  if (forecastLoading && !forecast) {
    return 'Fetching weather...';
  }

  if (!forecast) {
    return submittedText || 'Search for a city to see weekly weather.';
  }

  const items = (forecast.daily || []).slice(0, 7).map((item) => (
    `${formatDate(item.date)}\nmin ${item.tempMin} °C  •  max ${item.tempMax} °C  •  ${item.description}`
  ));

  return [
    `LOCATION`,
    `${forecast.location}`,
    '',
    ...(items.length > 0 ? items.flatMap((item) => [item, '']) : ['No weekly weather data available.']),
  ].join('\n');
}

function isErrorMessage(message) {
  return [
    'Permission to access location was denied',
    'Geolocation is not available, please enable it in your App settings',
    'Could not find any result for the supplied address or coordinates',
    'The service connection is lost, please check your internet connection or try again later',
    'Error getting location:',
    'Failed to fetch forecast',
  ].some((part) => (message || '').includes(part));
}

export default function WeatherTabsScreen() {
  const { width, height } = useWindowDimensions();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {
    submittedText,
    submitText,
  } = useWeatherSearch();
  const {
    searchInput,
    setSearchInput,
    suggestions,
    clearSuggestions,
    searchCities,
    suppressNextSearch,
    cancelPendingSearch,
    setGeocodingError,
    error: geocodingError,
  } = useGeocoding();
  const {
    forecast,
    loading: forecastLoading,
    error: forecastError,
    fetchForecast,
    clearForecast,
  } = useWeatherForecast();
  const {
    location,
    errorMsg: locationError,
    loading: locationLoading,
    getLocation,
    clearLocationError,
  } = useLocation();

  const responsive = getResponsiveSizes(width, height);
  const showPermissionCta =
    Platform.OS === 'web' &&
    !location &&
    !forecast &&
    !submittedText &&
    !locationLoading;

  const loadForecastForPlace = async (place) => {
    const label = buildLocationLabel(place);

    if (label) {
      submitText(label);
    }

    await fetchForecast({
      latitude: place.latitude,
      longitude: place.longitude,
      locationLabel: label || submittedText || 'Selected location',
    });
  };

  const setInvalidCityState = (message) => {
    submitText('');
    clearForecast();
    setGeocodingError(message);
    clearSuggestions({ clearError: false });
  };

  const resolveCityMatch = async (query) => {
    const exactMatchFromSuggestions = suggestions.find((place) => isExactCityMatch(place, query));

    if (exactMatchFromSuggestions) {
      return { match: exactMatchFromSuggestions, isConnectionLost: false };
    }

    const searchResults = await searchCities(query);

    if (searchResults === null) {
      return { match: null, isConnectionLost: true };
    }

    return {
      match: searchResults?.find((place) => isExactCityMatch(place, query)) || null,
      isConnectionLost: false,
    };
  };

  const handleSubmit = async () => {
    cancelPendingSearch();

    const normalizedQuery = searchInput.trim();
    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;

    if (normalizedQuery.length < 2) {
      if (isOffline) {
        submitText('');
        clearForecast();
        setGeocodingError(connectionLostMessage);
        clearSuggestions({ clearError: false });
        return;
      }

      setInvalidCityState('Could not find any result for the supplied address or coordinates');
      return;
    }

    const { match: exactMatch, isConnectionLost } = await resolveCityMatch(normalizedQuery);

    if (isConnectionLost) {
      submitText('');
      clearForecast();
      setGeocodingError(connectionLostMessage);
      clearSuggestions({ clearError: false });
      return;
    }

    if (!exactMatch) {
      setInvalidCityState('Could not find any result for the supplied address or coordinates');
      return;
    }

    await loadForecastForPlace(exactMatch);
    clearSuggestions({ clearError: false });
  };

  const handleSuggestionPress = async (suggestion) => {
    suppressNextSearch();
    setSearchInput(suggestion.name);
    await loadForecastForPlace(suggestion);
    clearSuggestions();
  };

  const handleGeolocationPress = async () => {
    clearLocationError();
    clearSuggestions({ clearError: false });

    const previousLocation = location;
    const freshLocation = await getLocation();
    const coordsToUse = freshLocation || previousLocation;

    if (!coordsToUse) {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        clearLocationError();
        setGeocodingError(connectionLostMessage);
      }
      return;
    }

    setGeocodingError('');
    submitText('');
    await fetchForecast({
      latitude: coordsToUse.latitude,
      longitude: coordsToUse.longitude,
      locationLabel: `Currently ${formatCoordinates(coordsToUse)}`,
    });
  };

  useEffect(() => {
    if (!location) {
      return;
    }

    const loadFromLocation = async () => {
      submitText('');
      setGeocodingError('');
      await fetchForecast({
        latitude: location.latitude,
        longitude: location.longitude,
        locationLabel: `Currently ${formatCoordinates(location)}`,
      });
    };

    loadFromLocation();
  }, [location, fetchForecast, setGeocodingError, submitText]);

  const renderScene = ({ route }) => {
    let extraText = '';

    if (route.key === 'current') {
      extraText = buildCurrentText(
        forecast,
        submittedText,
        location,
        geocodingError,
        forecastLoading,
        forecastError,
        locationLoading,
        locationError,
      );
    } else if (route.key === 'today') {
      extraText = buildTodayText(
        forecast,
        submittedText,
        geocodingError,
        forecastLoading,
        forecastError,
        locationLoading,
        locationError,
      );
    } else {
      extraText = buildWeeklyText(
        forecast,
        submittedText,
        geocodingError,
        forecastLoading,
        forecastError,
        locationLoading,
        locationError,
      );
    }

    const tone = isErrorMessage(extraText) ? 'error' : 'default';

    return (
      <MiddleArea
        title={route.title}
        extraText={extraText}
        tone={tone}
        responsive={responsive}
      />
    );
  };

  return (
    <>
      <TopBar
        inputText={searchInput}
        setInputText={setSearchInput}
        onSubmitEditing={handleSubmit}
        onGeolocationPress={handleGeolocationPress}
        geolocationLoading={locationLoading}
        suggestions={suggestions}
        onSuggestionPress={handleSuggestionPress}
        showPermissionCta={showPermissionCta}
        onPermissionPress={handleGeolocationPress}
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