import { Avatar, Text, useTheme } from "react-native-paper";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { User } from "src/types";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

export const ScorePlayerCircle = ({
  user,
  scored,
  missed,
  isAdmin,
}: {
  user?: User;
  scored: number;
  missed: number;
  isAdmin: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.wrapperView}>
      <View style={{ marginTop: 5, alignItems: "center" }}>
        {!user ? (
          <View style={styles.circleView}>
            <FeatherIcon name={"user-plus"} color={"white"} size={24} />
          </View>
        ) : (
          <View style={styles.profilePhoto}>
            {user.profilePhotoUrl ? (
              <Avatar.Image
                source={{ uri: user.profilePhotoUrl }}
                style={{ backgroundColor: "transparent" }}
              />
            ) : (
              <Avatar.Text
                label={
                  user.firstName
                    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                    : ""
                }
                labelStyle={{ fontFamily: "Poppins-Regular", fontSize: 20 }}
                style={{
                  backgroundColor: colors.background,
                }}
              />
            )}
          </View>
        )}
        <Text variant="titleSmall" style={{ color: colors.tertiary }}>
          {user
            ? `${user.firstName} ${user.lastName}`
            : isAdmin
            ? "Assign Player"
            : "Unassigned"}
        </Text>
        <Text
          variant="titleSmall"
          style={{ color: colors.tertiary, fontFamily: "Poppins-Regular" }}
        >
          Scored: {scored}
          {"\n"}Missed: {missed}
        </Text>
      </View>
    </View>
  );
};

export const TopPlayerCircle = ({
  achievement,
  user,
  isAdmin,
}: {
  achievement: string;
  user?: User;
  isAdmin: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.wrapperView}>
      <View style={styles.circleView}>
        <FeatherIcon name={"user-plus"} color={"white"} size={24} />
      </View>
      <View style={{ marginTop: 5, alignItems: "center" }}>
        <Text variant="titleSmall" style={{ color: colors.tertiary }}>
          {achievement}
        </Text>
        <Text
          variant="titleSmall"
          style={{ color: colors.tertiary, fontFamily: "Poppins-Regular" }}
        >
          {user
            ? `${user.firstName} ${user.lastName}`
            : isAdmin
            ? "Assign Player"
            : "Unassigned"}
        </Text>
      </View>
    </View>
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
      marginBottom: 5,
    },
    profilePhoto: {
      width: "55%",
      borderRadius: 40,
      borderWidth: 2,
      borderColor: "white",
      marginBottom: 5,
    },
  });
