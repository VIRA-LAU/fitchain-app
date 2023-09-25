import type { StackScreenProps } from "@react-navigation/stack";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SignUpStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text } from "react-native-paper";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useCreateUserMutation } from "src/api";
type Props = StackScreenProps<SignUpStackParamList, "SignUpWithEmail">;

export const SignUpWithEmail = ({
  navigation,
  route,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);

  const {
    mutate: createUser,
    isLoading: createUserLoading,
    error,
  } = useCreateUserMutation();

  const validateEmail = (email: string) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  };

  const signUp = () => {
    if (
      checkPasswordValidity(password) &&
      validateEmail(email) &&
      fullName.length > 0
    ) {
      let data = {
        firstName:
          fullName.trim().substring(0, fullName.trim().indexOf(" ")) ||
          fullName.trim(),
        lastName: fullName.trim().substring(fullName.trim().indexOf(" ") + 1),
        email,
        password,
      };
      setErrorMessage("");
      createUser(data);
    } else {
      setErrorMessage("Make sure all fields are valid.");
    }
  };

  const checkPasswordValidity = (currentPassword: string) => {
    setPassword(currentPassword);
    const upperCaseLetters = /[A-Z]/g;
    const lowerCaseLetters = /[a-z]/g;
    const numbers = /[0-9]/g;

    if (
      currentPassword.match(upperCaseLetters) &&
      currentPassword.match(lowerCaseLetters) &&
      currentPassword.match(numbers) &&
      currentPassword.length >= 8
    ) {
      setErrorMessage("");
      return true;
    } else {
      setErrorMessage(
        "Make sure your password includes at least an upper case, a lower case, a digit, and 8 characters."
      );
      return false;
    }
  };

  useEffect(() => {
    if (error && error?.response?.data?.message === "CREDENTIALS_TAKEN")
      setErrorMessage("Email already in use.");
  }, [error]);

  const scrollOffset = 60;
  const scrollRef: React.MutableRefObject<ScrollView | null> = useRef(null);
  const lastNameRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const emailRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const passwordRef: React.MutableRefObject<TextInput | null> = useRef(null);

  return (
    <AppHeader>
      <ScrollView
        contentContainerStyle={styles.wrapperView}
        ref={scrollRef}
        onScroll={(event) => {
          setScrollPosition(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={8}
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
          Sign Up
        </Text>
        <Text variant="labelLarge" style={styles.text}>
          Fill in your details and you are 1 step away!
        </Text>

        <View style={{ width: "87%", marginTop: 24 }}>
          <Text style={{ fontFamily: "Poppins-Regular" }}>Full Name</Text>
          <TextInput
            value={fullName}
            style={styles.textInput}
            selectionColor={colors.primary}
            onSubmitEditing={() => {
              lastNameRef.current?.focus();
              scrollRef.current?.scrollTo({
                y: scrollPosition + scrollOffset,
                animated: true,
              });
            }}
            blurOnSubmit={false}
            onChangeText={(text) => {
              setFullName(text);
              setErrorMessage("");
            }}
          />

          <Text style={{ fontFamily: "Poppins-Regular", marginTop: 4 }}>
            Email
          </Text>
          <TextInput
            value={email}
            style={styles.textInput}
            selectionColor={colors.primary}
            textContentType="emailAddress"
            autoCapitalize="none"
            onSubmitEditing={() => {
              passwordRef.current?.focus();
              scrollRef.current?.scrollToEnd({
                animated: true,
              });
            }}
            blurOnSubmit={false}
            ref={emailRef}
            onChangeText={(text) => {
              setEmail(text.trim());
              setErrorMessage("");
            }}
          />

          <Text style={{ fontFamily: "Poppins-Regular", marginTop: 4 }}>
            Password
          </Text>
          <TextInput
            style={styles.textInput}
            selectionColor={colors.primary}
            secureTextEntry={true}
            value={password}
            ref={passwordRef}
            onChangeText={(password) => {
              checkPasswordValidity(password.trim());
              scrollRef.current?.scrollToEnd({
                animated: true,
              });
            }}
          />

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

        <View style={{ marginTop: "auto", width: "87%" }}>
          <Button
            mode="contained"
            style={{ marginTop: 20, height: 44, justifyContent: "center" }}
            loading={createUserLoading}
            onPress={!createUserLoading ? () => signUp() : undefined}
          >
            Sign Up
          </Button>

          <View
            style={{
              marginTop: 24,
              marginBottom: 64,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  textAlign: "center",
                }}
              >
                Already have an account?{" "}
                <Text style={{ color: colors.primary }}>Sign in</Text>
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
  });
