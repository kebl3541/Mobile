import React from 'react';
import { render } from '@testing-library/react-native';
import LocationHeader from '../LocationHeader';

describe('LocationHeader', () => {
  const responsive = { middleText: 20 };

  it('renders city name and region correctly from label', () => {
    const { getByText } = render(
      <LocationHeader 
        label="London, Greater London, United Kingdom" 
        responsive={responsive}
      />
    );
    
    expect(getByText('London')).toBeTruthy();
    expect(getByText('Greater London, United Kingdom')).toBeTruthy();
  });

  it('renders only city name if no region provided', () => {
    const { getByText, queryByStyle } = render(
      <LocationHeader 
        label="Paris" 
        responsive={responsive}
      />
    );
    
    expect(getByText('Paris')).toBeTruthy();
  });

  it('returns null if error is present', () => {
    const { queryByText } = render(
      <LocationHeader 
        label="London" 
        error="Some error"
        responsive={responsive}
      />
    );
    
    expect(queryByText('London')).toBeNull();
  });

  it('returns null if label is missing', () => {
    const { queryByText } = render(
      <LocationHeader 
        label={null} 
        responsive={responsive}
      />
    );
    
    expect(queryByText(/.*/)).toBeNull();
  });
});
