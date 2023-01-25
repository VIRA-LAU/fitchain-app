import {
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
  StatusBar,
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
      <Text style={styles.logo}>FITCHAIN</Text>
      <View style={styles.buttonsView}>
        <View style={styles.buttonView}>
          <Text style={styles.buttonText}>Sign up with Google</Text>
        </View>

        <View style={styles.buttonView}>
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
      height: "100%",
      alignContent: "center",
      justifyContent: "center",
      backgroundColor: "black",
    },
    logo: {
      color: "white",
      fontSize: 60 / fontScale,
      textAlign: "center",
    },
    buttonsView: {
      marginTop: "20%",
      alignItems: "center",
    },
    buttonView: {
      height: 45,
      width: "73%",
      marginVertical: 7,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ebebeb",
      borderRadius: 7,
    },
    buttonText: {
      fontSize: 15 / fontScale,
      textAlign: "center",
      fontFamily: "Inter-Medium",
    },
  });
