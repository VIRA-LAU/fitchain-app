import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";

export const VenueCard = ({
  name,
  location,
  rating,
}: {
  name: string;
  location: string;
  rating: string;
}) => {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const styles = makeStyles(colors, height);

  return (
    <View style={styles.wrapper}>
      <Image
        source={require("assets/images/home/basketball-hub.png")}
        style={styles.header}
      />
      <View style={styles.content}>
        <View style={styles.promotedView}>
          <Text style={styles.promoted}>Promoted</Text>
        </View>
        <Image
          source={require("assets/images/home/basketball-hub-icon.png")}
          style={{ width: 35, aspectRatio: 1 }}
        />
        <View style={styles.textView}>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.ratingView}>
            <IonIcon name={"star"} color={colors.primary} />
            <Text style={styles.rating}>{rating}</Text>
            <Text style={styles.location}> • {location}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: MD3Colors, height: number) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.primary,
      justifyContent: "flex-end",
      marginRight: 10,
      borderRadius: 10,
    },
    header: {
      height: 128,
      width: "100%",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
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
