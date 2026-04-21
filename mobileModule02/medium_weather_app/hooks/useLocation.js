
// GPS MANAGER  
// - handles GPS permission and coordinate fetching

import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

export function useLocation() {

  const [location, setLocation] = useState(null); // stores coordinates 
  const [locationLabel, setLocationLabel] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false); // lets the UI know that asking for location

  const formatCoordinatesLabel = useCallback((coords) => {
    if (!coords) {
      return '';
    }

    return `Lat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)}`;
  }, []);

  const buildLocationLabel = useCallback((place) => {
    const parts = [
      place?.city,
      place?.municipality,
      place?.locality,
      place?.district,
      place?.subregion,
      place?.region,
      place?.name,
      place?.country,
    ]
      .map((part) => (part || '').trim())
      .filter(Boolean)
      .filter((part, index, array) => array.indexOf(part) === index);

    return parts.join(', ');
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
    try {
      if (Platform.OS === 'web') {
        return resolveWebLocationLabel(coords);
      }

      if (typeof Location.reverseGeocodeAsync !== 'function') {
        return formatCoordinatesLabel(coords);
      }

      const results = await Location.reverseGeocodeAsync(coords);
      const firstResult = results?.[0];

      if (!firstResult) {
        return formatCoordinatesLabel(coords);
      }

      const label = buildLocationLabel({
        city: firstResult.city,
        municipality: firstResult.municipality,
        locality: firstResult.locality,
        district: firstResult.district,
        subregion: firstResult.subregion,
        region: firstResult.region,
        name: firstResult.name,
        country: firstResult.country,
      });

      return label || formatCoordinatesLabel(coords);
    } catch (error) {
      return formatCoordinatesLabel(coords);
    }
  }, [buildLocationLabel, formatCoordinatesLabel, resolveWebLocationLabel]);

  // Ask permission & fetch coordinates
  const getLocation = useCallback(async () => {
   
    setLoading(true);

    try {
      if (Platform.OS === 'web') {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
          setErrorMsg('Geolocation is not available, please enable it in your App settings');
          setLocation(null);
          return null;
        }

        const webCoords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => reject(error),
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            },
          );
        });

        setErrorMsg(null);
        setLocation(webCoords);

        const readableLabel = await resolveReadableLocationLabel(webCoords);
        setLocationLabel(readableLabel);
        return { coords: webCoords, label: readableLabel };
      }

// STEP 1 - Request foreground location permission.
        const permissionResponse = await Location.requestForegroundPermissionsAsync();
        const permissionStatus = permissionResponse.status;
        const canAskAgain = permissionResponse.canAskAgain;

      // If permission is denied...
      if (permissionStatus !== 'granted') {
        if (!canAskAgain) {
          setErrorMsg('Location permission is blocked. Please enable it in your App settings.');
        } else {
          setErrorMsg('Geolocation is not available, please enable it in your App settings');
        }
        setLocation(null); // Clear coordinates 
        return null;
      }

      // If permission is granted...STEP 2 - Get the location
      setErrorMsg(null);
      const currentLocation = await Location.getCurrentPositionAsync({});// Get the current GPS position
      setLocation(currentLocation.coords); // store coordinates in state

      const readableLabel = await resolveReadableLocationLabel(currentLocation.coords);
      setLocationLabel(readableLabel);
      return { coords: currentLocation.coords, label: readableLabel };
    } 
    catch (error) {
      if (error?.code === 1 || error?.message?.toLowerCase().includes('denied')) {
        setErrorMsg('Geolocation is not available, please enable it in your App settings');
      } else {
        setErrorMsg('Error getting location: ' + error.message);
      }
      setLocation(null);
      setLocationLabel('');
      return null;
    } 
    finally { // runs no matter what 
      setLoading(false);
    }
  }, [resolveReadableLocationLabel]);

  const clearLocationError = useCallback(() => {
    setErrorMsg('');
  }, []);

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

  return { location, locationLabel, errorMsg, loading, getLocation, clearLocationError };
}



