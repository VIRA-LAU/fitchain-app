import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";
import { BottomTabParamList, StackParamList } from "src/navigation";
import "intl";
import "intl/locale-data/jsonp/en";
import { StatisticsGame } from "src/types";
import { getMins, parseTimeFromMinutes } from "./TimeSlotPicker";
import { GameType, StatisticsGameStatus } from "src/enum-types";

export const StatisticsGameCard = ({ game }: { game: StatisticsGame }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const dateFormatter = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const dateString = dateFormatter.format(game.startTime);
  const dateAndTime = `${dateString} - ${parseTimeFromMinutes(
    getMins(game.startTime)
  )} till ${parseTimeFromMinutes(getMins(game.endTime))}`;

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<StackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.wrapper}
      onPress={() => navigation.push("StatisticsGameDetails", { id: game.id })}
    >
      <View style={styles.leftImageView}>
        <Image
          source={
            game.type === GameType.Basketball
              ? require("assets/images/home/basketball.png")
              : game.type === GameType.Football
              ? require("assets/images/home/football.png")
              : require("assets/images/home/tennis.png")
          }
          style={styles.leftImage}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.textRow}>
          <FeatherIcon
            name={"calendar"}
            size={14}
            color={colors.tertiary}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.greyText}>{dateAndTime}</Text>
        </View>
        <View style={styles.textRow}>
          <FeatherIcon
            name={"loader"}
            size={14}
            color={colors.tertiary}
            style={{ marginRight: 5 }}
          />
          <Text>Status: </Text>
          <Text
            style={{
              textTransform: "capitalize",
              color:
                game.status === StatisticsGameStatus.PENDING ||
                game.status === StatisticsGameStatus.INPROGRESS
                  ? "brown"
                  : "green",
            }}
          >
            {game.status === StatisticsGameStatus.PENDING ||
            game.status === StatisticsGameStatus.INPROGRESS
              ? "In Progress"
              : game.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      justifyContent: "flex-end",
      borderRadius: 10,
      marginBottom: 10,
      paddingLeft: 55,
      minHeight: 100,
    },
    content: {
      padding: 15,
      flex: 1,
      backgroundColor: colors.secondary,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      justifyContent: "center",
    },
    leftImageView: {
      width: 55,
      left: 0,
      top: 0,
      bottom: 0,
      position: "absolute",
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      overflow: "hidden",
      justifyContent: "center",
    },
    leftImage: {
      height: "120%",
      width: "140%",
    },
    greyText: {
      color: colors.tertiary,
      fontFamily: "Poppins-Regular",
      fontSize: 12,
      lineHeight: 23,
    },
    text: {
      color: colors.tertiary,
      fontFamily: "Poppins-Bold",
    },
    textRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
