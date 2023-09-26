import { Fragment, useContext, useState } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { ScrollView } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import IonIcon from "react-native-vector-icons/Ionicons";
import ImageView from "react-native-image-viewing";
import { UserContext, uploadImage } from "src/utils";
import { GalleryPermissionDialog, GenericDialog } from "../modals";
import { useDeleteBranchPhotoMutation, useUpdateBranchMutation } from "src/api";
import { Skeleton } from "../home";
import { UseMutateFunction } from "react-query";
import { Branch } from "src/types";

type Request =
  | {
      description?: string;
    }
  | FormData;

const UploadPhotosButton = ({
  position,
  updateBranch,
  selectionLimit,
}: {
  position: "relative" | "absolute";
  updateBranch: UseMutateFunction<Branch, unknown, Request, unknown>;
  selectionLimit: number;
}) => {
  const { colors } = useTheme();
  const { branchData } = useContext(UserContext);

  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const [selectionLimitDialogVisible, setSelectionLimitDialogVisible] =
    useState(false);

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
            undefined,
            updateBranch,
            true,
            selectionLimit,
            setSelectionLimitDialogVisible
          );
        }}
      >
        <IonIcon name="camera-outline" color={colors.tertiary} size={20} />
        <Text
          style={{
            color: colors.tertiary,
            marginLeft: 5,
            fontFamily: "Poppins-Regular",
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

export const ImageListSkeleton = () => {
  const { colors } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
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
        {[0, 1].map((imageSkeleton) => (
          <View
            key={imageSkeleton}
            style={{
              height: 0.25 * windowHeight,
              width: 0.25 * windowHeight,
              marginLeft: imageSkeleton === 0 ? 20 : 5,
              marginRight: imageSkeleton === 1 ? 20 : 5,
            }}
          >
            <Skeleton
              style={{ height: "100%", width: "100%", borderRadius: 10 }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export const ImageList = ({
  images,
  isLoading,
  editable = false,
}: {
  images?: string;
  isLoading: boolean;
  editable?: boolean;
}) => {
  const { colors } = useTheme();
  const { height: windowHeight } = useWindowDimensions();

  const [imageViewVisible, setImageViewVisible] = useState<number | null>(null);

  const { mutate: updateBranch, isLoading: updateLoading } =
    useUpdateBranchMutation();
  const { mutate: deletePhoto, isLoading: deleteLoading } =
    useDeleteBranchPhotoMutation();

  const imageArr = (images ? images.split(",") : []).map((imageUri) => ({
    uri: imageUri,
  }));

  if (isLoading || updateLoading || deleteLoading) return <ImageListSkeleton />;
  else if (imageArr.length === 0 && !editable) return <View />;
  return (
    <View>
      <Text
        style={{
          fontFamily: "Poppins-Bold",
          fontSize: 16,
          color: colors.tertiary,
          marginBottom: 8,
        }}
      >
        Pictures
      </Text>
      {imageArr.length > 0 ? (
        <ScrollView
          style={{
            flexDirection: "row",
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
      ) : (
        <UploadPhotosButton
          position="relative"
          updateBranch={updateBranch}
          selectionLimit={5}
        />
      )}
      {editable && imageArr.length > 0 && imageArr.length < 5 && (
        <UploadPhotosButton
          position="absolute"
          updateBranch={updateBranch}
          selectionLimit={5 - imageArr.length}
        />
      )}
      <ImageView
        images={imageArr}
        imageIndex={imageViewVisible!}
        visible={imageViewVisible !== null}
        onRequestClose={() => setImageViewVisible(null)}
        backgroundColor={colors.background}
        FooterComponent={({ imageIndex }) => {
          if (editable)
            return (
              <Button
                buttonColor="darkred"
                textColor={colors.tertiary}
                style={{ margin: 10 }}
                onPress={() => {
                  const image = imageArr[imageIndex].uri.split("/").pop()!;
                  deletePhoto(image?.substring(0, image.indexOf("?")));
                  setImageViewVisible(null);
                }}
              >
                Delete Photo
              </Button>
            );
          else return <View />;
        }}
      />
    </View>
  );
};
