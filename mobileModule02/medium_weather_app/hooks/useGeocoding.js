// Fetch city suggestions from Open-Meteo 

import { useState, useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

export function useGeocoding() {

    const noResultMessage = 'Could not find any result for the supplied address or coordinates';
    const connectionLostMessage = 'The service connection is lost, please check your internet connection or try again later';

    const [searchInput, setSearchInput] = useState('');

    // States for API results
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // State for timout to debounce API calls
    const debounceTimeout = useRef(null);
    const latestRequestId = useRef(0);
    const skipNextSearch = useRef(false);

    const clearSuggestions = useCallback((options = {}) => {
        const { clearError = true } = options;
        setSuggestions([]);
        if (clearError) {
            setError('');
        }
    }, []);

    const suppressNextSearch = useCallback(() => {
        skipNextSearch.current = true;
    }, []);

    const cancelPendingSearch = useCallback(() => {
        latestRequestId.current += 1;
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
            debounceTimeout.current = null;
        }
        setLoading(false);
    }, []);

    const normalizeText = useCallback((value) => {
        return (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    }, []);

    const matchesQuery = useCallback((result, query) => {
        const searchableValues = [result.name, result.region, result.country]
            .filter(Boolean)
            .map(normalizeText);

        return searchableValues.some((value) => value.startsWith(query));
    }, [normalizeText]);

    // Fetch city suggestions
    const fetchSuggestions = useCallback(async (query) => {
        const normalizedQuery = normalizeText(query);

        if (normalizedQuery.length < 1) {   
            setSuggestions([]);
            return;
        }

        const requestId = ++latestRequestId.current;

        setLoading(true);

        try {
        
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(normalizedQuery)}&count=5&language=en&format=json`);
            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }

            const data = await response.json();

            if (requestId !== latestRequestId.current) {
                return;
            }

            // Transform API results into my suggestion format
            if (data.results && data.results.length > 0) {
                const formatted = data.results
                    .map((result) => ({
                        id: `${result.latitude},${result.longitude}`,
                        name: result.name,
                        region: result.admin1 || '',
                        country: result.country,
                        latitude: result.latitude,
                        longitude: result.longitude,
                    }))
                    .filter((result) => matchesQuery(result, normalizedQuery));

                if (requestId !== latestRequestId.current) {
                    return;
                }

                if (formatted.length > 0) {
                    setSuggestions(formatted);
                    setError('');
                    return formatted;
                }

                setSuggestions([]);
                setError(noResultMessage);
                return [];
            } else {
                if (requestId !== latestRequestId.current) {
                    return;
                }

                setSuggestions([]);
                setError(noResultMessage);
                return [];
            }
        } catch (err) {         
            if (requestId !== latestRequestId.current) {
                return;
            }

            setError(connectionLostMessage);
            setSuggestions([]);
            return null;
        } finally {
            if (requestId !== latestRequestId.current) {
                return;
            }

            setLoading(false);
        }
    }, []);

    const reverseGeocode = useCallback(async ({ latitude, longitude }) => {
        if (latitude == null || longitude == null) {
            return null;
        }

        try {
            if (Platform.OS === 'web' || typeof Location.reverseGeocodeAsync !== 'function') {
                return null;
            }

            const results = await Location.reverseGeocodeAsync({ latitude, longitude });
            const firstResult = results?.[0];

            if (!firstResult) {
                return null;
            }

            return {
                name: firstResult.city || firstResult.locality || firstResult.name || '',
                region: firstResult.region || firstResult.district || firstResult.subregion || '',
                country: firstResult.country || '',
                latitude,
                longitude,
            };
        } catch (err) {
            return null;
        }
    }, []);
    
    // Debounced input handler
    useEffect(() => {
        if (skipNextSearch.current) {
            skipNextSearch.current = false;
            return;
        }

        // clear timer
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // set timer
        const timeout = setTimeout(() => {
            fetchSuggestions(searchInput);
        }, 300);

        debounceTimeout.current = timeout;

        return () => clearTimeout(timeout);
    }, [searchInput, fetchSuggestions]);

    return {
        searchInput,
        setSearchInput,
        suggestions,
        error,
        loading,
        clearSuggestions,
        setGeocodingError: setError,
        searchCities: fetchSuggestions,
        reverseGeocodeCoordinates: reverseGeocode,
        suppressNextSearch,
        cancelPendingSearch,
    };
}