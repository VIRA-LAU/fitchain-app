import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";
import IonIcon from "react-native-vector-icons/Ionicons";

export const BookingCard = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <Text style={[styles.greyText, { fontSize: 14 }]}>
          <Text style={styles.text}>Basketball Game</Text> By{" "}
          <Text style={styles.text}>Alain H.</Text>
        </Text>
        <View style={styles.textRow}>
          <IonIcon
            name={"location-outline"}
            size={14}
            color={colors.tertiary}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.greyText}>Hoops - Furn el Chebbak</Text>
        </View>
        <View style={styles.textRow}>
          <FeatherIcon
            name={"calendar"}
            size={14}
            color={colors.tertiary}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.greyText}>Fri Oct 2 - 22:15 till 00:15</Text>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      justifyContent: "flex-end",
      borderRadius: 10,
      marginBottom: 20,
    },
    content: {
      padding: 15,
      flex: 1,
      marginLeft: "15%",
      backgroundColor: colors.secondary,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
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
