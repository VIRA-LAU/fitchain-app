import { Avatar, Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useEditJoinRequestMutation, usePlayerStatusQuery } from "src/api";
import { Skeleton } from "../home";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList, StackParamList } from "src/navigation";
import { PlayerStatus } from "src/types";

type textOptions =
  | "create"
  | "invitation"
  | "join-request"
  | "join"
  | "photo-upload";

const updateText = (type: textOptions) => {
  if (type === "create") return " created the game.";
  else if (type === "join-request") return " requested to join the game.";
  else if (type === "join") return " joined the game.";
  else if (type === "photo-upload") return " uploaded a photo.";
};

export const UpdateCardSkeleton = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.wrapperView}>
      <Skeleton height={40} width={40} style={styles.profilePicture} />
      <View style={styles.contentView}>
        <Skeleton height={15} width={"80%"} />
        <Skeleton height={15} width={"40%"} style={{ marginTop: 5 }} />
      </View>
    </View>
  );
};

export const UpdateCard = ({
  name,
  type,
  friendName,
  profilePhotoUrl,
  requestId,
  profileId,
  gameId,
  date,
  playerStatus,
}: {
  name: string;
  type: textOptions;
  friendName?: string;
  profilePhotoUrl?: string;
  requestId?: number;
  profileId?: number;
  gameId: number;
  date: Date;
  playerStatus?: PlayerStatus;
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

  const { mutate: editJoinRequest, isLoading: editRequestLoading } =
    useEditJoinRequestMutation();

  if (!playerStatus) return <View />;
  else
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.wrapperView}
        onPress={() => {
          navigation.push("PlayerProfile", {
            playerId: profileId!,
            firstName: friendName
              ? friendName.substring(0, friendName.indexOf(" "))
              : name.substring(0, name.indexOf(" ")),
            lastName: friendName
              ? friendName.substring(friendName.indexOf(" ") + 1)
              : name.substring(name.indexOf(" ") + 1),
          });
        }}
      >
        <View style={styles.profilePicture}>
          {profilePhotoUrl ? (
            <Avatar.Image
              size={40}
              source={{ uri: profilePhotoUrl }}
              style={{ backgroundColor: "transparent" }}
            />
          ) : (
            <Avatar.Text
              label={
                friendName
                  ? `${friendName.charAt(0)}${friendName
                      .substring(friendName.indexOf(" ") + 1)
                      .charAt(0)}`
                  : name
                  ? `${name.charAt(0)}${name
                      .substring(name.indexOf(" ") + 1)
                      .charAt(0)}`
                  : ""
              }
              labelStyle={{ fontFamily: "Inter-Medium", fontSize: 16 }}
              size={40}
              style={{
                backgroundColor: colors.background,
              }}
            />
          )}
        </View>
        <View style={styles.contentView}>
          <View style={styles.textView}>
            <View>
              <Text style={styles.text}>
                <Text style={{ fontFamily: "Inter-SemiBold", color: "white" }}>
                  {name}
                </Text>
                {type !== "invitation" && updateText(type)}
                {type === "invitation" && " invited "}
                {type === "invitation" && (
                  <Text
                    style={{ fontFamily: "Inter-SemiBold", color: "white" }}
                  >
                    {friendName}
                  </Text>
                )}
                {type === "invitation" && " to join the game."}
              </Text>
              <Text style={[styles.text, { fontSize: 12 }]}>
                {date
                  .toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                  .slice(0, Platform.OS === "ios" ? -5 : -6)}
              </Text>
            </View>
            {type !== "photo-upload" ? (
              <IonIcon name="ellipsis-horizontal" color={"white"} size={20} />
            ) : (
              <Image
                source={require("assets/images/home/uploaded-photo.png")}
                style={{ height: 40, width: 40 }}
                resizeMode="contain"
              />
            )}
          </View>
          {type === "join-request" &&
            (playerStatus.isAdmin ||
              playerStatus.hasBeenInvited === "APPROVED" ||
              playerStatus.hasRequestedtoJoin === "APPROVED") && (
              <View style={styles.buttonsView}>
                <View style={{ flex: 1 }}>
                  <Button
                    icon={"account-check-outline"}
                    mode="contained"
                    loading={editRequestLoading}
                    onPress={
                      !editRequestLoading
                        ? () => {
                            if (requestId)
                              editJoinRequest({
                                requestId,
                                status: "APPROVED",
                                gameId,
                              });
                          }
                        : undefined
                    }
                  >
                    Accept
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    icon={{
                      source: "account-remove-outline",
                      direction: "rtl",
                    }}
                    textColor={"white"}
                    loading={editRequestLoading}
                    onPress={
                      !editRequestLoading
                        ? () => {
                            if (requestId)
                              editJoinRequest({
                                requestId,
                                status: "REJECTED",
                                gameId,
                              });
                          }
                        : undefined
                    }
                  >
                    Decline
                  </Button>
                </View>
              </View>
            )}
        </View>
      </TouchableOpacity>
    );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flexDirection: "row",
      backgroundColor: colors.secondary,
      borderRadius: 10,
      marginBottom: 10,
    },
    profilePicture: {
      margin: 15,
      marginTop: 20,
      borderRadius: 20,
    },
    contentView: {
      flex: 1,
      marginVertical: 20,
      marginRight: 20,
    },
    textView: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    text: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      minWidth: "95%",
      maxWidth: "95%",
      marginBottom: 3,
    },
    buttonsView: {
      flexDirection: "row",
      marginTop: 15,
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
