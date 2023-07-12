import * as ImagePicker from "expo-image-picker";
import { Dispatch, SetStateAction } from "react";

export const uploadImage = async (
  userType: "user" | "branch",
  imageType: "profile" | "cover",
  userId: number | undefined,
  setPermissionDialogVisible: Dispatch<SetStateAction<boolean>>,
  setTempPhotoToUpload: Dispatch<SetStateAction<string | undefined>>,
  mutate: (formData: FormData) => void
) => {
  const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    const { status: permissionRequest } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionRequest !== "granted") {
      setPermissionDialogVisible(true);
      return;
    }
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
  });

  if (!result.canceled) {
    setTempPhotoToUpload(result.assets[0].uri);

    const formData = new FormData();

    let fileName = result.assets[0].uri.split("/").pop();
    let match = /\.(\w+)$/.exec(fileName!);
    let type = match ? `image/${match[1]}` : `image`;

    formData.append(`${imageType}Photo`, {
      uri: result.assets[0].uri,
      name: `${userType}-${userId}.${match ? match[1] : ""}`,
      type,
    });
    mutate(formData);
  }
};
