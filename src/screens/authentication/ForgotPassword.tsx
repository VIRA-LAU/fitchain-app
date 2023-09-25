import type { StackScreenProps } from "@react-navigation/stack";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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
    <AppHeader>
      <ScrollView contentContainerStyle={styles.wrapperView} ref={scrollRef}>
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
          Forgot Password
        </Text>

        {!isSuccess ? (
          <View style={{ width: "87%", flexGrow: 1 }}>
            <Text variant="labelLarge" style={styles.text}>
              Please enter your email address
            </Text>

            <Text style={{ fontFamily: "Poppins-Regular", marginTop: 24 }}>
              Email
            </Text>
            <TextInput
              value={email}
              style={styles.textInput}
              keyboardType="email-address"
              autoCapitalize={"none"}
              selectionColor={colors.primary}
              onChangeText={(text) => {
                setEmail(text.trim());
                setErrorMessage("");
              }}
            />

            {errorMessage && (
              <Text
                variant="labelMedium"
                style={{
                  color: "red",
                  textAlign: "center",
                  marginTop: "5%",
                  fontFamily: "Poppins-Bold",
                }}
              >
                {errorMessage}
              </Text>
            )}

            <View style={{ marginTop: "auto" }}>
              <Button
                mode="contained"
                style={{ marginTop: 20, height: 44, justifyContent: "center" }}
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
          </View>
        ) : (
          <View style={{ flexGrow: 1, width: "87%", marginTop: 24 }}>
            <Text style={styles.success}>
              {`An email has been sent to\n${email}.`}
            </Text>
            <Button
              mode="contained"
              style={{
                height: 44,
                justifyContent: "center",
                marginTop: "auto",
                marginBottom: 64,
              }}
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
    },
    text: {
      color: colors.tertiary,
      textAlign: "center",
    },
    success: {
      color: "#008c2a",
      textAlign: "center",
      fontSize: 14,
      fontFamily: "Poppins-Regular",
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
