import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList, BottomTabParamList } from "src/navigation";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { Booking, GameType } from "src/types";

export const UpcomingGameCard = ({ game }: { game: Booking }) => {
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

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  const gameType = game.type.toLowerCase() as GameType;
  const location = `${game.court.branch.venue.name} - ${game.court.branch.location}`;

  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => navigation.push("GameDetails", { booking: game })}
    >
      <View>
        <Text style={styles.text}>This {weekday[game.date?.getDay()]},</Text>
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
    </Pressable>
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
