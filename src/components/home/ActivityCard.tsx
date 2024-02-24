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
import { BottomTabParamList, HomeStackParamList } from "src/navigation";
import { Activity } from "src/types";
import { Skeleton } from "./Skeleton";
import { GameType } from "src/enum-types";

export const ActivityCardSkeleton = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.wrapper}>
      <Skeleton style={[styles.gameIcon, { borderRadius: 18 }]} />
      <View style={{ width: "100%", marginLeft: 15 }}>
        <Skeleton height={15} width={"50%"} />
        <Skeleton height={15} width={"30%"} style={{ marginTop: 5 }} />
      </View>
    </View>
  );
};

export const ActivityCard = ({
  gameId,
  startTime,
  type,
  isWinner,
}: Activity) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  // const dateHeader = useMemo(() => {
  //   const bookingDate = new Date(
  //     startTime
  //       .toISOString()
  //       .substring(0, new Date(startTime).toISOString().indexOf("T"))
  //   );
  //   const todayDate = new Date(
  //     new Date()
  //       .toISOString()
  //       .substring(0, new Date().toISOString().indexOf("T"))
  //   );
  //   const dayDiff =
  //     (todayDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24);

  //   if (dayDiff === 0) return "Today";
  //   else if (dayDiff === 1) return "Yesterday";
  //   else if (dayDiff <= 7) return "Last Week";
  //   else if (dayDiff <= 30) return "Last Month";
  //   else return "In the Past";
  // }, []);

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.wrapper}
      onPress={() => navigation.push("GameDetails", { id: gameId })}
    >
      <Image
        source={
          type === GameType.Basketball
            ? require("assets/images/home/basketball.png")
            : type === GameType.Football
            ? require("assets/images/home/football.png")
            : require("assets/images/home/tennis.png")
        }
        style={styles.gameIcon}
      />
      <View style={styles.textView}>
        {isWinner === "DRAW" ? (
          <Text style={styles.greyText}>
            {type} game ended in a <Text style={styles.text}>Draw</Text>.
          </Text>
        ) : (
          <Text style={styles.greyText}>
            <Text style={styles.text}>{isWinner ? "Won" : "Lost"}</Text> a{" "}
            {type[0].toLowerCase()}
            {type.substring(1)} game.
          </Text>
        )}
        {/* <Text style={[styles.greyText, { fontSize: 10 }]}>{dateHeader}</Text> */}
      </View>

      <FeatherIcon
        name="chevron-right"
        color={colors.tertiary}
        size={20}
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      borderRadius: 10,
      backgroundColor: colors.secondary,
      padding: 16,
      marginBottom: 10,
      alignItems: "center",
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
      fontFamily: "Poppins-Regular",
    },
    text: {
      color: colors.tertiary,
      fontFamily: "Poppins-Bold",
    },
  });
