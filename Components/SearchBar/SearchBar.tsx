import React, { useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchCigarItems } from "../../Database/db-service";
import RNPickerSelect from "react-native-picker-select";
import { useSQLiteContext } from "expo-sqlite";
import { cigarItem } from "../../Database/models";

export enum SearchFilter {
  Newest = "newest",
  Oldest = "oldest",
  RatingAscending = "ratingasc",
  RatingDescending = "ratingdec",
}

const SearchBar = (props: { setCigars: (cigars: cigarItem[]) => void }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [filter, setFilter] = useState<SearchFilter>(SearchFilter.Newest);
  const [searchText, setSearchText] = useState("");
  const db = useSQLiteContext();

  const onTextChange = async (text: string) => {
    setSearchText(text);
    const cigars: cigarItem[] = await searchCigarItems(db, text, filter);
    props.setCigars(cigars);
  };

  const onFilterChange = async () => {
    const cigars: cigarItem[] = await searchCigarItems(db, searchText, filter);
    props.setCigars(cigars);
  };

  const pickerRef = useRef<RNPickerSelect>(null);

  const openPicker = () => {
    if (pickerRef.current) {
      pickerRef.current.togglePicker(true);
    }
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
        <View>
          <TouchableOpacity onPress={openPicker}>
            <Ionicons name="filter" size={24} color="black" />
          </TouchableOpacity>
          <RNPickerSelect
            ref={pickerRef}
            doneText={"Search"}
            onClose={() => onFilterChange()}
            onValueChange={(value) => setFilter(value)}
            items={[
              { label: "Newest", value: "newest" },
              { label: "Oldest", value: "oldest" },
              { label: "Rating Ascending", value: "ratingasc" },
              { label: "Rating Descending", value: "ratingdec" },
            ]}
            style={{
              inputIOS: { display: "none" },
              inputAndroid: { display: "none" },
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-around",

    flexDirection: "row",
  },
  textInput: {
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
