import React from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getResponsiveSizes } from '../utils/responsive';

export default function TopBar({ extraText, setExtraText }) {
  const { width, height } = useWindowDimensions();
  const {
    topBarFont,
    topBarIcon,
    topBarPadV,
    topBarPadH,
    topBarRadius,
  } = getResponsiveSizes(width, height);

  const controlHeight = topBarFont + topBarPadV * 2 + 2;

  const handleGeolocationPress = () => {
    setExtraText('Geolocation');
  };

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
          value={extraText}
          onChangeText={setExtraText}
          placeholder="Search city"
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
          onPress={handleGeolocationPress}
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