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
import ImageView from "react-native-image-viewing";

const ReviewModal = (props: {
  isOpen: boolean;
  closeModal: () => void;
  cigarItem?: cigarItem | null;
}) => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const [editable, setEditable] = useState(!props.cigarItem);

  const [cigarName, setCigarName] = useState("");
  const [review, setReview] = useState("");
  const [drawRating, setDrawRating] = useState(0);
  const [appearanceRating, setAppearanceRating] = useState<number>(0);
  const [burnRating, setBurnRating] = useState<number>(0);
  const [aromaRating, setAromaRating] = useState<number>(0);
  const [tasteRating, setTasteRating] = useState<number>(0);
  const [image, setImage] = useState(require("../../assets/img.png"));

  const [advanced, setAdvanced] = useState(false);
  const [blend, setBlend] = useState("");
  const [visualNotes, setVisualNotes] = useState("");
  const [coldDraw, setColdDraw] = useState("");
  const [firstThird, setFirstThird] = useState("");
  const [secondThird, setSecondThird] = useState("");
  const [lastThird, setLastThird] = useState("");
  const [smokingDuration, setSmokingDuration] = useState("");
  const [construction, setConstruction] = useState("");

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
        blend,
        visualNotes,
        coldDraw,
        firstThird,
        secondThird,
        lastThird,
        smokingDuration,
        construction,
        formType,
      } = props.cigarItem;

      setCigarName(cigarName);
      setReview(review);
      setDrawRating(drawRating);
      setAppearanceRating(appearanceRating);
      setBurnRating(burnRating);
      setAromaRating(aromaRating);
      setTasteRating(tasteRating);
      setImage({ uri: image });
      setBlend(blend || "");
      setVisualNotes(visualNotes || "");
      setColdDraw(coldDraw || "");
      setFirstThird(firstThird || "");
      setSecondThird(secondThird || "");
      setLastThird(lastThird || "");
      setSmokingDuration(smokingDuration || "");
      setConstruction(construction || "");
      setAdvanced(formType === "advanced");
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
    let cigarItem: cigarItem;
    if (advanced) {
      cigarItem = {
        formType: "advanced",
        cigarName,
        drawRating,
        appearanceRating,
        burnRating,
        aromaRating,
        tasteRating,
        smokeTime: 0,
        review,
        image: newPath,
        blend,
        visualNotes,
        coldDraw,
        firstThird,
        secondThird,
        lastThird,
        smokingDuration,
        construction,
      };
    } else {
      cigarItem = {
        cigarName,
        drawRating,
        appearanceRating,
        burnRating,
        aromaRating,
        tasteRating,
        smokeTime: 0,
        review,
        image: newPath,
        formType: "basic",
      };
    }

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
            {editable && (
              <View
                style={{
                  position: "absolute",
                  right: 20,
                  top: 20,
                  zIndex: 9999,
                }}
              >
                <TouchableOpacity onPress={() => setAdvanced(!advanced)}>
                  <Text style={{ fontSize: 16, color: "blue" }}>
                    {advanced ? "Basic" : "Advanced"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <Divider />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Cigar Name:</Text>
            </View>
            <TextInput
              onChangeText={setCigarName}
              onFocus={() => setFocusedInput("cigarName")}
              onBlur={() => setFocusedInput(null)}
              style={[
                styles.textInput,
                focusedInput === "cigarName" && styles.textInputFocused,
              ]}
              placeholder="Cigar Name"
              value={cigarName}
              editable={editable}
            />
            <Divider />
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
            {/*advanced section start*/}
            {advanced && (
              <>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Blend:</Text>
                </View>
                <TextInput
                  onChangeText={setBlend}
                  onFocus={() => {
                    setFocusedInput("blend");
                  }}
                  onContentSizeChange={(e: { target: React.Component }) =>
                    handleMessageContentSizeChange(e.target)
                  }
                  onBlur={() => setFocusedInput(null)}
                  style={[
                    styles.textInput,
                    focusedInput === "blend" && styles.textInputFocused,
                    { height: 100 },
                  ]}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  value={blend}
                  editable={editable}
                />
                <Divider />

                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Visual Notes:</Text>
                </View>
                <TextInput
                  onChangeText={setVisualNotes}
                  onFocus={() => {
                    setFocusedInput("visualNotes");
                  }}
                  onContentSizeChange={(e: { target: React.Component }) =>
                    handleMessageContentSizeChange(e.target)
                  }
                  onBlur={() => setFocusedInput(null)}
                  style={[
                    styles.textInput,
                    focusedInput === "visualNotes" && styles.textInputFocused,
                    { height: 150 },
                  ]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={visualNotes}
                  editable={editable}
                />
                <Divider />

                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Cold Draw:</Text>
                </View>
                <TextInput
                  onChangeText={setColdDraw}
                  onFocus={() => {
                    setFocusedInput("coldDraw");
                  }}
                  onContentSizeChange={(e: { target: React.Component }) =>
                    handleMessageContentSizeChange(e.target)
                  }
                  onBlur={() => setFocusedInput(null)}
                  style={[
                    styles.textInput,
                    focusedInput === "coldDraw" && styles.textInputFocused,
                    { height: 150 },
                  ]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={coldDraw}
                  editable={editable}
                />
                <Divider />

                <View style={styles.labelContainer}>
                  <Text style={styles.label}>First Third:</Text>
                </View>
                <TextInput
                  onChangeText={setFirstThird}
                  onFocus={() => {
                    setFocusedInput("firstThird");
                  }}
                  onContentSizeChange={(e: { target: React.Component }) =>
                    handleMessageContentSizeChange(e.target)
                  }
                  onBlur={() => setFocusedInput(null)}
                  style={[
                    styles.textInput,
                    focusedInput === "firstThird" && styles.textInputFocused,
                    { height: 150 },
                  ]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={firstThird}
                  editable={editable}
                />
                <Divider />

                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Second Third:</Text>
                </View>
                <TextInput
                  onChangeText={setSecondThird}
                  onFocus={() => {
                    setFocusedInput("secondThird");
                  }}
                  onContentSizeChange={(e: { target: React.Component }) =>
                    handleMessageContentSizeChange(e.target)
                  }
                  onBlur={() => setFocusedInput(null)}
                  style={[
                    styles.textInput,
                    focusedInput === "secondThird" && styles.textInputFocused,
                    { height: 150 },
                  ]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={secondThird}
                  editable={editable}
                />
                <Divider />

                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Last Third:</Text>
                </View>
                <TextInput
                  onChangeText={setLastThird}
                  onFocus={() => {
                    setFocusedInput("lastThird");
                  }}
                  onContentSizeChange={(e: { target: React.Component }) =>
                    handleMessageContentSizeChange(e.target)
                  }
                  onBlur={() => setFocusedInput(null)}
                  style={[
                    styles.textInput,
                    focusedInput === "lastThird" && styles.textInputFocused,
                    { height: 150 },
                  ]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={lastThird}
                  editable={editable}
                />
                <Divider />

                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Construction:</Text>
                </View>
                <TextInput
                  onChangeText={setConstruction}
                  onFocus={() => {
                    setFocusedInput("construction");
                  }}
                  onContentSizeChange={(e: { target: React.Component }) =>
                    handleMessageContentSizeChange(e.target)
                  }
                  onBlur={() => setFocusedInput(null)}
                  style={[
                    styles.textInput,
                    focusedInput === "construction" && styles.textInputFocused,
                    { height: 150 },
                  ]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={construction}
                  editable={editable}
                />
                <Divider />

                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Smoke Duration:</Text>
                </View>
                <TextInput
                  onChangeText={setSmokingDuration}
                  onFocus={() => setFocusedInput("smokeDuration")}
                  onBlur={() => setFocusedInput(null)}
                  style={[
                    styles.textInput,
                    focusedInput === "smokeDuration" && styles.textInputFocused,
                  ]}
                  value={smokingDuration}
                  editable={editable}
                />
                <Divider />
              </>
            )}

            {/*advanced section end*/}

            <View style={styles.labelContainer}>
              <Text style={styles.label}>Review:</Text>
            </View>
            <TextInput
              onChangeText={setReview}
              onFocus={() => {
                setFocusedInput("review");
              }}
              onContentSizeChange={(e: { target: React.Component }) =>
                handleMessageContentSizeChange(e.target)
              }
              onBlur={() => setFocusedInput(null)}
              style={[
                styles.textInput,
                focusedInput === "review" && styles.textInputFocused,
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
              <TouchableOpacity onPress={saveReview} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            )}
            {editable && props.cigarItem && (
              <TouchableOpacity
                onPress={confirmDelete}
                style={styles.deleteButton}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    marginTop: 40,
    backgroundColor: "#4CAF50", // Green color for Save
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "100%",
    maxWidth: 300,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  deleteButton: {
    backgroundColor: "#FF385C",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "100%",
    maxWidth: 300,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
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
    backgroundColor: "white",
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
    borderRadius: 30,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textInputFocused: {
    borderColor: "blue",
    borderWidth: 1,
  },
});

export default ReviewModal;
