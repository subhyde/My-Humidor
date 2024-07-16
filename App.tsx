import { StatusBar } from "expo-status-bar";
import { Dimensions, View } from "react-native";
import Card from "./Components/Card/Card";
import Draggable from "react-native-draggable";

export default function App() {
  const windowWidth = Dimensions.get("window").width / 1.3;
  const windowHeight = Dimensions.get("window").height / 1.15;

  return (
    <View>
      <Card />
      <Draggable
        x={windowWidth}
        y={windowHeight}
        renderSize={56}
        renderColor="brown"
        renderText="+"
        isCircle
        shouldReverse={false}
        onShortPressRelease={() => alert("touched!!")}
      />
      <StatusBar style="auto" />
    </View>
  );
}
