import type { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, Image, TextInput, ScrollView } from "react-native";
import { SignUpStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text, ActivityIndicator } from "react-native-paper";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useCreateUserMutation } from "src/api";
type Props = StackScreenProps<SignUpStackParamList, "SignUpWithNumberDetails">;

export const SignUpWithNumberDetails = ({
  navigation,
  route,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      firstName.length > 0 &&
      lastName.length > 0
    ) {
      let data = {
        firstName,
        lastName,
        phoneNumber: route.params.phoneNumber,
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

  const scrollRef: React.MutableRefObject<ScrollView | null> = useRef(null);
  const firstNameRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const lastNameRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const emailRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const passwordRef: React.MutableRefObject<TextInput | null> = useRef(null);

  return (
    <AppHeader navigation={navigation} route={route} backEnabled>
      <ScrollView contentContainerStyle={styles.wrapperView} ref={scrollRef}>
        <Image
          source={require("assets/images/Logo-Icon.png")}
          style={styles.logo}
        />
        <Text variant="titleLarge" style={styles.titleText}>
          Account Details
        </Text>
        <View style={styles.inputView}>
          <Text variant="labelLarge" style={styles.h2}>
            Please provide the following information.
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
              placeholder={"First Name"}
              placeholderTextColor={"#a8a8a8"}
              selectionColor={colors.primary}
              onSubmitEditing={() => lastNameRef.current?.focus()}
              blurOnSubmit={false}
              ref={firstNameRef}
              onFocus={() => {
                firstNameRef.current?.measureInWindow((x, y) =>
                  scrollRef.current?.scrollTo({
                    y,
                    animated: true,
                  })
                );
              }}
              onChangeText={(text) => {
                setFirstName(text.trim());
                setErrorMessage("");
              }}
            />
          </View>
          <View style={styles.textInputView}>
            <MaterialCommunityIcon
              name={"account-outline"}
              size={20}
              color={"#c9c9c9"}
              style={{ marginHorizontal: 15 }}
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Last Name"}
              placeholderTextColor={"#a8a8a8"}
              selectionColor={colors.primary}
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
              ref={lastNameRef}
              onFocus={() => {
                lastNameRef.current?.measureInWindow((x, y) =>
                  scrollRef.current?.scrollTo({
                    y,
                    animated: true,
                  })
                );
              }}
              onChangeText={(text) => {
                setLastName(text.trim());
                setErrorMessage("");
              }}
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
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              ref={emailRef}
              onFocus={() => {
                emailRef.current?.measureInWindow((x, y) =>
                  scrollRef.current?.scrollTo({
                    y,
                    animated: true,
                  })
                );
              }}
              onChangeText={(text) => {
                setEmail(text.trim());
                setErrorMessage("");
              }}
            />
          </View>
          <View style={styles.textInputView}>
            <MaterialCommunityIcon
              name={"lock"}
              size={20}
              color={"#c9c9c9"}
              style={{ marginHorizontal: 15 }}
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Password"}
              placeholderTextColor={"#a8a8a8"}
              selectionColor={colors.primary}
              secureTextEntry={true}
              value={password}
              ref={passwordRef}
              onFocus={() => {
                passwordRef.current?.measureInWindow((x, y) =>
                  scrollRef.current?.scrollTo({
                    y,
                    animated: true,
                  })
                );
              }}
              onChangeText={(password) => {
                passwordRef.current?.measureInWindow((x, y) =>
                  scrollRef.current?.scrollTo({
                    y,
                    animated: true,
                  })
                );
                checkPasswordValidity(password.trim());
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
          {createUserLoading ? (
            <ActivityIndicator style={{ marginTop: "13%" }} />
          ) : (
            <Button
              textColor={colors.background}
              buttonColor={colors.primary}
              style={styles.getStartedButton}
              onPress={() => signUp()}
            >
              Get Started
            </Button>
          )}
        </View>
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flexGrow: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      paddingBottom: 20,
    },
    logo: {
      marginTop: "25%",
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
      marginTop: "7%",
      backgroundColor: colors.secondary,
      borderRadius: 5,
      height: 45,
      flexDirection: "row",
      alignItems: "center",
    },
    textInput: {
      borderRadius: 5,
      fontSize: 14,
      color: "white",
      width: "100%",
      fontFamily: "Inter-Medium",
    },
    getStartedButton: {
      borderRadius: 6,
      marginTop: "7%",
      height: 50,
      justifyContent: "center",
      borderWidth: 1,
    },
  });
