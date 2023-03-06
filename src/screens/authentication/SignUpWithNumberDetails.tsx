import type { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, Image, TextInput, Modal } from "react-native";
import { SignUpStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text } from "react-native-paper";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useState } from "react";
import { useCreateUserMutation } from "src/api";
type Props = StackScreenProps<SignUpStackParamList, "SignUpWithNumberDetails">;

export const SignUpWithNumberDetails = ({
  navigation,
  route,
  setSignedIn,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
  setSignedIn: Dispatch<SetStateAction<boolean>>;
}) => {
  const { mutate: createUser, data: loggedin } = useCreateUserMutation();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [validEntry, setValidEntry] = useState(true);
  const validateEmail = (email: string) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  };
  useEffect(() => {
    if (loggedin) {
      setSignedIn(true);
    }
  }, [loggedin]);

  const signUp = () => {
    if (
      passwordValid &&
      validateEmail(email) &&
      firstName.length > 0 &&
      lastName.length > 0
    ) {
      let data = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: route.params.phoneNumber,
        email: email.trim(),
        password: password.trim(),
      };
      createUser(data);
    } else {
      setValidEntry(false);
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
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };
  const emailRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const lastNameRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const passwordRef: React.MutableRefObject<TextInput | null> = useRef(null);

  return (
    <AppHeader navigation={navigation} route={route} backEnabled autoScroll>
      <View style={styles.wrapperView}>
        <Image
          source={require("assets/images/Logo-Icon.png")}
          style={styles.logo}
        />
        <Text variant="titleLarge" style={styles.titleText}>
          You're almost there!
        </Text>
        <View style={styles.inputView}>
          <Text variant="labelLarge" style={styles.h2}>
            Please provide the following information
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
              onChangeText={(text) => setFirstName(text)}
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
              ref={lastNameRef}
              onChangeText={(text) => setLastName(text)}
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
              ref={emailRef}
              onChangeText={(text) => setEmail(text)}
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
              onChangeText={(password) => checkPasswordValidity(password)}
            />
          </View>
          {passwordValid || password.length == 0 ? (
            <View></View>
          ) : (
            <Text variant="labelMedium" style={{ color: "red" }}>
              Make sure your password includes at least an upper case, a lower
              case, a digit, and 8 characters
            </Text>
          )}
          {validEntry ? (
            <View></View>
          ) : (
            <Text variant="labelMedium" style={{ color: "red" }}>
              Make Sure your first name, last name, and email are valid!
            </Text>
          )}
          <Button
            textColor={colors.background}
            buttonColor={colors.primary}
            style={styles.getStartedButton}
            onPress={() => signUp()}
          >
            Get Started
          </Button>
        </View>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flex: 1,
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
      marginTop: "10%",
      height: 50,
      justifyContent: "center",
      borderWidth: 1,
    },
  });
