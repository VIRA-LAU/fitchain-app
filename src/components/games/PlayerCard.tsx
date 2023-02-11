import { View, StyleSheet, Image, useWindowDimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";

export const PlayerCard = ({ isActive = false }: { isActive?: boolean }) => {
  const { colors } = useTheme();
  const windowWidth = useWindowDimensions().width;
  const styles = makeStyles(colors, windowWidth);
  return (
    <View
      style={[
        styles.wrapperView,
        isActive
          ? { elevation: 15, transform: [{ scale: 1.1 }], zIndex: 2 }
          : { elevation: 10, opacity: 0.6 },
      ]}
    >
      <Image
        source={require("assets/images/home/basketball-hub.png")}
        style={styles.header}
      />
      <View style={{ alignItems: "center", paddingTop: 40 }}>
        <Image
          source={require("assets/images/home/profile-picture.png")}
          style={styles.profilePicture}
          resizeMode="contain"
        />
        <Text style={styles.name}>Mazen K.</Text>
        <View style={styles.ratingView}>
          <IonIcon name={"star"} color={"white"} />
          <Text style={styles.ratingText}>3.6</Text>
        </View>
        <View style={styles.statusView}>
          <Text style={styles.statusText}>Confirmed</Text>
        </View>
        <IonIcon
          name="ellipsis-horizontal"
          color={"white"}
          size={24}
          style={{ marginVertical: 5 }}
        />
      </View>
    </View>
  );
};

const makeStyles = (colors: MD3Colors, windowWidth: number) =>
  StyleSheet.create({
    wrapperView: {
      width: 0.4 * windowWidth,
      height: 235,
      backgroundColor: colors.secondary,
      borderRadius: 10,
      alignItems: "center",
      marginRight: 5,
    },
    header: {
      height: 75,
      width: "100%",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    profilePicture: {
      position: "absolute",
      height: "55%",
      top: "-27.5%",
      aspectRatio: 1,
      borderRadius: 50,
    },
    name: {
      color: "white",
      fontFamily: "Inter-SemiBold",
      fontSize: 16,
    },
    ratingView: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 3,
      justifyContent: "center",
    },
    ratingText: {
      color: "white",
      fontFamily: "Inter-Medium",
      marginLeft: 5,
    },
    statusView: {
      borderWidth: 1,
      borderColor: colors.tertiary,
      borderRadius: 20,
      width: 100,
      alignItems: "center",
      marginTop: 5,
    },
    statusText: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      padding: 5,
    },
  });
