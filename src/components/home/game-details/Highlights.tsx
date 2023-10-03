import { ResizeMode, Video } from "expo-av";
import { Dispatch, Fragment, SetStateAction } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Game } from "src/types";

export const Highlights = ({
  game,
  setVideoFocusVisible,
}: {
  game: Game;
  setVideoFocusVisible: Dispatch<SetStateAction<string | null>>;
}) => {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();

  if (game.highlights.length === 0) return <View />;
  return (
    <View>
      <Text
        variant="labelLarge"
        style={{ color: colors.tertiary, marginVertical: 20, marginLeft: 20 }}
      >
        Highlights
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {game.highlights.map((video, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={{
              marginLeft: index === 0 ? 20 : 5,
              marginRight: index === 2 ? 20 : 5,
            }}
            onPress={() => {
              setVideoFocusVisible(video);
            }}
          >
            <Video
              source={{
                uri: video,
              }}
              isLooping
              resizeMode={ResizeMode.COVER}
              style={{
                width: 0.4 * windowWidth,
                height: 235,
                borderRadius: 10,
              }}
            />
            <Text
              style={{
                color: colors.tertiary,
                fontFamily: "Poppins-Regular",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              Title
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View
        style={{
          borderColor: colors.secondary,
          borderBottomWidth: 1,
          marginTop: 20,
        }}
      />
    </View>
  );
};
