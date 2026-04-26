import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/Colors';
import { MESSAGES } from '../../constants/Messages';
import Ionicons from '@expo/vector-icons/Ionicons';
import GlassCard from '../common/GlassCard';
import FadeInView from '../common/FadeInView';

const INFO_MESSAGES = [
  MESSAGES.SEARCH_PROMPT,
  MESSAGES.EMPTY_SEARCH,
  MESSAGES.SEARCH_PROMPT_TODAY,
  MESSAGES.SEARCH_PROMPT_WEEKLY,
];

/**
 * A shared layout component for the different weather views (Current, Today, Weekly).
 */
const WeatherViewLayout = React.forwardRef(({
  loading,
  error,
  forecast,
  renderSkeleton,
  responsive,
  locationLabel,
  submittedText,
  onScroll,
  scrollEventThrottle = 16,
  children
}, ref) => {
  const renderStatusCard = (message, isError = false) => {
    // If it's in our "Info" list, it shouldn't look like an error even if passed as one
    const isInfo = INFO_MESSAGES.includes(message);
    const finalIsError = isError && !isInfo;

    const iconName = finalIsError ? 'alert-circle' : 'information-circle';
    const iconColor = finalIsError ? COLORS.errorText : COLORS.primary;

    return (
      <GlassCard style={styles.statusCard} opacity={0.18}>
        <Ionicons name={iconName} size={48} color={iconColor} style={styles.statusIcon} />
        <Text style={[styles.statusText, finalIsError && styles.errorText]}>
          {message}
        </Text>
      </GlassCard>
    );
  };

  const renderContent = () => {
    // 1. Critical Blocking Errors (Highest priority)
    if (error === MESSAGES.CONNECTION_LOST) {
      return renderStatusCard(error, true);
    }

    // 2. Loading State (Show skeleton during any active fetch if no data)
    if (loading && !forecast) {
      return renderSkeleton ? renderSkeleton() : null;
    }

    // 3. Regular Errors (Search not found, Geolocation disabled, etc.)
    // Only show if we don't have a forecast to show instead
    if (error && !forecast) {
      return renderStatusCard(error, true);
    }

    // 4. Data State
    if (forecast) {
      return (
        <FadeInView style={styles.mainContent}>
          {children}
        </FadeInView>
      );
    }

    // 5. Prompt State (No data yet)
    const prompt = submittedText || locationLabel || MESSAGES.SEARCH_PROMPT;
    return renderStatusCard(prompt, false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={ref}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        keyboardShouldPersistTaps="handled"
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  mainContent: {
    alignItems: 'center',
    width: '100%',
  },
  statusCard: {
    width: '85%',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    textAlign: 'center',
    color: COLORS.dark,
    lineHeight: 24,
  },
  errorText: {
    color: COLORS.errorText,
  },
});

export default WeatherViewLayout;
