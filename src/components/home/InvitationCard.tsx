import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useTheme, Button } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import EntypoIcon from "react-native-vector-icons/Entypo";

export const InvitationCard = () => {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(colors, height, width);
  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <View style={styles.picture} />
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
      height: 0.28 * height,
      maxHeight: 200,
      width: 0.7 * width,
      backgroundColor: colors.primary,
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
    picture: {
      position: "absolute",
      height: "55%",
      top: "-27.5%",
      right: "6%",
      aspectRatio: 1,
      backgroundColor: colors.background,
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
