import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import WeatherViewLayout from '../WeatherViewLayout';
import { MESSAGES } from '../../../constants/Messages';

// Mock FadeInView to just render children immediately for testing
jest.mock('../../common/FadeInView', () => ({ children }) => <>{children}</>);

describe('WeatherViewLayout', () => {
  const responsive = { middleText: 16 };

  it('renders loading state (skeleton) when loading and no forecast', () => {
    const renderSkeleton = jest.fn(() => <Text>Skeleton</Text>);
    const { getByText } = render(
      <WeatherViewLayout 
        loading={true} 
        forecast={null} 
        renderSkeleton={renderSkeleton}
        responsive={responsive}
      />
    );
    
    expect(getByText('Skeleton')).toBeTruthy();
    expect(renderSkeleton).toHaveBeenCalled();
  });

  it('renders error state when error is provided', () => {
    const errorMessage = 'Something went wrong';
    const { getByText } = render(
      <WeatherViewLayout 
        error={errorMessage} 
        responsive={responsive}
      />
    );
    
    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('renders children even if regular error is present but forecast is available', () => {
    const { getByText, queryByText } = render(
      <WeatherViewLayout 
        forecast={{ some: 'data' }} 
        error="Geolocation off"
        responsive={responsive}
      >
        <Text>Weather Data Content</Text>
      </WeatherViewLayout>
    );
    
    expect(getByText('Weather Data Content')).toBeTruthy();
    expect(queryByText('Geolocation off')).toBeNull();
  });

  it('renders search prompt when no forecast and no loading/error', () => {
    const { getByText } = render(
      <WeatherViewLayout 
        forecast={null} 
        loading={false}
        error={null}
        responsive={responsive}
      />
    );
    
    expect(getByText(MESSAGES.SEARCH_PROMPT)).toBeTruthy();
  });
});
