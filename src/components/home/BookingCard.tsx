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
import IonIcon from "react-native-vector-icons/Ionicons";
import { BottomTabParamList, StackParamList } from "src/navigation";
import "intl";
import "intl/locale-data/jsonp/en";
import { Game } from "src/types";
import { Skeleton } from "./Skeleton";
import { getMins, parseTimeFromMinutes } from "./TimeSlotPicker";

export const BookingCardSkeleton = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={[styles.wrapper, { height: 108 }]}>
      <View style={styles.leftImageView}>
        <Skeleton style={styles.leftImage} />
      </View>
      <View style={[styles.content, { justifyContent: "space-between" }]}>
        <Skeleton height={20} width={"100%"} />
        <View style={styles.textRow}>
          <IonIcon
            name={"location-outline"}
            size={14}
            color={colors.tertiary}
            style={{ marginRight: 5 }}
          />
          <Skeleton height={20} width={100} />
        </View>
        <View style={styles.textRow}>
          <FeatherIcon
            name={"calendar"}
            size={14}
            color={colors.tertiary}
            style={{ marginRight: 5 }}
          />
          <Skeleton height={20} width={100} />
        </View>
      </View>
    </View>
  );
};

export const BookingCard = ({
  booking,
  isPrevious,
}: {
  booking: Game;
  isPrevious: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const dateFormatter = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const dateString = dateFormatter.format(booking.startTime);
  const dateAndTime = `${dateString} - ${parseTimeFromMinutes(
    getMins(booking.startTime)
  )} till ${parseTimeFromMinutes(getMins(booking.endTime))}`;

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
      style={styles.wrapper}
      onPress={() =>
        navigation.push("GameDetails", { id: booking.id, isPrevious })
      }
    >
      <View style={styles.leftImageView}>
        <Image
          source={
            booking.type === "Basketball"
              ? require("assets/images/home/basketball.png")
              : booking.type === "Football"
              ? require("assets/images/home/football.png")
              : require("assets/images/home/tennis.png")
          }
          style={styles.leftImage}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.greyText, { fontSize: 14 }]}>
          <Text style={styles.text}>{booking.type} Game</Text> By{" "}
          <Text style={styles.text}>
            {booking?.admin?.firstName + " " + booking?.admin?.lastName}
          </Text>
        </Text>
        <View style={styles.textRow}>
          <IonIcon
            name={"location-outline"}
            size={14}
            color={colors.tertiary}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.greyText}>{booking.court.branch.location}</Text>
        </View>
        <View style={styles.textRow}>
          <FeatherIcon
            name={"calendar"}
            size={14}
            color={colors.tertiary}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.greyText}>{dateAndTime}</Text>
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
      fontFamily: "Inter-Medium",
      fontSize: 12,
      lineHeight: 23,
    },
    text: {
      color: "white",
      fontFamily: "Inter-SemiBold",
    },
    textRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
