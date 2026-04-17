import { useCallback, useRef, useState } from 'react';

const connectionLostMessage = 'The service connection is lost, please check your internet connection or try again later';

function getWeatherDescription(code) {
  switch (code) {
    case 0:
      return 'Clear sky';
    case 1:
    case 2:
    case 3:
      return 'Partly cloudy';
    case 45:
    case 48:
      return 'Fog';
    case 51:
    case 53:
    case 55:
      return 'Drizzle';
    case 56:
    case 57:
      return 'Freezing drizzle';
    case 61:
    case 63:
    case 65:
      return 'Rain';
    case 66:
    case 67:
      return 'Freezing rain';
    case 71:
    case 73:
    case 75:
      return 'Snow';
    case 77:
      return 'Snow grains';
    case 80:
    case 81:
    case 82:
      return 'Rain showers';
    case 85:
    case 86:
      return 'Snow showers';
    case 95:
      return 'Thunderstorm';
    case 96:
    case 99:
      return 'Thunderstorm with hail';
    default:
      return 'Unknown';
  }
}

export function useWeatherForecast() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const latestRequestId = useRef(0);

  const fetchForecast = useCallback(async ({ latitude, longitude, locationLabel }) => {
    if (latitude == null || longitude == null) {
      setForecast(null);
      setError('Missing coordinates');
      return;
    }

    const requestId = ++latestRequestId.current;
    setLoading(true);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch forecast');
      }

      const data = await response.json();

      if (requestId !== latestRequestId.current) {
        return;
      }

      setError('');

      const hourly = data.hourly?.time?.map((time, index) => ({
        time,
        temperature: data.hourly.temperature_2m?.[index],
        weatherCode: data.hourly.weather_code?.[index],
        description: getWeatherDescription(data.hourly.weather_code?.[index]),
        windSpeed: data.hourly.wind_speed_10m?.[index],
      })) ?? [];

      const daily = data.daily?.time?.map((date, index) => ({
        date,
        tempMax: data.daily.temperature_2m_max?.[index],
        tempMin: data.daily.temperature_2m_min?.[index],
        weatherCode: data.daily.weather_code?.[index],
        description: getWeatherDescription(data.daily.weather_code?.[index]),
      })) ?? [];

      setForecast({
        location: locationLabel,
        current: data.current ? {
          temperature: data.current.temperature_2m,
          weatherCode: data.current.weather_code,
          description: getWeatherDescription(data.current.weather_code),
          windSpeed: data.current.wind_speed_10m,
        } : null,
        hourly,
        daily,
      });
    } catch (err) {
      if (requestId !== latestRequestId.current) {
        return;
      }

      setForecast(null);
      setError(connectionLostMessage);
    } finally {
      if (requestId !== latestRequestId.current) {
        return;
      }

      setLoading(false);
    }
  }, []);

  const clearForecast = useCallback(() => {
    latestRequestId.current += 1;
    setForecast(null);
    setError('');
    setLoading(false);
  }, []);

  return {
    forecast,
    loading,
    error,
    fetchForecast,
    clearForecast,
  };
}
