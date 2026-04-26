export function getWeatherDescription(code) {
  const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return weatherCodes[code] || 'Unknown';
}

// Maps raw Open-Meteo API response to the application's internal weather format
export function mapRawWeatherData(data, locationLabel) {
  if (!data) return null;

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
    windSpeed: data.daily.wind_speed_10m_max?.[index],
  })) ?? [];

  return {
    location: locationLabel,
    current: data.current ? {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      description: getWeatherDescription(data.current.weather_code),
      windSpeed: data.current.wind_speed_10m,
    } : null,
    hourly,
    daily,
  };
}
