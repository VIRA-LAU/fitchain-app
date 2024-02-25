import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";
import { Dispatch, SetStateAction } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Modal, useTheme } from "react-native-paper";

export const VideoPlayerModal = ({
  video,
  setVideo,
}: {
  video?: string;
  setVideo: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const { colors } = useTheme();
  const windowWidth = Dimensions.get("screen").width;

  return (
    <Modal
      visible={video !== undefined}
      style={{ marginTop: 0 }}
      dismissable={false}
      contentContainerStyle={{
        height: "100%",
      }}
      dismissableBackButton
      onDismiss={() => setVideo(undefined)}
    >
      <Pressable
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "#0005",
        }}
        onPress={() => setVideo(undefined)}
      />
      <View
        style={{
          borderRadius: 16,
          marginHorizontal: 16,
          overflow: "hidden",
        }}
      >
        <VideoPlayer
          videoProps={{
            source: {
              uri: video ?? "",
            },
            isLooping: true,
            shouldPlay: true,
            resizeMode: ResizeMode.COVER,
          }}
          style={{
            width: windowWidth - 32,
            height: (windowWidth * 9) / 16,
          }}
        />
      </View>
    </Modal>
  );
};
