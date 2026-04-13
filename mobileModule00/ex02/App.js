import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

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
        onPress={() => console.log(props.value)}>
        <Text style={styles.buttonText}>{props.value}</Text>
      </TouchableOpacity>
    );
  }

export default function App() {

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
          <TextInput style={styles.textFieldText} defaultValue="0" editable={false}></TextInput>
        </View>

{/* TextField 2 */}
        <View style={styles.textField}>
          <TextInput style={styles.textFieldText} defaultValue="0" editable={false}></TextInput>
        </View>

{/* First row */}
        <View style={[styles.row, styles.firstRow]}>
          <CalculatorButton value="7" />
          <CalculatorButton value="8" />
          <CalculatorButton value="9" />
          <CalculatorButton value="C" type="action" />
          <CalculatorButton value="AC" type="action" />
        </View>

{/* Second row */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.5}
            onPress={() => console.log("4")}>
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.5}
            onPress={() => console.log("5")}>
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.5}
            onPress={() => console.log("6")}>
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.operatorButton]} 
            activeOpacity={0.5}
            onPress={() => console.log("+")}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.operatorButton]} 
            activeOpacity={0.5}
            onPress={() => console.log("-")}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>

{/* Third row */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.5}
            onPress={() => console.log("1")}>
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.5}
            onPress={() => console.log("2")}>
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.5}
            onPress={() => console.log("3")}>
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.operatorButton]} 
            activeOpacity={0.5}
            onPress={() => console.log("*")}>
            <Text style={styles.buttonText}>*</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.operatorButton]} 
            activeOpacity={0.5}
            onPress={() => console.log("/")}>
            <Text style={styles.buttonText}>/</Text>
          </TouchableOpacity>
        </View>

{/* Fourth row */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.5}
            onPress={() => console.log("0")}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.5}
            onPress={() => console.log(".")}>
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.5}
            onPress={() => console.log("00")}>
            <Text style={styles.buttonText}>00</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.operatorButton]} 
            activeOpacity={0.5}
            onPress={() => console.log("=")}>
            <Text style={styles.buttonText}>=</Text>
          </TouchableOpacity>
          <View style={styles.placeholder}></View>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Text cant be edited / i use it for the header bar
// TextInput is an input field > it can be edited  

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
