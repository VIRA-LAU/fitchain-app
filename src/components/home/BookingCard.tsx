import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";
import IonIcon from "react-native-vector-icons/Ionicons";

export const BookingCard = ({
  gameType,
  location,
  date,
  inviter,
  gameDuration,
}: {
  gameType: "basketball" | "football" | "tennis";
  location: string;
  date: Date;
  inviter: string;
  gameDuration: number;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const gameDurationHours = gameDuration / 60;
  const endTime = new Date(date.getTime() + gameDurationHours * 60 * 60 * 1000);
  const dateFormatter = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const startTimeFormatter = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
  });
  const endTimeFormatter = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
  });
  const dateString = dateFormatter.format(date);
  const startTimeString = startTimeFormatter.format(date);
  const endTimeString = endTimeFormatter.format(endTime);
  const dateAndTime = `${dateString} - ${startTimeString} till ${endTimeString}`;

  return (
    <View style={styles.wrapper}>
      <Image
        source={
          gameType === "basketball"
            ? require("assets/images/home/basketball.png")
            : gameType === "football"
            ? require("assets/images/home/football.png")
            : require("assets/images/home/tennis.png")
        }
        style={styles.leftImage}
      />
      <View style={styles.content}>
        <Text style={[styles.greyText, { fontSize: 14 }]}>
          <Text style={styles.text}>
            {gameType[0].toUpperCase()}
            {gameType.substring(1)} Game
          </Text>{" "}
          By <Text style={styles.text}>{inviter}</Text>
        </Text>
        <View style={styles.textRow}>
          <IonIcon
            name={"location-outline"}
            size={14}
            color={colors.tertiary}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.greyText}>{location}</Text>
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
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      justifyContent: "flex-end",
      borderRadius: 10,
      marginBottom: 20,
    },
    content: {
      padding: 15,
      flex: 1,
      backgroundColor: colors.secondary,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      justifyContent: "center",
    },
    leftImage: {
      width: "16%",
      height: 108,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
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
