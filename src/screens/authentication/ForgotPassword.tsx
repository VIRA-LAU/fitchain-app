import type { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, TextInput, Image, ScrollView } from "react-native";
import { SignUpStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text } from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import { useForgotPasswordMutation } from "src/api";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = StackScreenProps<SignUpStackParamList, "ForgotPassword">;

export const ForgotPassword = ({
  navigation,
  route,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const {
    mutate: forgotPassword,
    error,
    isLoading,
    isSuccess,
  } = useForgotPasswordMutation();

  const [email, setEmail] = useState<string>();
  const [errorMessage, setErrorMessage] = useState("");

  const scrollRef: React.MutableRefObject<ScrollView | null> = useRef(null);

  useEffect(() => {
    if (error) {
      if (error?.response?.data?.message === "INVALID_EMAIL")
        setErrorMessage("There is no account associated with this email.");
      else if (error?.response?.data?.message === "EMAIL_NOT_VERIFIED")
        setErrorMessage("Provided email is not verified.");
    }
  }, [error]);

  return (
    <AppHeader backEnabled>
      <ScrollView contentContainerStyle={styles.wrapperView} ref={scrollRef}>
        <Image source={require("assets/images/Logo-Icon.png")} />
        <Text variant="titleLarge" style={styles.titleText}>
          Forgot your password?
        </Text>
        {!isSuccess ? (
          <View style={styles.inputView}>
            <Text variant="labelLarge" style={styles.h2}>
              Please enter your email address and we'll send you a link to reset
              your password.
            </Text>
            <View style={styles.textInputView}>
              <MaterialCommunityIcon
                name={"account-outline"}
                size={20}
                color={"#c9c9c9"}
                style={{ marginHorizontal: 15 }}
              />
              <TextInput
                value={email}
                style={styles.textInput}
                placeholder={"Email"}
                keyboardType="email-address"
                autoCapitalize={"none"}
                placeholderTextColor={"#a8a8a8"}
                selectionColor={colors.primary}
                onChangeText={(text) => {
                  setEmail(text.trim());
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
              style={styles.sendButton}
              loading={isLoading}
              onPress={
                !isLoading
                  ? () => {
                      if (email) {
                        if (emailReg.test(email)) forgotPassword({ email });
                        else
                          setErrorMessage(
                            "Please make sure the provided email is valid."
                          );
                      }
                    }
                  : undefined
              }
            >
              Send Email
            </Button>
          </View>
        ) : (
          <View style={styles.inputView}>
            <Text style={styles.success}>
              {`An email has been sent to\n${email}.`}
            </Text>
            <Button
              mode="contained"
              style={styles.sendButton}
              onPress={() => {
                navigation.pop();
              }}
            >
              Go Back
            </Button>
          </View>
        )}
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
      justifyContent: "center",
      paddingVertical: "5%",
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
      color: colors.tertiary,
      textAlign: "center",
      fontSize: 12,
    },
    success: {
      color: "lightgreen",
      textAlign: "center",
      fontSize: 14,
      fontFamily: "Inter-Medium",
    },
    sendButton: {
      marginTop: "7%",
      justifyContent: "center",
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
      flex: 1,
      paddingRight: 10,
      borderRadius: 5,
      fontSize: 14,
      color: "white",
      width: "100%",
      fontFamily: "Inter-Medium",
    },
  });
