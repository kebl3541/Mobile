import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import BottomBar from './components/BottomBar';
import TopBar from './components/TopBar';
import MiddleArea from './components/MiddleArea';

export default function App() {

  const [activeTab, setActiveTab] = useState('Currently');
  const [extraText, setExtraText] = useState('');
  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
    
        <StatusBar style="auto" />
         
        <TopBar extraText={extraText} setExtraText={setExtraText} />    
        
        <MiddleArea 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          extraText={extraText}
        />
        
        <BottomBar activeTab={activeTab} setActiveTab={setActiveTab}/>
      
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8cf0c18a',

  },
});


// in React, a capitalized tag signals a custom component
// one uses component functions by writing them like a tag
// this means render the BottomBar component here
// there is only one tag with final slash because the componennt
// has no children inside // does not wrap inner content
// you write in the tags the props you pass to the function
// props are arguments you pass to the component function 
// child - a component that lives inside another component