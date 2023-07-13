import {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useState,
} from "react";
import {
  Image,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import IonIcon from "react-native-vector-icons/Ionicons";
import ImageView from "react-native-image-viewing";
import { UserContext, uploadImage } from "src/utils";
import { GalleryPermissionDialog, GenericDialog } from "../modals";
import { useUpdateBranchMutation } from "src/api";

export const UploadPhotosButton = ({
  position,
  setTempPhotoToUpload,
  selectionLimit,
}: {
  position: "relative" | "absolute";
  setTempPhotoToUpload: Dispatch<SetStateAction<string | undefined>>;
  selectionLimit: number;
}) => {
  const { colors } = useTheme();
  const { branchData } = useContext(UserContext);

  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const [selectionLimitDialogVisible, setSelectionLimitDialogVisible] =
    useState(false);

  const { mutate: updateBranch } = useUpdateBranchMutation();

  return (
    <Fragment>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          position === "absolute"
            ? {
                position,
                bottom: 25,
                left: 5,
              }
            : { marginTop: 20, height: 50 },
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.secondary,
            opacity: 0.9,
            padding: 7.5,
            borderRadius: 10,
          },
        ]}
        onPress={() => {
          uploadImage(
            "branch",
            "profile",
            branchData!.branchId,
            setPermissionDialogVisible,
            setTempPhotoToUpload,
            updateBranch,
            true,
            selectionLimit,
            setSelectionLimitDialogVisible
          );
        }}
      >
        <IonIcon name="camera-outline" color={"white"} size={20} />
        <Text
          style={{
            color: "white",
            marginLeft: 5,
            fontFamily: "Inter-Medium",
            fontSize: 12,
          }}
        >
          Upload Photos
        </Text>
      </TouchableOpacity>
      <GalleryPermissionDialog
        visible={permissionDialogVisible}
        setVisible={setPermissionDialogVisible}
      />
      <GenericDialog
        visible={selectionLimitDialogVisible}
        setVisible={setSelectionLimitDialogVisible}
        title="Upload Limit Exceeded"
        text={`Please select up to ${selectionLimit} photo(s).`}
      />
    </Fragment>
  );
};

export const ImageList = ({
  images,
  editable = false,
  setBranchPhotosToUpload,
}: {
  images: string;
  editable?: boolean;
  setBranchPhotosToUpload?: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const { colors } = useTheme();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const [imageViewVisible, setImageViewVisible] = useState<number | null>(null);

  const imageArr = images.split(",").map((imageUri) => ({ uri: imageUri }));

  return (
    <View style={{ marginTop: 20 }}>
      <Text variant="labelLarge" style={{ color: colors.tertiary }}>
        Photos
      </Text>
      <ScrollView
        style={{
          flexDirection: "row",
          marginVertical: 20,
          marginHorizontal: -20,
          maxHeight: 0.25 * windowHeight,
        }}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {imageArr.map((imageUri, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={{
              height: 0.25 * windowHeight,
              width: 0.25 * windowHeight,
              marginLeft: index === 0 ? 20 : 5,
              marginRight: index === imageArr.length - 1 ? 20 : 5,
            }}
            onPress={() => setImageViewVisible(index)}
          >
            <Image
              source={imageUri}
              style={{ height: "100%", width: "100%", borderRadius: 10 }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {editable && imageArr.length < 5 && (
        <UploadPhotosButton
          position="absolute"
          setTempPhotoToUpload={setBranchPhotosToUpload!}
          selectionLimit={5 - imageArr.length}
        />
      )}
      <ImageView
        images={imageArr}
        imageIndex={imageViewVisible!}
        visible={imageViewVisible !== null}
        onRequestClose={() => setImageViewVisible(null)}
        backgroundColor={colors.background}
        // FooterComponent={({ imageIndex }) => {
        //   if (editable)
        //     return (
        //       <View>
        //         <Text style={{ color: "white" }}>Delete placeholder</Text>
        //       </View>
        //     );
        //   else return <View />;
        // }}
      />
    </View>
  );
};
