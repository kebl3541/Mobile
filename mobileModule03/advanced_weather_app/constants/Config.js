/**
 * Centralized configuration for the application.
 */
export const CONFIG = {
  API: {
    WEATHER_BASE_URL: 'https://api.open-meteo.com/v1/forecast',
    GEOCODING_BASE_URL: 'https://geocoding-api.open-meteo.com/v1/search',
  },
  DEBOUNCE_DELAY: 300,
  MAX_SUGGESTIONS: 5,
};
