import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useGeocoding } from '../useGeocoding';
import { weatherService } from '../../../services/weatherService';

// Mock the weather service
jest.mock('../../../services/weatherService', () => ({
  weatherService: {
    searchCities: jest.fn(),
  },
}));

// Mock CONFIG
jest.mock('../../../constants/Config', () => ({
  CONFIG: {
    DEBOUNCE_DELAY: 100, // Small delay for testing
  },
}));

describe('useGeocoding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with empty states', () => {
    const { result } = renderHook(() => useGeocoding());
    
    expect(result.current.searchInput).toBe('');
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('triggers search when searchInput changes (debounced)', async () => {
    const mockResults = [
      { name: 'London', latitude: 51.5, longitude: -0.12, country: 'UK' }
    ];
    weatherService.searchCities.mockResolvedValue(mockResults);

    const { result } = renderHook(() => useGeocoding());

    act(() => {
      result.current.setSearchInput('London');
    });

    // Advance timers for debounce
    act(() => {
      jest.advanceTimersByTime(150);
    });

    await waitFor(() => {
      expect(weatherService.searchCities).toHaveBeenCalledWith('london', expect.any(AbortSignal));
    });

    await waitFor(() => {
      expect(result.current.suggestions.length).toBeGreaterThan(0);
      expect(result.current.suggestions[0].name).toBe('London');
    });
  });

  it('does not search for queries shorter than 2 characters', async () => {
    const { result } = renderHook(() => useGeocoding());

    act(() => {
      result.current.setSearchInput('L');
    });

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(weatherService.searchCities).not.toHaveBeenCalled();
    expect(result.current.suggestions).toEqual([]);
  });
});
