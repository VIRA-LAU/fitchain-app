import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { BottomTabParamList, StackParamList } from "src/navigation";

export const HomeCard = ({
  type,
  title,
  body,
  addMarginRight = false,
}: {
  type: "book" | "play" | "challenges" | "guide" | "leaderboard";
  title: string;
  body: string;
  addMarginRight?: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<StackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.wrapper,
        {
          marginRight: addMarginRight ? 16 : 0,
          flexDirection: type === "leaderboard" ? "row" : "column",
          alignItems: type === "leaderboard" ? "center" : "flex-start",
        },
      ]}
      onPress={() => {
        if (type === "book") navigation.push("Branches");
        else if (type === "play") navigation.push("Games");
        else if (type === "challenges") navigation.navigate("Challenges");
      }}
    >
      <Image
        source={
          type === "book"
            ? require("assets/icons/book.png")
            : type === "play"
            ? require("assets/icons/play.png")
            : type === "challenges"
            ? require("assets/icons/challenges.png")
            : type === "guide"
            ? require("assets/icons/guide.png")
            : require("assets/icons/leaderboard.png")
        }
        style={[
          styles.icon,
          type === "leaderboard"
            ? { width: "15%", marginRight: 16 }
            : { marginBottom: 16 },
        ]}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.secondary,
      borderRadius: 15,
      margin: 0,
      padding: 16,
    },
    icon: {
      resizeMode: "contain",
      width: "35%",
      height: "auto",
      aspectRatio: 1,
    },
    title: {
      textTransform: "uppercase",
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
      fontSize: 12,
    },
    body: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      fontSize: 10,
    },
  });
