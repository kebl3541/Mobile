

import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocation(null);
        return;
      }

      setErrorMsg(null);

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } catch (error) {
      setErrorMsg('Error getting location: ' + error.message);
      setLocation(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, errorMsg, loading, getLocation };
}



