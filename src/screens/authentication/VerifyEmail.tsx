import type { StackScreenProps } from "@react-navigation/stack";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AuthStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import {
  useLoginUserMutation,
  useResendVerificationEmailMutation,
} from "src/api";

type Props = StackScreenProps<AuthStackParamList, "VerifyEmail">;

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
          Verify Email
        </Text>
        <Text variant="labelLarge" style={styles.text}>
          Please verify your email address through the email we sent
        </Text>

        <View style={{ width: "87%", marginTop: 24 }}>
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

          {resendSuccess && (
            <Text
              variant="labelMedium"
              style={{
                color: "#008c2a",
                textAlign: "center",
                marginTop: "5%",
                fontFamily: "Poppins-Medium",
              }}
            >
              New email sent.
            </Text>
          )}
        </View>

        <View style={{ marginTop: "auto", width: "87%" }}>
          <Button
            mode="contained"
            style={{ marginTop: 20, height: 44, justifyContent: "center" }}
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
            mode="contained"
            style={{ marginTop: 12, height: 44, justifyContent: "center" }}
            loading={resendLoading}
            onPress={
              !resendLoading
                ? () => {
                    resendEmail({
                      email,
                      isBranch,
                    });
                    setErrorMessage("");
                  }
                : undefined
            }
          >
            Resend Email
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
                Go Back
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
      backgroundColor: colors.background,
      alignItems: "center",
    },
    text: {
      color: colors.tertiary,
      textAlign: "center",
      maxWidth: "87%",
    },
  });
