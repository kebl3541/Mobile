import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import GlassCard from '../common/GlassCard';
import { COLORS } from '../../constants/Colors';

export default function TopBar({
  inputText,
  setInputText,
  onSubmitEditing,
  onGeolocationPress,
  geolocationLoading,
  suggestions,
  onSuggestionPress,
  onFocus,
  responsive,
}) {
  const {
    topBarFont,
    topBarIcon,
    topBarPadV,
    topBarPadH,
    topBarRadius,
  } = responsive;

  const controlHeight = Math.max(topBarFont + topBarPadV * 2 + 8, 48);

  // Requirement: Show no more than 5 suggestions
  const limitedSuggestions = suggestions.slice(0, 5);

  return (
    <View
      style={[
        styles.topBar,
        {
          paddingHorizontal: topBarPadH,
          paddingVertical: topBarPadV * 1.5,
        },
      ]}
    >
      <GlassCard
        opacity={0.18}
        style={[
          styles.searchGroup,
          {
            height: controlHeight,
            borderRadius: topBarRadius,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            onSubmitEditing();
          }}
          style={styles.searchButton}
          accessibilityRole="button"
          accessibilityLabel="Search location"
        >
          <Ionicons
            name="search"
            size={topBarIcon}
            color={COLORS.gray}
          />
        </Pressable>

        <TextInput
          value={inputText}
          onChangeText={setInputText}
          onFocus={onFocus}
          placeholder="Search city"
          placeholderTextColor={COLORS.gray}
          returnKeyType="search"
          blurOnSubmit
          onSubmitEditing={onSubmitEditing}
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            {
              fontSize: topBarFont,
            },
          ]}
        />

        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            onGeolocationPress();
          }}
          disabled={geolocationLoading}
          style={[
            styles.geoButton,
            geolocationLoading && styles.geoButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel={geolocationLoading ? 'Getting location' : 'Use geolocation'}
        >
          {geolocationLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons
              name="location"
              size={topBarIcon}
              color={COLORS.primary}
            />
          )}
        </Pressable>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: 5000,
    overflow: 'visible',
    ...Platform.select({
      ios: { elevation: 10 },
      default: {},
    }),
  },
  searchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 0, 
        borderWidth: 0,
        borderColor: 'transparent',
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
      }
    }),
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: 'Outfit-Regular',
    color: COLORS.dark,
    paddingHorizontal: 8,
    paddingVertical: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  searchButton: {
    paddingHorizontal: 12,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  geoButton: {
    paddingHorizontal: 12,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  suggestionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 12,
    overflow: 'hidden',
    opacity: 1,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
      }
    }),
    zIndex: 9999,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  suggestionItemPressed: {
    backgroundColor: '#F2F2F7',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: COLORS.dark,
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: 'Outfit-Medium',
    marginTop: 2,
  },
  geoButtonDisabled: {
    opacity: 0.5,
  },
});