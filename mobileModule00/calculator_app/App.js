import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { handlePress } from './calculatorLogic';

function CalculatorButton(props) {
  
    let buttonStyle = styles.button;
    
    if (props.type === "action") {
      buttonStyle = [styles.button, styles.actionButton];
    }
    else if (props.type === "operator") {
      buttonStyle = [styles.button, styles.operatorButton];
    }

    return (
      <TouchableOpacity 
        style={buttonStyle}
        activeOpacity={0.5}
        onPress={() => props.onPress(props.value)}>
        <Text style={styles.buttonText}>{props.value}</Text>
      </TouchableOpacity>
    );
  }

export default function App() {

  const [expression, setExpression] = useState(""); // array destructuring - useState builds an array with two slots
  const [result, setResult] = useState("0");

  function handleButtonPress(value) {
    const nextState = handlePress(value, expression, result);
    setExpression(nextState.expression);
    setResult(nextState.result);
  }

  return (
    <SafeAreaProvider>

      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

{/* App Bar */}
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Calculator</Text>
        </View>

{/* TextField 1 */}
        <View style={styles.textField}>
          <TextInput style={styles.textFieldText} value={expression} editable={false}></TextInput>
        </View>

{/* TextField 2 */}
        <View style={styles.textField}>
          <TextInput style={styles.textFieldText} value={result} editable={false}></TextInput>
        </View>

{/* First row */}
        <View style={[styles.row, styles.firstRow]}>
          <CalculatorButton value="7" onPress={handleButtonPress}/>
          <CalculatorButton value="8" onPress={handleButtonPress}/>
          <CalculatorButton value="9" onPress={handleButtonPress}/>
          <CalculatorButton value="C" type="action" onPress={handleButtonPress}/>
          <CalculatorButton value="AC" type="action" onPress={handleButtonPress}/>
        </View>

{/* Second row */}
        <View style={styles.row}>
          <CalculatorButton value="4" onPress={handleButtonPress}/>
          <CalculatorButton value="5" onPress={handleButtonPress}/>
          <CalculatorButton value="6" onPress={handleButtonPress}/>
          <CalculatorButton value="+" type="operator" onPress={handleButtonPress}/>
          <CalculatorButton value="-" type="operator" onPress={handleButtonPress}/>
        </View>

{/* Third row */}
        <View style={styles.row}>
          <CalculatorButton value="1" onPress={handleButtonPress}/>
          <CalculatorButton value="2" onPress={handleButtonPress}/>
          <CalculatorButton value="3" onPress={handleButtonPress}/>
          <CalculatorButton value="*" type="operator" onPress={handleButtonPress}/>
          <CalculatorButton value="/" type="operator" onPress={handleButtonPress}/>
        </View>

{/* Fourth row */}
        <View style={styles.row}>
          <CalculatorButton value="0" onPress={handleButtonPress}/>
          <CalculatorButton value="." onPress={handleButtonPress}/>
          <CalculatorButton value="00" onPress={handleButtonPress}/>
          <CalculatorButton value="=" type="operator" onPress={handleButtonPress}/>
          <View style={styles.placeholder}></View>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#000000ff',
      },
      appBar: {
        padding: 16,
        backgroundColor: '#000000ff',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        alignItems: 'center',
      },
      appBarTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
      },
      textField: {
        padding: 16,
        backgroundColor: '#1c1c1e',
        borderBottomWidth: 1,
        borderBottomColor: '#e4d9d9ff',
      },
      textFieldText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'right',
      },
      row: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginBottom: 8, 
      },
      firstRow: {
        marginTop: 16,
      },
      button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6f90a1',
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 4
      },
      buttonText: {
        color: '#fff',
        fontSize: 24,
      },
      operatorButton: {
        backgroundColor: '#ff9500',
      },
      actionButton: {
        backgroundColor: '#d9534f',
      },
      placeholder: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 12,
      },
    });
