// Fetch city suggestions from Open-Meteo 

import { useState, useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { weatherService } from '../../services/weatherService';
import { CONFIG } from '../../constants/Config';

export function useGeocoding() {

    const noResultMessage = 'Could not find any result for the supplied address or coordinates';
    const connectionLostMessage = 'The service connection is lost, please check your internet connection or try again later';

    const [searchInput, setSearchInput] = useState('');
    const [submittedText, setSubmittedText] = useState('');

    // States for API results
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // State for timout to debounce API calls
    const debounceTimeout = useRef(null);
    const abortController = useRef(null);
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
        if (abortController.current) {
            abortController.current.abort();
            abortController.current = null;
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

        return searchableValues.some((value) => value.includes(query));
    }, [normalizeText]);

    // Fetch city suggestions
    const fetchSuggestions = useCallback(async (query, options = {}) => {
        const { silent = false, preserveError = false } = options;
        const normalizedQuery = normalizeText(query);

        if (normalizedQuery.length < 2) {   
            if (!silent) setSuggestions([]);
            return;
        }

        const requestId = ++latestRequestId.current;
        
        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        if (!silent) setLoading(true);

        try {
            const results = await weatherService.searchCities(normalizedQuery, abortController.current.signal);

            if (requestId !== latestRequestId.current && !silent) {
                return;
            }

            if (results && results.length > 0) {
                const q = normalizeText(query);
                
                // Filter out obviously unrelated results from the API
                const filteredResults = results.filter(result => {
                    if (q.length < 2) return true; // Be very lenient for 1-char searches
                    
                    const name = normalizeText(result.name);
                    const region = normalizeText(result.admin1);
                    const country = normalizeText(result.country);
                    
                    // Allow if query is a prefix or substring of any main field
                    return name.includes(q) || 
                           region.includes(q) || 
                           country.includes(q);
                });

                if (filteredResults.length === 0 && results.length > 0) {
                    // If everything was filtered out, maybe it's a translation (like Roma -> Rome)
                    // In this case, keep the first result as a fallback
                    filteredResults.push(results[0]);
                }

                const formatted = filteredResults
                    .sort((a, b) => {
                        const aName = normalizeText(a.name);
                        const bName = normalizeText(b.name);
                        
                        // 1. Exact name match
                        if (aName === q && bName !== q) return -1;
                        if (bName === q && aName !== q) return 1;
                        
                        // 2. Prefix match
                        const aStarts = aName.startsWith(q);
                        const bStarts = bName.startsWith(q);
                        if (aStarts && !bStarts) return -1;
                        if (bStarts && !aStarts) return 1;
                        
                        // 3. Population fallback
                        return (b.population || 0) - (a.population || 0);
                    })
                    .slice(0, CONFIG.MAX_SUGGESTIONS)
                    .map((result) => ({
                        id: `${result.latitude},${result.longitude}`,
                        name: result.name,
                        region: result.admin1,
                        country: result.country,
                        latitude: result.latitude,
                        longitude: result.longitude,
                    }));

                if (requestId !== latestRequestId.current && !silent) {
                    return;
                }

                if (formatted.length > 0) {
                    if (!silent) {
                        setSuggestions(formatted);
                    }
                    return formatted;
                }

                if (!silent) {
                    setSuggestions([]);
                }
                return [];
            } else {
                if (requestId !== latestRequestId.current && !silent) {
                    return;
                }

                if (!silent) {
                    setSuggestions([]);
                }
                return [];
            }
        } catch (err) {         
            if (err.name === 'AbortError') return null;

            if (requestId !== latestRequestId.current && !silent) {
                return;
            }

            if (!silent) {
                setSuggestions([]);
            }
            return null;
        } finally {
            if (requestId !== latestRequestId.current && !silent) {
                return;
            }

            if (!silent) setLoading(false);
        }
    }, [normalizeText]);

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
                region: firstResult.region || firstResult.city || firstResult.name || '',
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
        }, CONFIG.DEBOUNCE_DELAY);

        debounceTimeout.current = timeout;

        return () => clearTimeout(timeout);
    }, [searchInput, fetchSuggestions]);

    return {
        searchInput,
        setSearchInput,
        submittedText,
        submitText: setSubmittedText,
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