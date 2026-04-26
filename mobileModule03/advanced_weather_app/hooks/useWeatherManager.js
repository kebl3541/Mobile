import { useCallback, useState } from 'react';
import { Platform, Keyboard } from 'react-native';
import { useGeocoding } from './api/useGeocoding';
import { useWeatherForecast } from './api/useWeatherForecast';
import { useLocation } from './api/useLocation';
import {
  buildLocationLabel, 
  isExactCityMatch, 
  buildResolvedLocationLabel,
  checkConnectivity
} from '../utils/weatherUtils';
import { MESSAGES } from '../constants/Messages';

export function useWeatherManager() {
  const {
    searchInput,
    setSearchInput,
    submittedText,
    submitText,
    suggestions,
    clearSuggestions,
    searchCities,
    suppressNextSearch,
    cancelPendingSearch,
    setGeocodingError,
    error: geocodingError,
    reverseGeocodeCoordinates,
  } = useGeocoding();

  const {
    forecast,
    loading: forecastLoading,
    error: forecastError,
    fetchForecast,
    updateForecastLabel,
    checkCache,
    clearForecast,
  } = useWeatherForecast();

  const {
    location,
    setLocation,
    locationLabel,
    setLocationLabel,
    errorMsg: locationError,
    loading: locationLoading,
    getLocation,
    cancelPendingLocation,
    clearLocationError,
  } = useLocation();

  const resolveLocationLabelFromCoords = useCallback(async (coords) => {
    if (locationLabel) return locationLabel;

    const place = await reverseGeocodeCoordinates({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    return buildResolvedLocationLabel(place, coords.latitude, coords.longitude);
  }, [locationLabel, reverseGeocodeCoordinates]);

  const loadForecastForPlace = useCallback(async (place) => {
    const label = buildLocationLabel(place);
    if (label) submitText(label);

    await fetchForecast({
      latitude: place.latitude,
      longitude: place.longitude,
      locationLabel: label || submittedText || 'Selected location',
    });
  }, [fetchForecast, submitText, submittedText]);

  const resolveCityMatch = useCallback(async (query) => {
    const exactMatchFromSuggestions = suggestions.find((place) => isExactCityMatch(place, query));
    if (exactMatchFromSuggestions) {
      return { match: exactMatchFromSuggestions, isConnectionLost: false };
    }

    const searchResults = await searchCities(query, { silent: true });
    if (searchResults === null) return { match: null, isConnectionLost: true };
    if (!searchResults || searchResults.length === 0) return { match: null, isConnectionLost: false };

    const exactMatchFromResults = searchResults.find((place) => isExactCityMatch(place, query));
    return {
      match: exactMatchFromResults || searchResults[0],
      isConnectionLost: false,
    }; 
  }, [suggestions, searchCities]);

  const [interactionLoading, setInteractionLoading] = useState(false);

  const resetErrors = useCallback(() => {
    setGeocodingError('');
    clearLocationError();
  }, [setGeocodingError, clearLocationError]);

  const error = (geocodingError === MESSAGES.CONNECTION_LOST || forecastError === MESSAGES.CONNECTION_LOST)
    ? MESSAGES.CONNECTION_LOST
    : (geocodingError || locationError || forecastError);

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();
    const isOnline = await checkConnectivity();
    if (!isOnline) {
      resetErrors();
      clearForecast();
      setLocation(null);
      setLocationLabel('');
      setGeocodingError(MESSAGES.CONNECTION_LOST);
      return;
    }

    const normalizedQuery = searchInput.trim();
    if (normalizedQuery.length === 0) {
      resetErrors();
      clearForecast();
      setLocation(null);
      setLocationLabel('');
      setGeocodingError(MESSAGES.EMPTY_SEARCH);
      return;
    }

    // if there's an exact match in suggestions and it's cached, don't show loading
    const exactMatch = suggestions.find((place) => isExactCityMatch(place, normalizedQuery));
    if (exactMatch && checkCache(exactMatch)) {
      resetErrors();
      await loadForecastForPlace(exactMatch);
      return;
    }

    // Start loading instantly
    setInteractionLoading(true);
    try {
      cancelPendingSearch();
      cancelPendingLocation();
      resetErrors();
      clearSuggestions({ clearError: false });
      clearForecast();
      setLocation(null);
      setLocationLabel('');

      const { match: matchFromApi, isConnectionLost } = await resolveCityMatch(normalizedQuery);

      if (isConnectionLost) {
        setGeocodingError(MESSAGES.CONNECTION_LOST);
        return;
      }

      if (!matchFromApi) {
        setGeocodingError(MESSAGES.INVALID_CITY);
        return;
      }

      await loadForecastForPlace(matchFromApi);
    } finally {
      setInteractionLoading(false);
    }
  }, [cancelPendingSearch, cancelPendingLocation, resetErrors, searchInput, resolveCityMatch, submitText, setGeocodingError, loadForecastForPlace, suggestions, checkCache]);

  const handleSuggestionPress = useCallback(async (suggestion) => {
    // Clear suggestions and update search input immediately for responsiveness
    clearSuggestions();
    setSearchInput(suggestion.name);
    Keyboard.dismiss();

    const isCached = checkCache(suggestion);
    if (!isCached) setInteractionLoading(true);
    
    try {
      resetErrors();
      suppressNextSearch();
      await loadForecastForPlace(suggestion);
    } finally {
      setInteractionLoading(false);
    }
  }, [resetErrors, suppressNextSearch, setSearchInput, loadForecastForPlace, clearSuggestions, checkCache]);

  const handleGeolocationPress = useCallback(async () => {
    Keyboard.dismiss();
    setInteractionLoading(true);
    try {
      resetErrors();
      submitText('');
      clearSuggestions({ clearError: false });
      clearForecast();
      setLocation(null);
      setLocationLabel('');

      const isOnline = await checkConnectivity();
      if (!isOnline) {
        setGeocodingError(MESSAGES.CONNECTION_LOST);
        return;
      }

      const freshLocation = await getLocation();
      if (!freshLocation) return;
      
      const coordsToUse = freshLocation.coords;
      
      await fetchForecast({
        latitude: coordsToUse.latitude,
        longitude: coordsToUse.longitude,
        locationLabel: '', 
      });
    } finally {
      setInteractionLoading(false);
    }
  }, [resetErrors, clearSuggestions, clearForecast, setLocation, setLocationLabel, getLocation, fetchForecast, setGeocodingError]);

  const handleFocus = useCallback(() => {
    setSearchInput('');
  }, [setSearchInput]);

  return {
    // State
    searchInput,
    setSearchInput,
    submittedText,
    suggestions,
    forecast,
    forecastLoading,
    location,
    locationLabel,
    locationLoading,
    interactionLoading,
    error,
    geocodingError,
    locationError,
    forecastError,
    // Actions
    handleSubmit,
    handleSuggestionPress,
    handleGeolocationPress,
    handleFocus,
    resolveLocationLabelFromCoords,
    fetchForecast,
    updateForecastLabel,
    setGeocodingError,
    submitText
  };
}
