import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";

export const VenueCard = () => {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const styles = makeStyles(colors, height);

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <View style={styles.promotedView}>
          <Text style={styles.promoted}>Promoted</Text>
        </View>
        <IonIcon name={"basketball-outline"} size={35} color={"white"} />
        <View style={styles.textView}>
          <Text style={styles.title}>Basketball Hub</Text>
          <View style={styles.ratingView}>
            <IonIcon name={"star"} color={colors.primary} />
            <Text style={styles.rating}>3.6</Text>
            <Text style={styles.location}> • Beirut, Lebanon</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: MD3Colors, height: number) =>
  StyleSheet.create({
    wrapper: {
      height: 0.28 * height,
      backgroundColor: colors.primary,
      justifyContent: "flex-end",
      marginRight: 10,
      borderRadius: 10,
    },
    content: {
      flexDirection: "row",
      backgroundColor: colors.secondary,
      padding: 15,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    promotedView: {
      position: "absolute",
      top: -26,
      right: 5,
      backgroundColor: colors.secondary,
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 20,
      opacity: 0.9,
    },
    promoted: {
      color: colors.tertiary,
      fontSize: 10,
      fontFamily: "Inter-SemiBold",
    },
    textView: {
      paddingHorizontal: 10,
    },
    title: {
      color: "white",
      fontFamily: "Inter-SemiBold",
    },
    ratingView: {
      flexDirection: "row",
      alignItems: "center",
    },
    rating: {
      color: "white",
      fontFamily: "Inter-Medium",
      fontSize: 12,
      marginLeft: 5,
    },
    location: {
      color: colors.tertiary,
      fontFamily: "Inter-Medium",
      fontSize: 12,
      lineHeight: 20,
    },
  });
