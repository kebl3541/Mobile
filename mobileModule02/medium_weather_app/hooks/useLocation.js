
// GPS MANAGER  
// - handles GPS permission and coordinate fetching

import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

export function useLocation() {

  const [location, setLocation] = useState(null); // stores coordinates 
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false); // lets the UI know that asking for location

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
        return webCoords;
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
      return currentLocation.coords;
    } 
    catch (error) {
      if (error?.code === 1 || error?.message?.toLowerCase().includes('denied')) {
        setErrorMsg('Geolocation is not available, please enable it in your App settings');
      } else {
        setErrorMsg('Error getting location: ' + error.message);
      }
      setLocation(null);
      return null;
    } 
    finally { // runs no matter what 
      setLoading(false);
    }
  }, []);

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

  return { location, errorMsg, loading, getLocation, clearLocationError };
}



