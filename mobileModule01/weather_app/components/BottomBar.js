import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function BottomBar ({activeTab, setActiveTab}){
    return (

        <View style={styles.bottomBar}>

            <Pressable style={styles.tab} onPress={() => setActiveTab('Currently')}>
                <Ionicons name="albums-outline" size={20} color="black" />
               <Text style={activeTab === 'Currently' ? styles.activeText : styles.tabText}>
                    Currently   
                </Text>
            </Pressable>

            <Pressable style={styles.tab} onPress={() => setActiveTab('Today')}>
                <Ionicons name="calendar-outline" size={20} color="black" />
                <Text style={activeTab === 'Today' ? styles.activeText : styles.tabText}>
                    Today
                </Text>
            </Pressable>

            <Pressable style={styles.tab} onPress={() => setActiveTab('Weekly')}>
                <Ionicons name="list-outline" size={20} color="black" />
                <Text style={activeTab === 'Weekly' ? styles.activeText : styles.tabText}>
                    Weekly  
                </Text>
            </Pressable>


        </View>
    
    );
}

const styles = StyleSheet.create({

    bottomBar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        backgroundColor: '#ddd',
    },

    tab: {
        alignItems: 'center',
    },

    tabText: {
        fontWeight: '400',
    },

    activeText: {
        fontWeight: 'bold',
    }

});