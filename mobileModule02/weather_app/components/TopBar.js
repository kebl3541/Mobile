import React from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TopBar({
  inputText,
  setInputText,
  onSubmitEditing,
  onGeolocationPress,
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
          style={[
            styles.geoButton,
            {
              width: controlHeight,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Use geolocation"
        >
          <Ionicons
            name="location-outline"
            size={topBarIcon}
            color="#444"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    backgroundColor: '#ddd',
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
});