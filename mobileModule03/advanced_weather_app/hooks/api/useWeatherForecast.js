import { useCallback, useRef, useState } from 'react';
import { mapRawWeatherData } from '../../utils/weatherDataMapper';
import { weatherService } from '../../services/weatherService';

const connectionLostMessage = 'The service connection is lost: please check your internet connection, or try again later';

const cache = new Map();
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

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

    // Cache key based on coordinates rounded to 2 decimals 
    const cacheKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
      setForecast({ ...cached.data, location: locationLabel });
      setError('');
      return;
    }

    const requestId = ++latestRequestId.current;
    setLoading(true);

    try {
      const data = await weatherService.getForecast(latitude, longitude);

      if (requestId !== latestRequestId.current) {
        return;
      }

      const mappedData = mapRawWeatherData(data, locationLabel);
      
      // Store in cache
      cache.set(cacheKey, {
        data: mappedData,
        timestamp: Date.now()
      });

      setError('');
      setForecast(mappedData);
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

  const checkCache = useCallback(({ latitude, longitude }) => {
    if (latitude == null || longitude == null) return false;
    const cacheKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
    const cached = cache.get(cacheKey);
    return cached && (Date.now() - cached.timestamp < CACHE_TIME);
  }, []);

  const updateForecastLabel = useCallback((newLabel) => {
    setForecast(prev => prev ? { ...prev, location: newLabel } : null);
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
    updateForecastLabel,
    checkCache,
    clearForecast,
  };
}
