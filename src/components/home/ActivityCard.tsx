import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";

export const ActivityCard = ({
  gameType,
}: {
  gameType: "basketball" | "football" | "tennis";
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
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
        style={styles.gameIcon}
      />
      <View style={styles.textView}>
        <Text style={styles.greyText}>
          <Text style={styles.text}>Won</Text> a basketball game.
        </Text>
        <Text style={[styles.greyText, { fontSize: 10 }]}>Today</Text>
      </View>

      <FeatherIcon
        name="chevron-right"
        color={colors.tertiary}
        size={20}
        style={{ marginLeft: "auto" }}
      />
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      borderRadius: 10,
      backgroundColor: colors.secondary,
      padding: 15,
      marginBottom: 20,
      paddingBottom: 20,
    },
    gameIcon: {
      width: 35,
      aspectRatio: 1,
    },
    textView: {
      marginLeft: 15,
    },
    greyText: {
      color: colors.tertiary,
      fontFamily: "Inter-Medium",
    },
    text: {
      color: "white",
      fontFamily: "Inter-SemiBold",
    },
  });
