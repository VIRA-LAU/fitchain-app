import { Image, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Skeleton } from "../home";
import { GameType } from "src/types";

export const VenueBookingSkeleton = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.wrapper}>
      <Skeleton height={70} width={80} style={styles.leftImageView} />
      <View style={styles.contentView}>
        <Skeleton height={20} width={80} />
        <Skeleton height={20} width={100} />
      </View>
    </View>
  );
};

export const VenueBooking = ({
  type,
  startTime,
  endTime,
  gameType,
  adminName,
}: {
  type: "available" | "confirmed";
  startTime: string;
  endTime: string;
  gameType: GameType;
  adminName?: string;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.leftImageView,
          {
            height: adminName ? 90 : 70,
          },
        ]}
      >
        <Image
          source={
            gameType === "Basketball"
              ? require("assets/images/home/basketball.png")
              : gameType === "Football"
              ? require("assets/images/home/football.png")
              : require("assets/images/home/tennis.png")
          }
          style={styles.leftImage}
        />
      </View>
      <View style={styles.contentView}>
        <View>
          {type === "available" && (
            <Text style={[styles.typeText, { color: "#6b9f63" }]}>
              Available
            </Text>
          )}
          {type === "confirmed" && (
            <View>
              <Text style={[styles.typeText, { color: colors.primary }]}>
                Confirmed
              </Text>
              <Text style={styles.confirmedInfo}>Booked by {adminName}</Text>
            </View>
          )}
          <Text style={styles.confirmedInfo}>Court Name: {gameType}</Text>
        </View>
        <Text style={styles.timeSlotText}>
          {startTime} - {endTime}
        </Text>
      </View>
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.secondary,
      flexDirection: "row",
      borderRadius: 7,
      marginVertical: 5,
      elevation: 5,
    },
    contentView: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flex: 1,
    },
    leftImageView: {
      width: 35,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      overflow: "hidden",
      justifyContent: "center",
    },
    leftImage: {
      height: "120%",
      width: "140%",
    },
    typeText: {
      fontFamily: "Inter-Medium",
      fontSize: 16,
    },
    confirmedInfo: {
      fontFamily: "Inter-Medium",
      fontSize: 12,
      color: colors.tertiary,
    },
    timeSlotText: {
      fontFamily: "Inter-Medium",
      fontSize: 14,
      color: colors.tertiary,
    },
  });
