import type { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, TextInput, Image, ScrollView } from "react-native";
import { SignUpStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text } from "react-native-paper";
import React, { useRef, useState } from "react";

type Props = StackScreenProps<SignUpStackParamList, "VerifySignUpWithNumber">;

const CodeInput = ({
  index,
  colors,
  styles,
  setCode,
  refs,
}: {
  index: number;
  colors: MD3Colors;
  styles: any;
  setCode: React.Dispatch<React.SetStateAction<(number | null)[]>>;
  refs: React.MutableRefObject<TextInput | null>[];
}) => {
  return (
    <TextInput
      key={index}
      selectionColor={colors.primary}
      maxLength={1}
      keyboardType={"numeric"}
      textContentType={"oneTimeCode"}
      style={styles.codeInput}
      placeholder="0"
      placeholderTextColor={colors.tertiary}
      onChangeText={(digit) => {
        setCode((code) =>
          code.map((codeDigit, codeIndex) =>
            index === codeIndex ? parseInt(digit) : codeDigit
          )
        );
        if (!isNaN(parseInt(digit)))
          if (index < 3) refs[index + 1].current?.focus();
          else refs[index].current?.blur();
      }}
      ref={refs[index]}
    />
  );
};

export const VerifySignUpWithNumber = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [code, setCode] = useState<(number | null)[]>([null, null, null, null]);
  const [correctCode, setCorrectCode] = useState(route.params.code);
  const verifyCode = () => {
    if (code.join("").toString().match(correctCode)) {
      navigation.push("SignUpWithNumberDetails", {
        phoneNumber: route.params.phoneNumber,
      });
    }
  };
  const refs: React.MutableRefObject<TextInput | null>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };
  const resendCode = () => {
    let newCode = generateCode();
    setCorrectCode(newCode);
  };
  return (
    <AppHeader navigation={navigation} route={route} backEnabled autoScroll>
      <ScrollView contentContainerStyle={styles.wrapperView}>
        <Image
          source={require("assets/images/Logo-Icon.png")}
          style={styles.logo}
        />
        <Text variant="titleLarge" style={styles.titleText}>
          Welcome to Fitchain
        </Text>
        <View style={styles.inputView}>
          <Text variant="labelLarge" style={styles.h2}>
            Please enter the code we sent you to your mobile number
          </Text>
          <View style={styles.codeView}>
            {[0, 1, 2, 3].map((index) => {
              return (
                <CodeInput
                  key={index}
                  index={index}
                  colors={colors}
                  styles={styles}
                  setCode={setCode}
                  refs={refs}
                />
              );
            })}
          </View>
          <Button onPress={() => resendCode()} style={styles.resendButton}>
            Resend Code
          </Button>
          <Button
            textColor={colors.background}
            buttonColor={colors.primary}
            style={styles.continueButton}
            onPress={() => verifyCode()}
          >
            Continue
          </Button>
          <Text style={styles.placeholderText}>
            {correctCode ? correctCode : "Code will appear here."}
          </Text>
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
      marginTop: "5%",
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
