import { useCallback, useState } from 'react';

export function useWeatherSearch() {
  const [inputText, setInputText] = useState('');
  const [submittedText, setSubmittedText] = useState('');

  const submitText = useCallback((text) => {
    setSubmittedText(text.trim());
  }, []);

  const handleGeolocationPress = useCallback(() => {
    setInputText('Geolocation');
    setSubmittedText('Geolocation');
  }, []);

  return {
    inputText,
    setInputText,
    submittedText,
    submitText,
    handleGeolocationPress,
  };
}