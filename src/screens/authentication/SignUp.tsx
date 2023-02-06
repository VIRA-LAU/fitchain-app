import {
  useWindowDimensions,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
} from "react-native";
import { StyleSheet } from "react-native";
import OctIcon from "react-native-vector-icons/Octicons";
import type { StackScreenProps } from "@react-navigation/stack";
import { SignUpStackParamList } from "navigation";
import { Button, useTheme, Text } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dispatch, SetStateAction, useRef } from "react";

type Props = StackScreenProps<SignUpStackParamList, "SignUp">;

export const SignUp = ({
  navigation,
  route,
  setSignedIn,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
  setSignedIn: Dispatch<SetStateAction<boolean>>;
}) => {
  const { fontScale } = useWindowDimensions();
  const { colors } = useTheme();
  const styles = makeStyles(fontScale, colors);
  const emailRef: React.MutableRefObject<TextInput | null> = useRef(null);

  // StatusBar.setBackgroundColor("black", true);

  return (
    <View style={styles.wrapperView}>
      <Image source={require("assets/images/Logo.png")} style={styles.logo} />

      <View style={styles.buttonsView}>
        <View>
          <View style={styles.inputView}>
            <Text variant="labelLarge" style={styles.h2}>
              Please provide your email and password to sign in
            </Text>
            <View style={styles.textInputView}>
              <MaterialCommunityIcon
                name={"account-outline"}
                size={20}
                color={"#c9c9c9"}
                style={{ marginHorizontal: 15 }}
              />
              <TextInput
                style={styles.textInput}
                placeholder={"Full Name"}
                placeholderTextColor={"#a8a8a8"}
                selectionColor={colors.primary}
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>

            <View style={styles.textInputView}>
              <MaterialCommunityIcon
                name={"email-outline"}
                size={20}
                color={"#c9c9c9"}
                style={{ marginHorizontal: 15 }}
              />
              <TextInput
                style={styles.textInput}
                placeholder={"Email"}
                placeholderTextColor={"#a8a8a8"}
                selectionColor={colors.primary}
                textContentType="emailAddress"
                autoCapitalize="none"
                ref={emailRef}
              />
            </View>

            <Button
              textColor={colors.background}
              buttonColor={colors.primary}
              style={styles.getStartedButton}
              onPress={() => setSignedIn(true)}
            >
              Sign In
            </Button>
          </View>
        </View>

        <View style={styles.buttonView}>
          <Image
            source={require("assets/images/signup/Google-Icon.png")}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.buttonText}>Sign up with Google</Text>
        </View>

        <View style={styles.buttonView}>
          <Image
            source={require("assets/images/signup/Apple-Icon.png")}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.buttonText}>Sign up with Apple</Text>
        </View>

        <Button
          textColor="black"
          style={styles.buttonView}
          icon={({ size, color }) => (
            <OctIcon name="device-mobile" size={size} color={color} />
          )}
          onPress={() => navigation.push("SignUpWithNumber")}
        >
          <Text style={styles.buttonText}>Sign up with Mobile Number</Text>
        </Button>
      </View>
    </View>
  );
};

const makeStyles = (fontScale: number, colors: MD3Colors) =>
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
      marginTop: "10%",
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
      borderRadius: 7,
    },
    buttonText: {
      fontSize: 15 / fontScale,
      textAlign: "center",
      fontFamily: "Inter-Medium",
    },
    textInput: {
      height: 40,
      width: "100%",
      borderRadius: 7,
      paddingHorizontal: 10,
      fontSize: 15 / fontScale,
      fontFamily: "Inter-Regular",
      color: "white",
    },
    titleText: {
      marginTop: "5%",
      color: "white",
    },
    inputView: {
      marginTop: "10%",
      width: "80%",
    },
    h2: {
      marginBottom: "3%",
      color: colors.tertiary,
      textAlign: "center",
    },
    textInputView: {
      marginTop: "4%",
      backgroundColor: colors.secondary,
      borderRadius: 5,
      height: 45,
      flexDirection: "row",
      alignItems: "center",
    },
    getStartedButton: {
      borderRadius: 6,
      marginTop: "5%",
      height: 50,
      justifyContent: "center",
      marginBottom: 20,
    },
  });
