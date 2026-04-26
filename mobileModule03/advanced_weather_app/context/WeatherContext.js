import React, { createContext, useContext } from 'react';
import { useWeatherManager } from '../hooks/useWeatherManager';

const WeatherContext = createContext(null);

export const WeatherProvider = ({ children }) => {
  const weatherManager = useWeatherManager();

  return (
    <WeatherContext.Provider value={weatherManager}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
