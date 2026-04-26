import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import GlassCard from '../GlassCard';

describe('GlassCard', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <GlassCard>
        <Text>Test Content</Text>
      </GlassCard>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <GlassCard style={customStyle} testID="glass-card">
        <Text>Test</Text>
      </GlassCard>
    );
    
    const card = getByTestId('glass-card');
    expect(card.props.style).toContainEqual(customStyle);
  });
});
