import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Image,
  Platform,
} from "react-native";
import { useTheme, Button, Avatar } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import EntypoIcon from "react-native-vector-icons/Entypo";
import {
  useEditJoinRequestMutation,
  useRespondToInviteMutation,
} from "src/api";
import { BottomTabParamList, StackParamList } from "src/navigation";
import { Game } from "src/types";
import { Skeleton } from "./Skeleton";

export const InvitationCardSkeleton = () => {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(colors, height, width);

  return (
    <View style={[styles.wrapper, { marginLeft: 20 }]}>
      <Skeleton style={styles.header} />
      <View style={styles.content}>
        <Skeleton style={styles.profilePicture} />
        <Skeleton height={60} style={{ maxWidth: 0.45 * width }} />
        <View style={styles.buttonsView}>
          <Skeleton height={40} style={{ borderRadius: 5, flex: 1 }} />
          <Skeleton
            height={40}
            style={{ borderRadius: 5, flex: 1, marginHorizontal: 10 }}
          />
          <EntypoIcon
            name="dots-three-horizontal"
            color={colors.tertiary}
            size={18}
          />
        </View>
      </View>
    </View>
  );
};

export const InvitationCard = ({
  id,
  user,
  type,
  game,
  isFirst,
  isLast,
  profilePhotoUrl,
}: {
  id: number;
  user: string;
  type: "invitation" | "request";
  game: Game;
  isFirst: boolean;
  isLast: boolean;
  profilePhotoUrl?: string;
}) => {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(colors, height, width);

  const hours = game.startTime.getHours();
  const minutes = game.startTime.getMinutes();
  const amPm = hours >= 12 ? "pm" : "am";

  const timeString =
    (hours % 12 || 12).toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    amPm;

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<StackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  const { mutate: editJoinRequest } = useEditJoinRequestMutation();
  const { mutate: respondToInvite } = useRespondToInviteMutation();

  return (
    <View
      style={[
        styles.wrapper,
        isFirst ? { marginLeft: 20 } : {},
        isLast ? { marginRight: 20 } : {},
      ]}
    >
      <Image
        source={
          game.type === "Basketball"
            ? require("assets/images/home/basketball.png")
            : game.type === "Football"
            ? require("assets/images/home/football.png")
            : require("assets/images/home/tennis.png")
        }
        style={styles.header}
      />
      <View style={styles.content}>
        <View style={styles.profilePicture}>
          {profilePhotoUrl ? (
            <Avatar.Image
              size={60}
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
              size={60}
              style={{
                backgroundColor: colors.background,
              }}
            />
          )}
        </View>
        <View style={{ maxWidth: 0.48 * width }}>
          <Text style={styles.greyText}>
            <Text style={styles.text}>{user}</Text>
            {type === "invitation"
              ? " invited you to play "
              : " requested to join your "}
            <Text style={styles.text}>{game.type}</Text>
            {type === "request" ? " game " : " "}on{" "}
            <Text style={styles.text}>
              {game.startTime
                .toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
                .slice(0, Platform.OS === "ios" ? -5 : -6)}
              , {timeString}
            </Text>
            , at <Text style={styles.text}>{game.court.branch.venue.name}</Text>
            .
          </Text>
        </View>
        <View style={{ marginTop: "auto" }}>
          <View style={styles.buttonsView}>
            <View style={{ flex: 1 }}>
              <Button
                icon={"account-check-outline"}
                mode="contained"
                onPress={() => {
                  if (type === "request")
                    editJoinRequest({
                      requestId: id,
                      status: "APPROVED",
                      gameId: game.id,
                    });
                  else
                    respondToInvite({
                      invitationId: id,
                      gameId: game.id,
                      status: "APPROVED",
                    });
                }}
              >
                Accept
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                icon={{ source: "account-remove-outline", direction: "rtl" }}
                textColor={colors.primary}
                onPress={() => {
                  if (type === "request")
                    editJoinRequest({
                      requestId: id,
                      status: "REJECTED",
                      gameId: game.id,
                    });
                  else
                    respondToInvite({
                      invitationId: id,
                      gameId: game.id,
                      status: "REJECTED",
                    });
                }}
              >
                Decline
              </Button>
            </View>
            <EntypoIcon
              name="dots-three-horizontal"
              color={colors.tertiary}
              size={18}
              onPress={() =>
                navigation.push("GameDetails", {
                  id: game.id,
                })
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: MD3Colors, height: number, width: number) =>
  StyleSheet.create({
    wrapper: {
      width: 0.7 * width,
      borderRadius: 10,
      justifyContent: "flex-end",
      marginHorizontal: 5,
    },
    content: {
      backgroundColor: colors.secondary,
      padding: 15,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      flexGrow: 1,
    },
    header: {
      alignSelf: "center",
      height: 50,
      width: "100%",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    profilePicture: {
      position: "absolute",
      top: -30,
      right: "7%",
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: colors.tertiary,
      fontFamily: "Poppins-Bold",
      lineHeight: 20,
    },
    greyText: {
      color: colors.tertiary,
      fontSize: 12,
      fontFamily: "Poppins-Regular",
    },
    buttonsView: {
      flexDirection: "row",
      marginTop: 15,
      paddingRight: 10,
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
