import { useState } from "react";
// lets components remember values that can change

import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

export default function Ex01() {
  const { width } = useWindowDimensions();
  const [message, setMessage] = useState("Ex01 - 42 Mobile Piscine");
  // Create state to track current message text:
  // - message = current stored value (starts as "Ex00 - 42 Mobile Piscine")
  // - setMessage = function to update the stored value
  // - useState(...): initializes the state and remembers this value across button presses
  // NB: useState() is a function that returns an array with two values:
  // [ "Ex01...",  function_to_change_it ] -- state, setter function (created by react to update the state)

  //function to change the message when button is pressed
  const handlePress = () => {
    if (message === "Ex01 - 42 Mobile Piscine") {
      setMessage("Hello World!");
    } else {
      setMessage("Ex01 - 42 Mobile Piscine");
    }
    console.log("Button pressed");
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: width * 0.05,
          marginBottom: 20,
        }}
      >
        {message}
      </Text>

      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: "#007AFF",
          paddingVertical: 12,
          paddingHorizontal: width * 0.08,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#22075cff", fontSize: width * 0.05 }}>Try me!</Text>
      </TouchableOpacity>
    </View>
  );
}
