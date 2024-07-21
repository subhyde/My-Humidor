import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchCigarItemsByName } from "../../Database/db-service";
import { useSQLiteContext } from "expo-sqlite";
import { cigarItem } from "../../Database/models";

const SearchBar = (props: { setCigars: (cigars: cigarItem[]) => void }) => {
  const [isFocused, setIsFocused] = useState(false);
  const db = useSQLiteContext();
  //todo add a debounce
  const onTextChange = async (text: string) => {
    const cigars: cigarItem[] = await searchCigarItemsByName(db, text);
    props.setCigars(cigars);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TextInput
          onChangeText={onTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.textInput, isFocused && styles.textInputFocused]}
          placeholder="Search by name..."
        />
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  textInput: {
    margin: 20,
    borderStyle: "solid",
    width: "80%",
    borderColor: "#d1d1d1",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  textInputFocused: {
    borderColor: "#007bff",
    borderWidth: 1,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default SearchBar;
