import type { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, TextInput, Image, ScrollView } from "react-native";
import { SignUpStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text, ActivityIndicator } from "react-native-paper";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useResendEmailCodeMutation,
  useVerifyBranchEmailMutation,
  useVerifyEmailMutation,
} from "src/api";

type Props = StackScreenProps<SignUpStackParamList, "VerifyEmail">;

const CodeInput = ({
  index,
  code,
  colors,
  styles,
  setCode,
  setErrorMessage,
  refs,
  scrollRef,
}: {
  index: number;
  code: string[];
  colors: MD3Colors;
  styles: any;
  setCode: React.Dispatch<React.SetStateAction<string[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  refs: React.MutableRefObject<TextInput | null>[];
  scrollRef: React.MutableRefObject<ScrollView | null>;
}) => {
  return (
    <TextInput
      key={index}
      value={code[index]}
      selectionColor={colors.primary}
      maxLength={1}
      style={styles.codeInput}
      placeholder="-"
      placeholderTextColor={colors.tertiary}
      ref={refs[index]}
      onFocus={() => {
        refs[index].current?.measureInWindow((x, y) =>
          scrollRef.current?.scrollToEnd()
        );
      }}
      onChangeText={(character) => {
        setCode(
          code.map((codeCharacter, codeIndex) =>
            index === codeIndex ? character.toUpperCase() : codeCharacter
          )
        );
        setErrorMessage("");
        if (character !== "")
          if (index < 3) refs[index + 1].current?.focus();
          else refs[index].current?.blur();
      }}
    />
  );
};

export const VerifyEmail = ({
  navigation,
  route,
  setSignedIn,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { userId, isVenue } = route.params;

  const {
    mutate: verifyUserEmail,
    error: userError,
    isLoading: userLoading,
  } = useVerifyEmailMutation();
  const {
    mutate: verifyBranchEmail,
    error: branchError,
    isLoading: branchLoading,
  } = useVerifyBranchEmailMutation(setSignedIn);
  const {
    mutate: resendCode,
    isSuccess: resendSuccess,
    isLoading: resendLoading,
  } = useResendEmailCodeMutation();

  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");

  const scrollRef: React.MutableRefObject<ScrollView | null> = useRef(null);
  const refs: React.MutableRefObject<TextInput | null>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    if (
      (userError && userError?.response?.data?.message === "INCORRECT_CODE") ||
      (branchError && branchError?.response?.data?.message === "INCORRECT_CODE")
    )
      setErrorMessage("The code you entered is incorrect.");
  }, [userError, branchError]);

  return (
    <AppHeader navigation={navigation} route={route} backEnabled>
      <ScrollView contentContainerStyle={styles.wrapperView} ref={scrollRef}>
        <Image source={require("assets/images/Logo-Icon.png")} />
        <Text variant="titleLarge" style={styles.titleText}>
          Welcome to Fitchain
        </Text>
        <View style={styles.inputView}>
          <Text variant="labelLarge" style={styles.h2}>
            Please enter the code we sent to your email.{"\n"}
            (You may have to check your junk folder)
          </Text>
          <View style={styles.codeView}>
            {[0, 1, 2, 3].map((index) => {
              return (
                <CodeInput
                  key={index}
                  code={code}
                  index={index}
                  colors={colors}
                  styles={styles}
                  setCode={setCode}
                  setErrorMessage={setErrorMessage}
                  refs={refs}
                  scrollRef={scrollRef}
                />
              );
            })}
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

          {userLoading || branchLoading ? (
            <ActivityIndicator style={{ marginTop: "10%" }} />
          ) : (
            <Button
              textColor={colors.background}
              buttonColor={colors.primary}
              style={styles.continueButton}
              onPress={() => {
                if (code.indexOf("") !== -1) {
                  setErrorMessage("Please enter the full code.");
                } else {
                  if (!isVenue)
                    verifyUserEmail({
                      code: code.join(""),
                      userId,
                    });
                  else
                    verifyBranchEmail({
                      code: code.join(""),
                      branchId: userId,
                    });
                }
              }}
            >
              Continue
            </Button>
          )}

          {resendLoading ? (
            <ActivityIndicator style={{ marginTop: "7%" }} />
          ) : (
            <Button
              style={styles.resendButton}
              onPress={() => {
                resendCode({
                  userId,
                  isVenue,
                });
              }}
            >
              Resend Code
            </Button>
          )}

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
              New code sent.
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
    resendButton: { borderRadius: 6, marginTop: "5%" },
    continueButton: {
      borderRadius: 6,
      marginTop: "7%",
      height: 50,
      justifyContent: "center",
    },
    placeholderText: {
      height: 50,
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
      textAlignVertical: "center",
    },
  });