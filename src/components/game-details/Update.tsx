import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { View, StyleSheet, Image } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useEditJoinRequestMutation, usePlayerStatusQuery } from "src/api";

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

export const Update = ({
  name,
  type,
  friendName,
  requestId,
  gameId,
  date,
}: {
  name: string;
  type: textOptions;
  friendName?: string;
  requestId?: number;
  gameId: number;
  date: Date;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { data: playerStatus } = usePlayerStatusQuery(gameId);
  const { mutate: editJoinRequest } = useEditJoinRequestMutation();

  if (!playerStatus) return <View />;
  else
    return (
      <View style={styles.wrapperView}>
        <Image
          source={require("assets/images/home/profile-picture.png")}
          style={styles.profilePicture}
          resizeMode="contain"
        />
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
                  .slice(0, -6)}
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
                <Button
                  icon={"account-check-outline"}
                  style={{ borderRadius: 5, flex: 1 }}
                  textColor={colors.secondary}
                  buttonColor={colors.primary}
                  onPress={() => {
                    if (requestId)
                      editJoinRequest({
                        requestId,
                        status: "APPROVED",
                        gameId,
                      });
                  }}
                >
                  Accept
                </Button>
                <Button
                  icon={{ source: "account-remove-outline", direction: "rtl" }}
                  style={{ borderRadius: 5, flex: 1 }}
                  textColor={"white"}
                  buttonColor={"transparent"}
                  onPress={() => {
                    if (requestId)
                      editJoinRequest({
                        requestId,
                        status: "REJECTED",
                        gameId,
                      });
                  }}
                >
                  Decline
                </Button>
              </View>
            )}
        </View>
      </View>
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
      height: 40,
      width: 40,
      margin: 15,
      marginTop: 20,
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
