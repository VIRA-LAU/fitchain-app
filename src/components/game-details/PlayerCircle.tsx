import { Text, useTheme } from "react-native-paper";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { User } from "src/types";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

export const ScorePlayerCircle = ({
  player,
  scored,
  missed,
  isAdmin,
}: {
  player?: User;
  scored: number;
  missed: number;
  isAdmin: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity
      style={styles.wrapperView}
      activeOpacity={player ? 0.6 : 1}
    >
      <View style={styles.circleView}>
        <FeatherIcon name={"user-plus"} color={"white"} size={24} />
      </View>
      <View style={{ marginTop: 5, alignItems: "center" }}>
        <Text variant="titleSmall" style={{ color: colors.tertiary }}>
          {player
            ? `${player.firstName} ${player.lastName}`
            : isAdmin
            ? "Assign Player"
            : "Unassigned"}
        </Text>
        <Text
          variant="titleSmall"
          style={{ color: colors.tertiary, fontFamily: "Inter-Medium" }}
        >
          Scored: {scored}
          {"\n"}Missed: {missed}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const TopPlayerCircle = ({
  achievement,
  player,
  isAdmin,
}: {
  achievement: string;
  player?: User;
  isAdmin: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity
      style={styles.wrapperView}
      activeOpacity={player ? 0.6 : 1}
    >
      <View style={styles.circleView}>
        <FeatherIcon name={"user-plus"} color={"white"} size={24} />
      </View>
      <View style={{ marginTop: 5, alignItems: "center" }}>
        <Text variant="titleSmall" style={{ color: colors.tertiary }}>
          {achievement}
        </Text>
        <Text
          variant="titleSmall"
          style={{ color: colors.tertiary, fontFamily: "Inter-Medium" }}
        >
          {player
            ? `${player.firstName} ${player.lastName}`
            : isAdmin
            ? "Assign Player"
            : "Unassigned"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      width: 120,
      alignItems: "center",
    },
    circleView: {
      width: "55%",
      aspectRatio: 1,
      borderWidth: 2,
      borderColor: "white",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 90,
    },
  });
