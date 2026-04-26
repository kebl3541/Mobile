import { CONFIG } from '../constants/Config';

// Service to handle all weather-related API interactions.
export const weatherService = {

  // Fetches the 7-day forecast for a given set of coordinates.
  async getForecast(latitude, longitude, signal) {
    const url = `${CONFIG.API.WEATHER_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max&timezone=auto&forecast_days=10`;
    
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error('WEATHER_API_ERROR');
    }
    
    return await response.json();
  },


  // Fetches city suggestions for a given search query.
  async searchCities(query, signal) {
    const url = `${CONFIG.API.GEOCODING_BASE_URL}?name=${encodeURIComponent(query)}&count=20&language=en&format=json`;
    
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error('GEOCODING_API_ERROR');
    }
    
    const data = await response.json();
    return data.results || [];
  }
};
