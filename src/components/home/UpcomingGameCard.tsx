import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";

export const UpcomingGameCard = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.text}>This Monday,</Text>
        <Text style={styles.greyText}>
          {"at "}
          <Text style={styles.text}>Hoops - Furn el Chebbak.</Text>
        </Text>
      </View>
      <IonIcon name={"basketball-outline"} size={35} color={"white"} />
    </View>
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
  });
