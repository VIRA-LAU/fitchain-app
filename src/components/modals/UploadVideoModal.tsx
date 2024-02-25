import React, {
  useState,
  Dispatch,
  SetStateAction,
  Fragment,
  useEffect,
} from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { useUploadGameVideoMutation } from "src/api";
import { Game } from "src/types";
import { ResizeMode, Video } from "expo-av";
import { selectVideo } from "src/utils";
import { GalleryPermissionDialog } from "../modals/Dialogs";
import { ModalContainer } from "./ModalContainer";

export const UploadVideoModal = ({
  game,
  visible,
  setVisible,
}: {
  game?: Game;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const [tempVideoToUpload, setTempVideoToUpload] = useState<string>();
  const [permissionDialogVisible, setPermissionDialogVisible] =
    useState<boolean>(false);

  const {
    mutate: uploadGameVideo,
    isLoading: uploadLoading,
    isSuccess: uploadSuccess,
  } = useUploadGameVideoMutation(game?.id);

  useEffect(() => {
    if (uploadSuccess) setVisible(false);
  }, [uploadSuccess]);

  return (
    <Fragment>
      <ModalContainer title="" visible={visible} setVisible={setVisible}>
        <View style={{}}>
          <Button
            mode="contained"
            onPress={() => {
              selectVideo(setPermissionDialogVisible, setTempVideoToUpload);
            }}
          >
            Select Video
          </Button>
          {tempVideoToUpload && (
            <Video
              source={{
                uri: tempVideoToUpload ?? "",
              }}
              isLooping
              shouldPlay
              resizeMode={ResizeMode.COVER}
              style={{
                height: 235,
                marginVertical: 20,
              }}
            />
          )}
          {tempVideoToUpload && (
            <Button
              mode="contained"
              loading={uploadLoading}
              onPress={
                !uploadLoading
                  ? () => {
                      const formData = new FormData();

                      let fileName = tempVideoToUpload.split("/").pop();
                      let match = /\.(\w+)$/.exec(fileName!);
                      let type = match ? `video/${match[1]}` : `video`;

                      formData.append(`video`, {
                        uri: tempVideoToUpload,
                        name: `${game?.id}.${match ? match[1] : ""}`,
                        type,
                      });

                      uploadGameVideo(formData);
                    }
                  : undefined
              }
            >
              Upload Video
            </Button>
          )}
        </View>
      </ModalContainer>
      <GalleryPermissionDialog
        visible={permissionDialogVisible}
        setVisible={setPermissionDialogVisible}
      />
    </Fragment>
  );
};
