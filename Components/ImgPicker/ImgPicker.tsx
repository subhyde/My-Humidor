import { Alert, Linking, Modal, TouchableOpacity } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import React from "react";
import * as ImagePicker from "expo-image-picker";
interface PhotoActionButtonProps {
  children: React.ReactNode;
  onImageUpdate: (image: string) => void;
}

const ImgPicker = (props: PhotoActionButtonProps) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });

      if (!result.canceled) {
        props.onImageUpdate(result.assets[0].uri);
      }
    } else {
      showCameraPermissionDeniedAlert();
    }
  };

  const pickImageFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.01,
    });

    if (!result.canceled) {
      props.onImageUpdate(result.assets[0].uri);
    }
  };

  const showCameraPermissionDeniedAlert = () => {
    Alert.alert(
      "Camera Permissions Denied",
      "Please go to settings to enable camera permissions.",
      [
        {
          text: "Settings",
          onPress: () => Linking.openSettings(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  const onPress = () => {
    const options = ["Camera", "Choose from library", "Cancel"];
    const cancelButtonIndex = 3;
    const libraryIndex = 1;
    const cameraIndex = 0;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (selectedIndex: number) => {
        switch (selectedIndex) {
          case libraryIndex:
            await pickImageFromLibrary();
            break;

          case cameraIndex:
            await openCamera();
            break;

          case cancelButtonIndex:
        }
      },
    );
  };

  return (
    <TouchableOpacity onPress={onPress}>{props.children}</TouchableOpacity>
  );
};
export default ImgPicker;
