import * as Network from 'expo-network';

/**
 * Utility functions for weather data formatting and location handling.
 */

export function buildLocationLabel(place) {
  if (!place) return '';

  const clean = (val) => {
    if (!val) return '';
    let c = val.toString().trim();
    
    // Remove common administrative prefixes/suffixes
    const wordsToRemove = [
      /Bezirk/gi, /District/gi, /Administrative/gi, /Region/gi, 
      /Province/gi, /State of/gi, /City of/gi, /Town of/gi, /Landkreis/gi
    ];
    
    wordsToRemove.forEach(regex => {
      c = c.replace(regex, '');
    });

    // Remove numbers (postal codes, street numbers)
    c = c.replace(/\d+/g, '');

    // Remove leading/trailing punctuation and extra whitespace
    c = c.replace(/^[\s,.-]+|[\s,.-]+$/g, '').trim();
    return c;
  };

  const p1 = clean(place?.name || place?.city || place?.locality);
  let p2 = clean(place?.region || place?.subregion || place?.district);
  
  // if no region info was found, repeat the city name as the region
  if (!p2 && p1) {
    p2 = p1;
  }
  
  const p3 = clean(place?.country);

  const result = [];
  if (p1.length >= 2) result.push(p1);
  if (p2.length >= 2) result.push(p2);
  if (p3.length >= 2) result.push(p3);

  return result.join(', ');
}

export function normalizeText(value) {
  return (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function formatCoordinates(location) {
  if (!location) {
    return '';
  }
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
}

export function isExactCityMatch(place, query) {
  const normalizedQuery = normalizeText(query);
  const normalizedName = normalizeText(place?.name);
  const normalizedLabel = normalizeText(buildLocationLabel(place));

  return normalizedQuery === normalizedName || normalizedQuery === normalizedLabel;
}

export function buildResolvedLocationLabel(place, latitude, longitude) {
  if (!place) return '';
  return buildLocationLabel(place);
}

export function formatHour(time) {
  if (!time) {
    return '--:--';
  }
  const hour = parseInt(time.slice(11, 13), 10);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 || 12;
  return `${hour12}:00 ${ampm}`;
}

export function formatHour24(time) {
  if (!time) return '';
  return time.slice(11, 13); // Returns only "HH"
}

export function formatDate(date) {
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

export function isErrorMessage(message, errorMessages) {
  return errorMessages.some((part) => (message || '').includes(part));
}

export function getWeatherIcon(code) {
  // Mapping Open-Meteo codes to Ionicons names
  switch (code) {
    case 0: // Clear sky
      return 'sunny';
    case 1:
    case 2:
    case 3: // Partly cloudy
      return 'partly-sunny';
    case 45:
    case 48: // Fog
      return 'cloudy';
    case 51:
    case 53:
    case 55: // Drizzle
    case 56:
    case 57: // Freezing drizzle
    case 61:
    case 63:
    case 65: // Rain
    case 66:
    case 67: // Freezing rain
    case 80:
    case 81:
    case 82: // Rain showers
      return 'rainy';
    case 71:
    case 73:
    case 75: // Snow
    case 77: // Snow grains
    case 85:
    case 86: // Snow showers
      return 'snow';
    case 95: // Thunderstorm
    case 96:
    case 99: // Thunderstorm with hail
      return 'thunderstorm';
    default:
      return 'help-circle-outline';
  }
}

/**
 * Checks if the device has internet connectivity by attempting a lightweight fetch.
 * Returns true if online, false if offline.
 */
export async function checkConnectivity() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return false;
  }

  try {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected;
  } catch (e) {
    return false;
  }
}
