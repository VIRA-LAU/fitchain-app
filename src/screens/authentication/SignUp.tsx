import {
  useWindowDimensions,
  View,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import OctIcon from "react-native-vector-icons/Octicons";
import type { StackScreenProps } from "@react-navigation/stack";
import { SignUpStackParamList } from "navigation";
import { Button, useTheme, Text, ActivityIndicator } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AppHeader } from "src/components";
import { useLoginUserMutation } from "src/api";
type Props = StackScreenProps<SignUpStackParamList, "SignUp">;

export const SignUp = ({
  navigation,
  route,
  setSignedIn,
  storedEmail,
  verifyLoading,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>;
  storedEmail: string | undefined;
  verifyLoading: boolean;
}) => {
  const { fontScale } = useWindowDimensions();
  const { colors } = useTheme();
  const styles = makeStyles(fontScale, colors);
  const [email, setEmail] = useState<string | undefined>(storedEmail);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    mutate: loginUser,
    isLoading: loginLoading,
    error,
  } = useLoginUserMutation(setSignedIn);

  const validateEmail = (email: string) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  };

  const signIn = () => {
    if (email) {
      if (validateEmail(email) && password) {
        let data = {
          email: email,
          password: password,
        };
        setErrorMessage("");
        loginUser(data);
      } else setErrorMessage("Make sure email and password are valid.");
    }
  };

  useEffect(() => {
    setEmail(storedEmail);
  }, [storedEmail]);

  useEffect(() => {
    if (error && error?.response?.data?.message === "CREDENTIALS_INCORRECT")
      setErrorMessage("Invalid email or password.");
  }, [error]);

  return (
    <AppHeader autoScroll>
      <ScrollView contentContainerStyle={styles.wrapperView}>
        <Image
          source={require("assets/images/signup/background.png")}
          style={styles.background}
        />
        <Image source={require("assets/images/Logo.png")} style={styles.logo} />

        <View style={styles.inputView}>
          <Text variant="labelLarge" style={styles.h2}>
            Please provide your email and password to sign in.
          </Text>
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
              value={email}
              onChangeText={(email) => {
                setEmail(email.trim());
                setErrorMessage("");
              }}
            />
          </View>

          <View style={styles.textInputView}>
            <MaterialCommunityIcon
              name={"lock-outline"}
              size={20}
              color={"#c9c9c9"}
              style={{ marginHorizontal: 15 }}
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Password"}
              placeholderTextColor={"#a8a8a8"}
              selectionColor={colors.primary}
              secureTextEntry
              onChangeText={(password) => {
                setPassword(password.trim());
                setErrorMessage("");
              }}
            />
          </View>
          {errorMessage && (
            <Text
              variant="labelMedium"
              style={{
                color: "red",
                textAlign: "center",
                marginTop: "5%",
                fontFamily: "Inter-SemiBold",
              }}
            >
              {errorMessage}
            </Text>
          )}
          {loginLoading || verifyLoading ? (
            <ActivityIndicator style={{ marginTop: 15, marginBottom: 20 }} />
          ) : (
            <Button
              textColor={colors.background}
              buttonColor={colors.primary}
              style={styles.signInButton}
              onPress={() => signIn()}
            >
              Sign In
            </Button>
          )}
        </View>
        <View style={styles.separatorView}>
          <View style={styles.separator}></View>
          <Text style={[styles.h2, styles.separatorText]}>
            Don't have an account?
          </Text>
          <View style={styles.separator}></View>
        </View>

        <View style={styles.buttonsView}>
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
            onPress={() =>
              navigation.push("SignUpWithNumber", { isVenue: false })
            }
          >
            <Text style={styles.buttonText}>Sign up with Mobile Number</Text>
          </Button>
        </View>
        <View
          style={[styles.separatorView, { marginTop: 15, marginBottom: 15 }]}
        >
          <View style={styles.separator}></View>
          <Text style={[styles.h2, styles.separatorText]}>Venue Account</Text>
          <View style={styles.separator}></View>
        </View>
        <Button
          textColor={colors.primary}
          style={{ width: "80%" }}
          icon={({ size, color }) => (
            <OctIcon name="organization" size={size} color={color} />
          )}
          onPress={() => navigation.push("SignUpWithNumber", { isVenue: true })}
        >
          <Text style={styles.buttonText}>Sign up as a Venue</Text>
        </Button>
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (fontScale: number, colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "black",
    },
    background: {
      position: "absolute",
      height: "100%",
      width: "100%",
    },
    logo: {
      alignSelf: "center",
    },
    buttonsView: {
      marginTop: "4%",
      alignItems: "center",
      width: "73%",
    },
    buttonView: {
      height: 40,
      width: "100%",
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
    titleText: {
      marginTop: "5%",
      color: "white",
    },
    h2: {
      color: colors.tertiary,
      textAlign: "center",
      marginBottom: "2%",
    },
    inputView: {
      marginTop: "10%",
      width: "73%",
    },
    textInputView: {
      marginTop: "4%",
      width: "100%",
      backgroundColor: colors.secondary,
      borderRadius: 5,
      height: 45,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
    },
    textInput: {
      height: 40,
      width: "100%",
      borderRadius: 7,
      fontSize: 15 / fontScale,
      fontFamily: "Inter-Medium",
      color: "white",
    },
    signInButton: {
      borderRadius: 6,
      marginTop: "5%",
      justifyContent: "center",
      marginBottom: 20,
    },
    separatorView: {
      flexDirection: "row",
      alignItems: "center",
      width: "80%",
      marginTop: "2%",
    },
    separator: {
      flex: 1,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
    },
    separatorText: {
      marginHorizontal: 20,
      fontSize: 14,
      color: "white",
      fontFamily: "Inter-Medium",
    },
  });
