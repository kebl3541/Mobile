// GPS MANAGER  
// Handles GPS permission and coordinate fetching

import { useState, useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { MESSAGES } from '../../constants/Messages';
import { buildLocationLabel } from '../../utils/weatherUtils';

export function useLocation() {

  const [location, setLocation] = useState(null); // stores coordinates 
  const [locationLabel, setLocationLabel] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false); // lets the UI know that asking for location

  const latestRequestId = useRef(0);

  const cancelPendingLocation = useCallback(() => {
    latestRequestId.current += 1;
    setLoading(false);
  }, []);

  const clearLocationError = useCallback(() => {
    setErrorMsg(null);
  }, []);

  const isOffline = useCallback(() => {
    if (Platform.OS === 'web') {
      return typeof navigator !== 'undefined' && !navigator.onLine;
    }
    // On native, we'd ideally use NetInfo, but for now we can rely on fetch failures 
    // handled elsewhere or add a simple check if needed.
    return false;
  }, []);

  const formatCoordinatesLabel = useCallback((coords) => {
    if (!coords) {
      return '';
    }

    return `Lat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)}`;
  }, []);


  const getNearestPlace = useCallback((places, coords) => {
    if (!Array.isArray(places) || places.length === 0 || !coords) {
      return null;
    }

    let nearest = places[0];
    let smallestDistance = Number.POSITIVE_INFINITY;

    places.forEach((place) => {
      const latDiff = (place.latitude || 0) - coords.latitude;
      const lonDiff = (place.longitude || 0) - coords.longitude;
      const distance = latDiff * latDiff + lonDiff * lonDiff;

      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearest = place;
      }
    });

    return nearest;
  }, []);

  const resolveWebLocationLabel = useCallback(async (coords) => {
    const timezone = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || '';
    const timezoneCityToken = timezone.split('/').pop()?.replace(/_/g, ' ').trim();

    if (!timezoneCityToken) {
      return formatCoordinatesLabel(coords);
    }

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(timezoneCityToken)}&count=10&language=en&format=json`
      );

      if (!response.ok) {
        return formatCoordinatesLabel(coords);
      }

      const data = await response.json();
      const nearest = getNearestPlace(data?.results || [], coords);

      if (!nearest) {
        return formatCoordinatesLabel(coords);
      }

      const label = buildLocationLabel({
        city: nearest.name,
        region: nearest.admin1 || '',
        country: nearest.country || '',
      });

      return label || formatCoordinatesLabel(coords);
    } catch (error) {
      return formatCoordinatesLabel(coords);
    }
  }, [buildLocationLabel, formatCoordinatesLabel, getNearestPlace]);

  const resolveReadableLocationLabel = useCallback(async (coords) => {
    // Try Open-Meteo geocoding API first (consistent admin data for city-states)
    const openMeteoLabel = await resolveWebLocationLabel(coords);
    
    // If Open-Meteo returned a real city name (not just coordinates), use it
    if (openMeteoLabel && !openMeteoLabel.startsWith('Lat:')) {
      return openMeteoLabel;
    }
    
    // Fallback for native: use expo-location's reverse geocode
    if (Platform.OS !== 'web' && typeof Location.reverseGeocodeAsync === 'function') {
      try {
        const results = await Location.reverseGeocodeAsync(coords);
        const firstResult = results?.[0];
        if (firstResult) {
          const label = buildLocationLabel({
            name: firstResult.city || firstResult.name,
            region: firstResult.region || firstResult.city || firstResult.name,
            country: firstResult.country,
          });
          if (label) return label;
        }
      } catch (e) {
        // Fall through to coordinates
      }
    }

    return openMeteoLabel || formatCoordinatesLabel(coords);
  }, [resolveWebLocationLabel, buildLocationLabel, formatCoordinatesLabel]);

  // Ask permission & fetch coordinates
  const getLocation = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    setLoading(true);

    try {
      if (isOffline()) {
        if (requestId === latestRequestId.current) {
          setErrorMsg(MESSAGES.CONNECTION_LOST);
          setLoading(false);
        }
        return null;
      }

      if (Platform.OS === 'web') {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
          if (requestId === latestRequestId.current) {
            setErrorMsg('Geolocation is not available, please enable it in your App settings');
            setLoading(false);
          }
          return null;
        }

        // Extra check for permission status on Web if available
        if (navigator.permissions) {
          try {
            const status = await navigator.permissions.query({ name: 'geolocation' });
            if (status.state === 'denied') {
              if (requestId === latestRequestId.current) {
                setErrorMsg('Geolocation is not available, please enable it in your App settings');
                setLoading(false);
              }
              return null;
            }
          } catch (e) {
            // Permissions API might not be supported for 'geolocation' in all browsers
          }
        }

        const webCoords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
            (error) => reject(error),
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
          );
        });

        if (requestId !== latestRequestId.current) return null;

        setErrorMsg(null);
        setLocation(webCoords);
        // Resolve label in background
        resolveReadableLocationLabel(webCoords).then(readableLabel => {
          if (requestId === latestRequestId.current) {
            setLocationLabel(readableLabel);
          }
        });

        return { coords: webCoords, label: '' };
      }

      // 1. Check if we already have permissions (faster than requesting)
      let permissionResponse = await Location.getForegroundPermissionsAsync();
      if (permissionResponse.status !== 'granted') {
        permissionResponse = await Location.requestForegroundPermissionsAsync();
      }

      if (requestId !== latestRequestId.current) return null;

      if (permissionResponse.status !== 'granted') {
        setErrorMsg(permissionResponse.canAskAgain ? 'Geolocation is not available, please enable it in your App settings' : 'Location permission is blocked. Please enable it in your App settings.');
        setLocation(null);
        return null;
      }

      setErrorMsg(null);
      
      // 2. Try to get last known position (extremely fast)
      let currentLocation = null;
      try {
        currentLocation = await Location.getLastKnownPositionAsync({});
        if (currentLocation && requestId === latestRequestId.current) {
          const coords = currentLocation.coords;
          setLocation(coords);
          
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
            .then(freshLocation => {
              if (requestId === latestRequestId.current) {
                setLocation(freshLocation.coords);
                resolveReadableLocationLabel(freshLocation.coords).then(label => {
                  if (requestId === latestRequestId.current) setLocationLabel(label);
                });
              }
            });

          return { coords, label: '' };
        }
      } catch (e) {
        // Last known failed, proceed to fresh fetch
      }

      // 3. Fallback to fresh fetch if no last known
      if (!currentLocation) {
        currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }

      if (requestId !== latestRequestId.current) return null;

      const coords = currentLocation.coords;
      setLocation(coords);
      
      resolveReadableLocationLabel(coords).then(readableLabel => {
        if (requestId === latestRequestId.current) {
          setLocationLabel(readableLabel);
        }
      });
      
      return { coords, label: '' };
    } 
    catch (error) {
      if (requestId !== latestRequestId.current) return null;

      if (error?.code === 1 || error?.message?.toLowerCase().includes('denied')) {
        setErrorMsg('Geolocation is not available, please enable it in your App settings');
      } else {
        setErrorMsg('Error getting location: ' + error.message);
      }
      setLocation(null);
      setLocationLabel('');
      return null;
    } 
    finally { 
      if (requestId === latestRequestId.current) {
        setLoading(false);
      }
    }
  }, [resolveReadableLocationLabel, isOffline]);


  useEffect(() => {
    getLocation();

    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    // Some browsers only allow reliable geolocation prompting after user interaction.
    const handleFirstInteraction = () => {
      getLocation();
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };
  }, [getLocation]);

  return { 
    location, 
    setLocation, 
    locationLabel, 
    setLocationLabel, 
    errorMsg, 
    loading, 
    getLocation, 
    cancelPendingLocation,
    clearLocationError 
  };
}



