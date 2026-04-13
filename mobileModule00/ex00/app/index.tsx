import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
/* Touchable opacity is a pressable button */

export default function Ex00() {
  const { width } = useWindowDimensions();

  return (
    /* View is just a container that holds things */
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
        Ex00 - 42 Mobile Piscine
      </Text>
      <TouchableOpacity
        onPress={() => console.log("Button pressed")}
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

/* width * 0.05 means the text is always 5% of the screen width */
