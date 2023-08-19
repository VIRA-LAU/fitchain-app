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
import { Button, useTheme, Text } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useEffect, useRef, useState } from "react";
import { AppHeader } from "src/components";
import { useLoginUserMutation } from "src/api";
type Props = StackScreenProps<SignUpStackParamList, "SignIn">;

export const SignIn = ({
  navigation,
  route,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
}) => {
  const { fontScale } = useWindowDimensions();
  const { colors } = useTheme();
  const styles = makeStyles(fontScale, colors);
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    mutate: loginUser,
    isLoading: loginLoading,
    error,
  } = useLoginUserMutation();

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
    if (error && error?.response?.data?.message === "CREDENTIALS_INCORRECT")
      setErrorMessage("Invalid email or password.");

    if (error && error?.response?.data?.message === "EMAIL_NOT_VERIFIED")
      navigation.push("VerifyEmail", {
        isBranch: error.response.data.isBranch!,
        email: email ?? "",
        password: password ?? "",
      });
  }, [error]);

  const scrollRef: React.MutableRefObject<ScrollView | null> = useRef(null);
  const emailRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const passwordRef: React.MutableRefObject<TextInput | null> = useRef(null);

  return (
    <AppHeader>
      <Image
        source={require("assets/images/signup/background.png")}
        style={styles.background}
      />
      <ScrollView contentContainerStyle={styles.wrapperView} ref={scrollRef}>
        <Image source={require("assets/images/Logo.png")} />

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
              ref={emailRef}
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
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
              ref={passwordRef}
              value={password}
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

          <Button
            mode="contained"
            style={styles.signInButton}
            loading={loginLoading}
            onPress={!loginLoading ? () => signIn() : undefined}
          >
            Sign In
          </Button>

          <Button
            style={{ marginTop: "3%", marginBottom: 10 }}
            onPress={() => {
              navigation.push("ForgotPassword");
            }}
          >
            Forgot password?
          </Button>
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

          <View style={styles.buttonView}>
            <Button
              mode="contained"
              style={{
                minWidth: "100%",
                minHeight: "100%",
              }}
              buttonColor="#ebebeb"
              textColor="black"
              icon={({ size, color }) => (
                <OctIcon name="mail" size={size} color={color} />
              )}
              onPress={() => navigation.push("SignUpWithEmail")}
            >
              <Text style={styles.buttonText}>Sign up with Email</Text>
            </Button>
          </View>
        </View>
        <View
          style={[styles.separatorView, { marginTop: 15, marginBottom: 15 }]}
        >
          <View style={styles.separator}></View>
          <Text style={[styles.h2, styles.separatorText]}>Venue Account</Text>
          <View style={styles.separator}></View>
        </View>
        <View style={{ width: "80%" }}>
          <Button
            textColor={colors.primary}
            style={{ flexGrow: 1 }}
            icon={({ size, color }) => (
              <OctIcon name="organization" size={size} color={color} />
            )}
            onPress={() => navigation.push("SignUpAsBranch")}
          >
            <Text style={styles.buttonText}>Sign up as a Venue</Text>
          </Button>
        </View>
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
      paddingVertical: "15%",
    },
    background: {
      position: "absolute",
      height: "100%",
      width: "100%",
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
      marginTop: "5%",
      justifyContent: "center",
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
