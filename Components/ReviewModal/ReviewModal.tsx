import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import StarRating from "react-native-star-rating-widget";
import Divider from "../Divider/Divider";
import { createTable, insertCigarItem } from "../../Database/db-service";
import { cigarItem } from "../../Database/models";
import ImgPicker from "../ImgPicker/ImgPicker";
import { useSQLiteContext } from "expo-sqlite";
import * as FileSystem from "expo-file-system";

const ReviewModal = (props: { isOpen: boolean; closeModal: () => void }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedTextArea, setIsFocusedTextArea] = useState(false);

  const [cigarName, setCigarName] = useState("");
  const [review, setReview] = useState("");

  const [drawRating, setDrawRating] = useState(0);
  const [appearanceRating, setAppearanceRating] = useState<number>(0);
  const [burnRating, setBurnRating] = useState<number>(0);
  const [aromaRating, setAromaRating] = useState<number>(0);
  const [tasteRating, setTasteRating] = useState<number>(0);

  const [image, setImage] = useState(require("../../assets/img.png"));
  const db = useSQLiteContext();

  const saveReview = async () => {
    await createTable(db);

    const filename = image.uri.split("/").pop();
    const newPath = FileSystem.documentDirectory + filename;

    await FileSystem.copyAsync({
      from: image.uri,
      to: newPath,
    });

    const newItem: cigarItem = {
      id: Date.now(),
      cigarName,
      drawRating,
      appearanceRating,
      burnRating,
      aromaRating,
      tasteRating,
      smokeTime: 0,
      review,
      image: newPath,
    };
    await insertCigarItem(db, newItem);
    props.closeModal();
  };

  const showConfirmationDialog = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to leave? Your review wont be saved.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => props.closeModal(),
          style: "destructive",
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <Modal
      visible={props.isOpen}
      transparent={true}
      onRequestClose={() => props.closeModal()}
      animationType="fade"
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{
              alignItems: "center",
              padding: 20,
              paddingTop: 50,
            }}
          >
            <View
              style={{
                position: "absolute",
                left: 10,
                top: 10,
                zIndex: 9999,
              }}
            >
              <TouchableOpacity onPress={showConfirmationDialog}>
                <Ionicons name={"close"} size={40} color={"black"} />
              </TouchableOpacity>
            </View>

            <TextInput
              onChangeText={setCigarName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={[styles.textInput, isFocused && styles.textInputFocused]}
              placeholder="Cigar Name"
            />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Draw Rating:</Text>
            </View>
            <StarRating rating={drawRating} onChange={setDrawRating} />
            <Divider />

            <View style={styles.labelContainer}>
              <Text style={styles.label}>Appearance Rating:</Text>
            </View>
            <StarRating
              rating={appearanceRating}
              onChange={setAppearanceRating}
            />
            <Divider />

            <View style={styles.labelContainer}>
              <Text style={styles.label}>Burn Rating:</Text>
            </View>
            <StarRating rating={burnRating} onChange={setBurnRating} />
            <Divider />

            <View style={styles.labelContainer}>
              <Text style={styles.label}>Aroma Rating:</Text>
            </View>
            <StarRating rating={aromaRating} onChange={setAromaRating} />
            <Divider />

            <View style={styles.labelContainer}>
              <Text style={styles.label}>Taste Rating:</Text>
            </View>
            <StarRating rating={tasteRating} onChange={setTasteRating} />
            <Divider />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Review:</Text>
            </View>
            <TextInput
              onChangeText={setReview}
              onFocus={() => setIsFocusedTextArea(true)}
              onBlur={() => setIsFocusedTextArea(false)}
              style={[
                styles.textInput,
                isFocusedTextArea && styles.textInputFocused,
                { height: 150 },
              ]}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <ImgPicker
              onImageUpdate={(image) => {
                setImage({ uri: image });
              }}
            >
              <Image
                alt={"placeholder image"}
                source={image}
                style={{ height: 200, width: 300, borderRadius: 20 }}
              />
            </ImgPicker>
            <Button
              onPress={() => {
                saveReview();
              }}
              title={"save"}
            ></Button>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  labelContainer: {
    alignSelf: "stretch",
    alignItems: "flex-start",
    paddingBottom: 10,
  },
  label: {
    paddingLeft: 10,
    textAlign: "left",
    fontSize: 18,
  },
  modalView: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.9,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    marginBottom: 20,
    borderStyle: "solid",
    width: "100%",
    borderColor: "#d1d1d1",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    elevation: 2,
    // marginTop: 50,
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

export default ReviewModal;
