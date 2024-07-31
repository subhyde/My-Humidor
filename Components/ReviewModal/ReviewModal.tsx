import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Button,
  Alert,
  findNodeHandle,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import StarRating, { StarRatingDisplay } from "react-native-star-rating-widget";
import Divider from "../Divider/Divider";
import {
  createTable,
  deleteCigarItem,
  insertCigarItem,
  updateCigarItem,
} from "../../Database/db-service";
import { cigarItem } from "../../Database/models";
import ImgPicker from "../ImgPicker/ImgPicker";
import { useSQLiteContext } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImageView from "react-native-image-viewing"; // Importing ImageView

const ReviewModal = (props: {
  isOpen: boolean;
  closeModal: () => void;
  cigarItem?: cigarItem | null;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedTextArea, setIsFocusedTextArea] = useState(false);
  const [editable, setEditable] = useState(!props.cigarItem);

  const [cigarName, setCigarName] = useState("");
  const [review, setReview] = useState("");
  const [drawRating, setDrawRating] = useState(0);
  const [appearanceRating, setAppearanceRating] = useState<number>(0);
  const [burnRating, setBurnRating] = useState<number>(0);
  const [aromaRating, setAromaRating] = useState<number>(0);
  const [tasteRating, setTasteRating] = useState<number>(0);
  const [image, setImage] = useState(require("../../assets/img.png"));

  const db = useSQLiteContext();

  useEffect(() => {
    if (props.cigarItem) {
      const {
        cigarName,
        review,
        drawRating,
        appearanceRating,
        burnRating,
        aromaRating,
        tasteRating,
        image,
      } = props.cigarItem;

      setCigarName(cigarName);
      setReview(review);
      setDrawRating(drawRating);
      setAppearanceRating(appearanceRating);
      setBurnRating(burnRating);
      setAromaRating(aromaRating);
      setTasteRating(tasteRating);
      setImage({ uri: image });
    }
  }, [props.cigarItem]);

  const deleteReview = async () => {
    if (props.cigarItem) {
      await createTable(db);
      await deleteCigarItem(db, props.cigarItem.id);
      props.closeModal();
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteReview,
        },
      ],
      { cancelable: false },
    );
  };

  const saveReview = async () => {
    await createTable(db);

    const filename = image.uri.split("/").pop();
    const newPath = FileSystem.documentDirectory + filename;

    // Check if the image already exists
    const fileInfo = await FileSystem.getInfoAsync(newPath);
    if (!fileInfo.exists) {
      // todo handle if image is not present
      // Copy the image if it does not exist
      await FileSystem.copyAsync({
        from: image.uri,
        to: newPath,
      });
    }

    const cigarItem: cigarItem = {
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

    if (props.cigarItem) {
      cigarItem.id = props.cigarItem.id;
      await updateCigarItem(db, cigarItem);
    } else {
      await insertCigarItem(db, cigarItem);
    }

    props.closeModal();
  };

  const keyboardScrollViewRef = React.useRef<KeyboardAwareScrollView>(null);
  const handleMessageContentSizeChange = (e: React.Component) => {
    if (keyboardScrollViewRef.current) {
      keyboardScrollViewRef.current.scrollToFocusedInput(
        findNodeHandle(e) || {},
      );
    }
  };

  const showConfirmationDialog = () => {
    if (!editable) {
      props.closeModal();
      return;
    }
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

  const editReview = () => {
    setEditable(true);
  };

  const images = [
    {
      uri: image.uri,
    },
  ];

  const [visible, setIsVisible] = useState(false);

  return (
    <Modal
      visible={props.isOpen}
      transparent={true}
      onRequestClose={() => props.closeModal()}
      animationType="fade"
    >
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <KeyboardAwareScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{
              alignItems: "center",
              padding: 20,
              paddingTop: 50,
            }}
            ref={keyboardScrollViewRef}
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
            {props.cigarItem && !editable && (
              <View
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 9999,
                }}
              >
                <TouchableOpacity onPress={editReview}>
                  <Ionicons name={"create-outline"} size={40} color={"black"} />
                </TouchableOpacity>
              </View>
            )}
            <Divider />
            <TextInput
              onChangeText={setCigarName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={[styles.textInput, isFocused && styles.textInputFocused]}
              placeholder="Cigar Name"
              value={cigarName}
              editable={editable}
            />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Draw Rating:</Text>
            </View>
            {editable ? (
              <StarRating rating={drawRating} onChange={setDrawRating} />
            ) : (
              <StarRatingDisplay rating={drawRating} />
            )}
            <Divider />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Appearance Rating:</Text>
            </View>
            {editable ? (
              <StarRating
                rating={appearanceRating}
                onChange={setAppearanceRating}
              />
            ) : (
              <StarRatingDisplay rating={appearanceRating} />
            )}
            <Divider />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Burn Rating:</Text>
            </View>
            {editable ? (
              <StarRating rating={burnRating} onChange={setBurnRating} />
            ) : (
              <StarRatingDisplay rating={burnRating} />
            )}
            <Divider />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Aroma Rating:</Text>
            </View>
            {editable ? (
              <StarRating rating={aromaRating} onChange={setAromaRating} />
            ) : (
              <StarRatingDisplay rating={aromaRating} />
            )}
            <Divider />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Taste Rating:</Text>
            </View>
            {editable ? (
              <StarRating rating={tasteRating} onChange={setTasteRating} />
            ) : (
              <StarRatingDisplay rating={tasteRating} />
            )}
            <Divider />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Review:</Text>
            </View>
            <TextInput
              onChangeText={setReview}
              onFocus={() => {
                setIsFocusedTextArea(true);
              }}
              onContentSizeChange={(e: { target: React.Component }) =>
                handleMessageContentSizeChange(e.target)
              }
              onBlur={() => setIsFocusedTextArea(false)}
              style={[
                styles.textInput,
                isFocusedTextArea && styles.textInputFocused,
                { height: 150 },
              ]}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={review}
              editable={editable}
            />
            {editable ? (
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
            ) : (
              <TouchableOpacity onPress={() => setIsVisible(true)}>
                <Image
                  alt={"placeholder image"}
                  source={image}
                  style={{ height: 200, width: 300, borderRadius: 20 }}
                />
              </TouchableOpacity>
            )}
            <ImageView
              images={images}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
            {editable && (
              <Button
                onPress={() => {
                  saveReview();
                }}
                title={"Save"}
              />
            )}
            {editable && props.cigarItem && (
              <Button
                onPress={() => {
                  confirmDelete();
                }}
                title={"Delete"}
                color={"red"}
              />
            )}
          </KeyboardAwareScrollView>
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
