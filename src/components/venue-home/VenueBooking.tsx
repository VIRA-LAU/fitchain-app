import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Skeleton } from "../home";

export const VenueBookingSkeleton = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.wrapper}>
      <Skeleton height={20} width={80} />
      <Skeleton height={20} width={100} />
    </View>
  );
};

export const VenueBooking = ({
  type,
  startTime,
  endTime,
  adminName,
}: {
  type: "available" | "confirmed";
  startTime: string;
  endTime: string;
  adminName?: string;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.wrapper}>
      {type === "available" && (
        <Text style={[styles.typeText, { color: "#6b9f63" }]}>Available</Text>
      )}
      {type === "confirmed" && (
        <View>
          <Text style={[styles.typeText, { color: colors.primary }]}>
            Confirmed
          </Text>
          <Text style={styles.confirmedInfo}>Booked by {adminName}</Text>
        </View>
      )}
      <Text style={styles.timeSlotText}>
        {startTime} - {endTime}
      </Text>
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.secondary,
      borderRadius: 7,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 15,
      marginVertical: 5,
      elevation: 5,
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
