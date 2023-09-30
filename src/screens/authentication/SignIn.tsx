import {
  useWindowDimensions,
  StyleSheet,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import { SignUpStackParamList } from "navigation";
import { Button, useTheme, Text } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { useEffect, useRef, useState } from "react";
import { AppHeader } from "src/components";
import { useLoginUserMutation } from "src/api";

type Props = StackScreenProps<SignUpStackParamList, "SignIn">;

export const SignIn = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { accountType } = route.params;

  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

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

  const emailRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const passwordRef: React.MutableRefObject<TextInput | null> = useRef(null);

  return (
    <AppHeader>
      <ScrollView
        contentContainerStyle={styles.wrapperView}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("assets/images/logo-text-dark.png")}
          style={{
            aspectRatio: 5.24,
            height: "auto",
            width: "50%",
            resizeMode: "contain",
            marginTop: 60,
            marginBottom: "25%",
          }}
        />

        <Text
          variant="headlineSmall"
          style={[
            styles.text,
            {
              textTransform: "uppercase",
              marginBottom: 8,
            },
          ]}
        >
          Login
        </Text>
        <Text variant="labelLarge" style={styles.text}>
          Login to start using our application
        </Text>

        <View style={{ flexGrow: 1, width: "87%", marginTop: 24 }}>
          <Text style={{ fontFamily: "Poppins-Regular" }}>Email</Text>
          <TextInput
            style={styles.textInput}
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

          <Text style={{ fontFamily: "Poppins-Regular", marginTop: 4 }}>
            Password
          </Text>
          <View style={[styles.textInput, styles.passwordView]}>
            <TextInput
              style={styles.password}
              selectionColor={colors.primary}
              secureTextEntry={!passwordVisible}
              ref={passwordRef}
              value={password}
              onChangeText={(password) => {
                setPassword(password.trim());
                setErrorMessage("");
              }}
            />
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setPasswordVisible(!passwordVisible);
              }}
            >
              <Image
                source={require("assets/icons/eye.png")}
                style={{ resizeMode: "contain", width: 24, height: 24 }}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              navigation.push("ForgotPassword");
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                color: colors.primary,
                textAlign: "right",
              }}
            >
              Forgot your password?
            </Text>
          </TouchableOpacity>

          {errorMessage && (
            <Text
              variant="labelMedium"
              style={{
                color: "red",
                textAlign: "center",
                marginTop: "5%",
                fontFamily: "Poppins-Medium",
              }}
            >
              {errorMessage}
            </Text>
          )}
        </View>

        <View style={{ width: "87%" }}>
          <Button
            mode="contained"
            style={{ marginTop: 20, height: 44, justifyContent: "center" }}
            loading={loginLoading}
            onPress={!loginLoading ? () => signIn() : undefined}
          >
            Sign In
          </Button>

          <View
            style={{
              marginTop: 24,
              marginBottom: 64,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                if (accountType === "user") navigation.push("SignUpWithEmail");
                else navigation.push("SignUpAsBranch");
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  textAlign: "center",
                }}
              >
                Don't have an account?{" "}
                <Text style={{ color: colors.primary }}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flexGrow: 1,
      alignItems: "center",
    },
    text: {
      color: colors.tertiary,
      textAlign: "center",
    },
    textInput: {
      height: 44,
      backgroundColor: colors.secondary,
      marginTop: 4,
      marginBottom: 8,
      borderRadius: 8,
      paddingHorizontal: 10,
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
    },
    passwordView: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 0,
    },
    password: {
      flexGrow: 1,
      height: 44,
      paddingHorizontal: 10,
    },
  });
