import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TopBar({ extraText, setExtraText }) {

    return (

        <View style={styles.topBar}>
            <TextInput
                style={styles.input}
                placeholder="Search city"
                value={extraText}
                onChangeText={setExtraText}
            />

            <Pressable
                style={styles.geoButton}
                onPress={() => setExtraText('Geolocation')}
            >
                <Ionicons name="location-outline" size={22} color="black" />
                <Text style={styles.buttonText}>Geo</Text>
            </Pressable>
        </View>
    );
}

const styles= StyleSheet.create({
    topBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12, 
        paddingVertical: 10,
        gap: 8,
    },

    input: {
       flex: 1,
       backgroundColor: 'white',
       borderWidth: 1,
       borderColor: '#ccc',
       borderRadius: 8, 
       paddingHorizontal: 12,
       paddingVertical: 10,
    },

    geoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    buttonText: {
        fontWeight: '600',
    },

})