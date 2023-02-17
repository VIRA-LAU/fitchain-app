import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";

type styleOptions = "vertical" | "horizontal" | "focused";

export const VenueCard = ({
  type,
  promoted = true,
}: {
  type: styleOptions;
  promoted?: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors, type === "horizontal", type === "focused");

  return (
    <View style={styles.wrapper}>
      <Image
        source={require("assets/images/home/basketball-hub.png")}
        style={styles.image}
      />
      <View style={styles.content}>
        {promoted && (
          <View style={styles.promotedView}>
            <Text style={styles.promoted}>Promoted</Text>
          </View>
        )}
        <Image
          source={require("assets/images/home/basketball-hub-icon.png")}
          style={{ width: 35, aspectRatio: 1 }}
        />
        <View style={styles.textView}>
          <Text style={styles.title}>Basketball Hub</Text>
          <View style={styles.ratingView}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IonIcon name={"star"} color={colors.primary} />
              <Text style={styles.rating}>3.6</Text>
            </View>
            <Text style={styles.location}>
              {type !== "horizontal" && " • "}Beirut, Lebanon
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (
  colors: MD3Colors,
  isHorizontal: boolean,
  isFocused: boolean
) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: isHorizontal ? "row" : "column",
      justifyContent: "flex-end",
      marginRight: isHorizontal || isFocused ? 0 : 10,
      marginBottom: isHorizontal || isFocused ? 20 : 0,
      borderRadius: 10,
    },
    image: {
      height: isHorizontal ? "100%" : 128,
      width: isHorizontal ? "50%" : "100%",
      backgroundColor: "red",
      borderTopLeftRadius: 10,
      borderTopRightRadius: isHorizontal ? 0 : 10,
      borderBottomLeftRadius: isHorizontal ? 10 : 0,
    },
    content: {
      flex: 1,
      flexDirection: isHorizontal ? "column" : "row",
      backgroundColor: colors.secondary,
      padding: 15,
      borderBottomLeftRadius: isHorizontal ? 0 : 10,
      borderBottomRightRadius: 10,
      borderTopRightRadius: isHorizontal ? 10 : 0,
    },
    promotedView: {
      position: "absolute",
      top: isFocused ? 10 : -26,
      right: isFocused ? 10 : 5,
      backgroundColor: colors.secondary,
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 20,
      opacity: 0.9,
      borderWidth: isFocused ? 1 : 0,
      borderColor: colors.primary,
    },
    promoted: {
      color: isFocused ? colors.primary : colors.tertiary,
      fontSize: isFocused ? 12 : 10,
      fontFamily: "Inter-SemiBold",
    },
    textView: {
      paddingHorizontal: isHorizontal ? 0 : 10,
      paddingTop: isHorizontal ? 10 : 0,
    },
    title: {
      color: "white",
      fontFamily: "Inter-SemiBold",
    },
    ratingView: {
      flexDirection: isHorizontal ? "column" : "row",
      alignItems: isHorizontal ? "flex-start" : "center",
    },
    rating: {
      color: "white",
      fontFamily: "Inter-Medium",
      fontSize: 12,
      marginLeft: 5,
      paddingVertical: isHorizontal ? 5 : 0,
    },
    location: {
      color: colors.tertiary,
      fontFamily: "Inter-Medium",
      fontSize: 12,
      lineHeight: 20,
    },
  });
