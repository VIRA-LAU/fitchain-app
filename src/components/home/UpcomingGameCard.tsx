import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

export const UpcomingGameCard = ({
  gameType,
  date,
  location,
}: {
  gameType: any;
  date: Date;
  location: string;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.text}>This {weekday[date.getDay()]},</Text>
        <Text style={styles.greyText}>
          {"at "}
          <Text style={styles.text}>{location}</Text>
        </Text>
      </View>
      <Image
        source={
          gameType === "basketball"
            ? require("assets/images/home/basketball.png")
            : gameType === "football"
            ? require("assets/images/home/football.png")
            : require("assets/images/home/tennis.png")
        }
        style={styles.gameIcon}
      />
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      color: "white",
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.secondary,
      marginBottom: 10,
      padding: 20,
      borderRadius: 10,
    },
    text: {
      color: "white",
      fontFamily: "Inter-SemiBold",
    },
    greyText: {
      color: colors.tertiary,
      fontSize: 12,
      fontFamily: "Inter-Medium",
    },
    gameIcon: { marginRight: 10, width: 35, aspectRatio: 1 },
  });
