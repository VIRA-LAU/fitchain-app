import { Image, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

export const HomeCard = ({
  icon,
  title,
  body,
  addMarginRight = false,
}: {
  icon: "book" | "play" | "challenges" | "guide" | "leaderboard";
  title: string;
  body: string;
  addMarginRight?: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View
      style={[
        styles.wrapper,
        {
          marginRight: addMarginRight ? 16 : 0,
          flexDirection: icon === "leaderboard" ? "row" : "column",
          alignItems: icon === "leaderboard" ? "center" : "flex-start",
        },
      ]}
    >
      <Image
        source={
          icon === "book"
            ? require("assets/icons/book.png")
            : icon === "play"
            ? require("assets/icons/play.png")
            : icon === "challenges"
            ? require("assets/icons/challenges.png")
            : icon === "guide"
            ? require("assets/icons/guide.png")
            : require("assets/icons/leaderboard.png")
        }
        style={[
          styles.icon,
          icon === "leaderboard"
            ? { width: "15%", marginRight: 16 }
            : { marginBottom: 16 },
        ]}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
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
