import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { View, StyleSheet, Image } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";

type textOptions = "join-request" | "join" | "photo-upload";

const updateText = (type: textOptions) => {
  if (type === "join-request") return " requested to join the game.";
  else if (type === "join") return " joined the game.";
  else if (type === "photo-upload") return " uploaded a photo.";
};

export const Update = ({ type }: { type: textOptions }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
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
                Hadi M.
              </Text>
              {updateText(type)}
            </Text>
            <Text style={[styles.text, { fontSize: 12 }]}>Today</Text>
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
        {type === "join-request" && (
          <View style={styles.buttonView}>
            <Button
              icon={"account-check-outline"}
              style={{ borderRadius: 5, flex: 1 }}
              textColor={colors.secondary}
              buttonColor={colors.primary}
            >
              Accept
            </Button>
            <Button
              icon={{ source: "account-remove-outline", direction: "rtl" }}
              style={{ borderRadius: 5, flex: 1 }}
              textColor={"white"}
              buttonColor={"transparent"}
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
    },
    buttonView: {
      flexDirection: "row",
      marginTop: 15,
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
