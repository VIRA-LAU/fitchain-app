import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";
import { Activity } from "src/types";

export const ActivityCard = ({ date, type, isWinner }: Activity) => {
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
  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => navigation.push("GameDetails", { booking: "" })}
    >
      <Image
        source={
          type === "Basketball"
            ? require("assets/images/home/basketball.png")
            : type === "Football"
            ? require("assets/images/home/football.png")
            : require("assets/images/home/tennis.png")
        }
        style={styles.gameIcon}
      />
      <View style={styles.textView}>
        <Text style={styles.greyText}>
          <Text style={styles.text}>{isWinner ? "Won" : "Lost"}</Text> a{" "}
          {type[0].toLowerCase()}
          {type.substring(1)} game.
        </Text>
        <Text style={[styles.greyText, { fontSize: 10 }]}>
          {weekday[new Date(date)?.getDay()]}
        </Text>
      </View>

      <FeatherIcon
        name="chevron-right"
        color={colors.tertiary}
        size={20}
        style={{ marginLeft: "auto" }}
      />
    </Pressable>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      borderRadius: 10,
      backgroundColor: colors.secondary,
      padding: 15,
      marginBottom: 10,
      paddingBottom: 20,
    },
    gameIcon: {
      width: 35,
      aspectRatio: 1,
    },
    textView: {
      marginLeft: 15,
    },
    greyText: {
      color: colors.tertiary,
      fontFamily: "Inter-Medium",
    },
    text: {
      color: "white",
      fontFamily: "Inter-SemiBold",
    },
  });
