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
import IonIcon from "react-native-vector-icons/Ionicons";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";
import "intl";
import "intl/locale-data/jsonp/en";
import { Game } from "src/types";

export const BookingCard = ({ booking }: { booking: Game }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const endTime = new Date(
    booking.date.getTime() + booking.duration * 60 * 1000
  );
  const dateFormatter = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const durationTimeFormatter = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
  });
  const dateString = dateFormatter.format(booking.date);
  const startTimeString = durationTimeFormatter.format(booking.date);
  const endTimeString = durationTimeFormatter.format(endTime);
  const dateAndTime = `${dateString} - ${startTimeString} till ${endTimeString}`;

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
      onPress={() => navigation.push("GameDetails", { id: booking.id })}
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
    </Pressable>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      justifyContent: "flex-end",
      borderRadius: 10,
      marginBottom: 10,
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
      height: 108,
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
