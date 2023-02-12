import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Image,
} from "react-native";
import { useTheme, Button } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import EntypoIcon from "react-native-vector-icons/Entypo";

export const InvitationCard = ({
  gameType,
}: {
  gameType: "basketball" | "football" | "tennis";
}) => {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(colors, height, width);
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
        style={styles.header}
      />
      <View style={styles.content}>
        <Image
          source={require("assets/images/home/profile-picture.png")}
          style={styles.profilePicture}
        />
        <View style={{ maxWidth: 0.48 * width }}>
          <Text style={styles.greyText}>
            <Text style={styles.text}>Alain H.</Text> invited you to play{" "}
            <Text style={styles.text}>Basketball</Text> this{" "}
            <Text style={styles.text}>Monday, 8:15pm</Text>, at{" "}
            <Text style={styles.text}>Hoops - Furn el Chebbak</Text>.
          </Text>
        </View>
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
          <EntypoIcon name="dots-three-horizontal" color="white" size={18} />
          <View></View>
          <View></View>
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
      marginRight: 10,
    },
    content: {
      backgroundColor: colors.secondary,
      padding: 15,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
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
      height: "55%",
      top: "-27.5%",
      right: "6%",
      aspectRatio: 1,
      borderRadius: 50,
    },
    text: {
      color: "white",
      fontFamily: "Inter-SemiBold",
      lineHeight: 20,
    },
    greyText: {
      color: colors.tertiary,
      fontSize: 12,
      fontFamily: "Inter-Medium",
    },
    buttonView: {
      flexDirection: "row",
      marginTop: 15,
      paddingRight: 10,
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
