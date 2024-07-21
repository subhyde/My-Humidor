import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import Home from "./Views/Home/Home";
import { SQLiteProvider } from "expo-sqlite";

export default function App() {
  return (
    <ActionSheetProvider>
      <SQLiteProvider databaseName="cigarData.db">
        <Home />
      </SQLiteProvider>
    </ActionSheetProvider>
  );
}
