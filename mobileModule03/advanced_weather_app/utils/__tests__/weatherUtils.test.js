import { buildLocationLabel, normalizeText } from '../weatherUtils';

jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(),
}));

describe('weatherUtils', () => {
  describe('normalizeText', () => {
    it('should trim and lowercase text', () => {
      expect(normalizeText('  London  ')).toBe('london');
    });

    it('should replace multiple spaces with a single space', () => {
      expect(normalizeText('New   York')).toBe('new york');
    });

    it('should handle null or undefined', () => {
      expect(normalizeText(null)).toBe('');
      expect(normalizeText(undefined)).toBe('');
    });
  });

  describe('buildLocationLabel', () => {
    it('should join name and region correctly', () => {
      const place = { name: 'London', region: 'Greater London', country: 'United Kingdom' };
      expect(buildLocationLabel(place)).toBe('London, Greater London, United Kingdom');
    });

    it('should repeat city when region is missing', () => {
      const place = { name: 'Paris', country: 'France' };
      expect(buildLocationLabel(place)).toBe('Paris, Paris, France');
    });

    it('should allow duplicates for city and region', () => {
      const place = { name: 'Berlin', region: 'Berlin', country: 'Germany' };
      expect(buildLocationLabel(place)).toBe('Berlin, Berlin, Germany');
    });

    it('should handle short names like "Ro"', () => {
      const place = { name: 'Ro', region: 'Emilia-Romagna', country: 'Italy' };
      expect(buildLocationLabel(place)).toBe('Ro, Emilia-Romagna, Italy');
    });
  });
});
