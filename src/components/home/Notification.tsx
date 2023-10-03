import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { BottomTabParamList, StackParamList } from "src/navigation";
import { Game } from "src/types";

export const Notification = ({
  type,
  user,
  game,
  isLast,
  profilePhotoUrl,
}: {
  type: "invitation" | "request";
  user: string;
  game: Game;
  isLast: boolean;
  profilePhotoUrl?: string;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<StackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.wrapper,
        {
          borderBottomWidth: isLast ? 0 : 1,
        },
      ]}
      onPress={() =>
        navigation.push("GameDetails", {
          id: game.id,
        })
      }
    >
      <View style={styles.profilePicture}>
        {profilePhotoUrl ? (
          <Avatar.Image
            size={28}
            source={{ uri: profilePhotoUrl }}
            style={{ backgroundColor: "transparent" }}
          />
        ) : (
          <Avatar.Text
            label={
              user
                ? `${user.charAt(0)}${user
                    .substring(user.indexOf(" ") + 1)
                    .charAt(0)}`
                : ""
            }
            labelStyle={{ fontFamily: "Poppins-Regular" }}
            size={28}
            style={{
              backgroundColor: colors.secondary,
            }}
          />
        )}
      </View>
      <Text style={styles.text}>
        {type === "invitation"
          ? `You have been invited by ${user} to join a match.`
          : `${user} has requested to join your match.`}
      </Text>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      padding: 16,
      alignItems: "center",
      borderColor: colors.secondary,
    },
    profilePicture: {
      height: 28,
      width: 28,
      marginRight: 12,
    },
    text: {
      fontFamily: "Poppins-Regular",
      fontSize: 12,
      color: colors.tertiary,
      maxWidth: "90%",
    },
  });
