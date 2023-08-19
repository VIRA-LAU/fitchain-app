import type { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, TextInput, Image, ScrollView } from "react-native";
import { SignUpStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import {
  useLoginUserMutation,
  useResendVerificationEmailMutation,
} from "src/api";

type Props = StackScreenProps<SignUpStackParamList, "VerifyEmail">;

export const VerifyEmail = ({
  navigation,
  route,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { email, password, isBranch } = route.params;

  const {
    mutate: loginUser,
    isLoading,
    error,
  } = useLoginUserMutation({ isVerifyingEmail: true });
  const {
    mutate: resendEmail,
    isSuccess: resendSuccess,
    isLoading: resendLoading,
  } = useResendVerificationEmailMutation();

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (error && error?.response?.data?.message === "EMAIL_NOT_VERIFIED")
      setErrorMessage("Your email has not been verified yet.");
  }, [error]);

  return (
    <AppHeader backEnabled>
      <ScrollView contentContainerStyle={styles.wrapperView}>
        <Image source={require("assets/images/Logo-Icon.png")} />
        <Text variant="titleLarge" style={styles.titleText}>
          Verify your Email
        </Text>
        <View style={styles.inputView}>
          <Text variant="labelLarge" style={styles.h2}>
            Please verify your email address through the email we sent before
            you proceed.
            {"\n"}
            (You may have to check your junk folder.)
          </Text>
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
            style={styles.continueButton}
            contentStyle={{ height: 50 }}
            loading={isLoading}
            onPress={
              !isLoading
                ? () => {
                    setErrorMessage("");
                    loginUser({
                      email,
                      password,
                    });
                  }
                : undefined
            }
          >
            Continue
          </Button>

          <Button
            style={styles.resendButton}
            loading={resendLoading}
            onPress={
              !resendLoading
                ? () => {
                    resendEmail({
                      email,
                      isBranch,
                    });
                  }
                : undefined
            }
          >
            Resend Email
          </Button>

          {resendSuccess && (
            <Text
              variant="labelMedium"
              style={{
                color: "lightgreen",
                textAlign: "center",
                marginTop: "5%",
                fontFamily: "Inter-Medium",
              }}
            >
              New email sent.
            </Text>
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
    codeView: {
      width: "95%",
      marginTop: "5%",
      flexDirection: "row",
      alignSelf: "center",
    },
    codeInput: {
      backgroundColor: colors.secondary,
      width: "23%",
      aspectRatio: 1 / 1,
      marginHorizontal: "1%",
      textAlign: "center",
      fontSize: 24,
      color: "white",
    },
    resendButton: { marginTop: "5%" },
    continueButton: {
      marginTop: "7%",
      justifyContent: "center",
    },
  });
