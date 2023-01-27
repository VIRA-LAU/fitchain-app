import {
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { StyleSheet } from "react-native";
import OctIcon from "react-native-vector-icons/Octicons";
import type { StackScreenProps } from "@react-navigation/stack";
import { SignUpStackParamList } from "src/AppNavigator";

type Props = StackScreenProps<SignUpStackParamList, "SignUp">;

export const SignUp = ({ navigation }: Props) => {
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);

  StatusBar.setBackgroundColor("black", true);

  return (
    <View style={styles.wrapperView}>
      <Image source={require("assets/images/Logo.png")} style={styles.logo} />
      <View style={styles.buttonsView}>
        <View style={styles.buttonView}>
          <Image
            source={require("assets/images/Google-Icon.png")}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.buttonText}>Sign up with Google</Text>
        </View>

        <View style={styles.buttonView}>
          <Image
            source={require("assets/images/Apple-Icon.png")}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.buttonText}>Sign up with Apple</Text>
        </View>

        <TouchableOpacity
          style={styles.buttonView}
          onPress={() => navigation.push("SignUpWithNumber")}
        >
          <OctIcon name="device-mobile" size={20} style={{ marginRight: 15 }} />
          <Text style={styles.buttonText}>Sign up with Mobile Number</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const makeStyles = (fontScale: number) =>
  StyleSheet.create({
    wrapperView: {
      flex: 1,
      alignContent: "center",
      justifyContent: "center",
      backgroundColor: "black",
    },
    logo: {
      alignSelf: "center",
    },
    buttonsView: {
      marginTop: "20%",
      alignItems: "center",
    },
    buttonView: {
      height: 40,
      width: "73%",
      marginVertical: 7,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ebebeb",
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 15 / fontScale,
      textAlign: "center",
      fontFamily: "Inter-Medium",
    },
  });
