import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList, BottomTabParamList } from "src/navigation";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { Game } from "src/types";
import { useMemo } from "react";
import { Skeleton } from "./Skeleton";

export const UpcomingGameCardSkeleton = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.wrapper}>
      <View style={{ flex: 1, marginRight: 20 }}>
        <Skeleton height={15} width={"100%"} />
        <Skeleton height={15} width={"80%"} style={{ marginTop: 5 }} />
      </View>
      <Skeleton
        style={[
          styles.gameIcon,
          {
            borderRadius: 23,
          },
        ]}
      />
    </View>
  );
};

export const UpcomingGameCard = ({ game }: { game: Game }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  const location = `${game.court.branch.venue.name} - ${game.court.branch.location}`;
  const dateHeader = useMemo(() => {
    const bookingDate = new Date(
      game.date.toISOString().substring(0, game.date.toISOString().indexOf("T"))
    );
    const todayDate = new Date(
      new Date()
        .toISOString()
        .substring(0, new Date().toISOString().indexOf("T"))
    );
    const dayDiff =
      (bookingDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24);

    if (dayDiff === 0) return "Today";
    else if (dayDiff === 1) return "Tomorrow";
    else if (dayDiff <= 7) return "This Week";
    else if (dayDiff <= 30) return "This Month";
    else return "In the Future";
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.wrapper}
      onPress={() => navigation.push("GameDetails", { id: game.id })}
    >
      <View>
        {/* <Text style={styles.text}>This {weekday[game.date?.getDay()]},</Text> */}
        <Text style={styles.text}>{dateHeader},</Text>
        <Text style={styles.greyText}>
          {"at "}
          <Text style={styles.text}>{location}</Text>
        </Text>
      </View>
      <Image
        source={
          game.type === "Basketball"
            ? require("assets/images/home/basketball.png")
            : game.type === "Football"
            ? require("assets/images/home/football.png")
            : require("assets/images/home/tennis.png")
        }
        style={styles.gameIcon}
      />
    </TouchableOpacity>
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
