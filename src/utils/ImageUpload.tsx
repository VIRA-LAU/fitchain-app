import * as ImagePicker from "expo-image-picker";
import { Dispatch, SetStateAction } from "react";

export const uploadImage = async (
  userType: "user" | "branch",
  imageType: "profile" | "cover",
  userId: number | undefined,
  setPermissionDialogVisible: Dispatch<SetStateAction<boolean>>,
  setTempPhotoToUpload: Dispatch<SetStateAction<string | undefined>>,
  mutate: (formData: FormData) => void,
  isMultiple: boolean = false,
  selectionLimit: number = 1,
  setSelectionLimitDialogVisible?: Dispatch<SetStateAction<boolean>>
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
    allowsEditing: !isMultiple,
    allowsMultipleSelection: isMultiple,
    selectionLimit,
  });

  if (!result.canceled) {
    const formData = new FormData();

    if (!isMultiple) {
      setTempPhotoToUpload(result.assets[0].uri);

      let fileName = result.assets[0].uri.split("/").pop();
      let match = /\.(\w+)$/.exec(fileName!);
      let type = match ? `image/${match[1]}` : `image`;

      formData.append(`${imageType}Photo`, {
        uri: result.assets[0].uri,
        name: `${userType}-${userId}.${match ? match[1] : ""}`,
        type,
      });
    } else {
      if (result.assets.length > selectionLimit) {
        setSelectionLimitDialogVisible!(true);
        return;
      }
      setTempPhotoToUpload(result.assets.map((asset) => asset.uri).join(","));

      const isoDate = new Date().toISOString();
      result.assets.forEach((asset, index) => {
        let fileName = asset.uri.split("/").pop();
        let match = /\.(\w+)$/.exec(fileName!);
        let type = match ? `image/${match[1]}` : `image`;

        formData.append(`${userType}Photos`, {
          uri: asset.uri,
          name: `${userType}-${userId}-${isoDate.substring(
            0,
            isoDate.indexOf(".")
          )}-${index + 1}.${match ? match[1] : ""}`,
          type,
        });
      });
    }
    mutate(formData);
  }
};
