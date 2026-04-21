import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TopBar({
  inputText,
  setInputText,
  onSubmitEditing,
  onGeolocationPress,
  geolocationLoading,
  suggestions,
  onSuggestionPress,
  showPermissionCta,
  onPermissionPress,
  responsive,
}) {
  const {
    topBarFont,
    topBarIcon,
    topBarPadV,
    topBarPadH,
    topBarRadius,
  } = responsive;

  const controlHeight = topBarFont + topBarPadV * 2 + 2;

  return (
    <View
      style={[
        styles.topBar,
        {
          paddingHorizontal: topBarPadH,
          paddingVertical: topBarPadV,
        },
      ]}
    >
      <View
        style={[
          styles.searchGroup,
          {
            minHeight: controlHeight,
            borderRadius: topBarRadius,
          },
        ]}
      >
        <Pressable
          onPress={onSubmitEditing}
          style={[
            styles.searchButton,
            {
              width: controlHeight,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Search location"
        >
          <Ionicons
            name="search-outline"
            size={topBarIcon}
            color="#444"
          />
        </Pressable>

        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Search city"
          returnKeyType="search"
          blurOnSubmit
          onSubmitEditing={onSubmitEditing}
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            {
              fontSize: topBarFont,
              paddingHorizontal: topBarPadH,
            },
          ]}
        />

        <Pressable
          onPress={onGeolocationPress}
          disabled={geolocationLoading}
          style={[
            styles.geoButton,
            geolocationLoading && styles.geoButtonDisabled,
            {
              width: controlHeight,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={geolocationLoading ? 'Getting location' : 'Use geolocation'}
        >
          {geolocationLoading ? (
            <ActivityIndicator size="small" color="#444" />
          ) : (
            <Ionicons
              name="location-outline"
              size={topBarIcon}
              color="#444"
            />
          )}
        </Pressable>
      </View>

      {suggestions.length > 0 && (
        <View
          style={[
            styles.suggestionsContainer,
            {
              top: topBarPadV + controlHeight,
            },
          ]}
        >
          <FlatList
            keyboardShouldPersistTaps="always"
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSuggestionPress(item)}
                style={styles.suggestionItem}
              >
                <Text style={styles.suggestionTitle}>{item.name}</Text>
                <Text style={styles.suggestionSubtitle}>
                  {[item.region, item.country].filter(Boolean).join(', ')}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {showPermissionCta ? (
        <Pressable
          onPress={onPermissionPress}
          style={styles.permissionButton}
          accessibilityRole="button"
          accessibilityLabel="Request location permission"
        >
          <Text style={styles.permissionButtonText}>Request Location Permission</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    backgroundColor: '#ddd',
    position: 'relative',
    zIndex: 10,
  },
  suggestionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    maxHeight: 180,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    zIndex: 30,
    elevation: 30,
  },
  suggestionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  suggestionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#666',
  },
  searchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'white',
  },
  geoButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
  },
  searchButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  geoButtonDisabled: {
    opacity: 0.7,
  },
  permissionButton: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
  },
});