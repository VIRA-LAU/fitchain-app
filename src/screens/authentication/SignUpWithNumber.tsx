import type { StackScreenProps } from "@react-navigation/stack";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SignUpStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";
import { useRef, useState } from "react";

type Props = StackScreenProps<SignUpStackParamList, "SignUpWithNumber">;
export const SignUpWithNumber = ({ navigation, route }: Props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  // The options for sending the message (e.g. send the message as a regular SMS or an MMS)

  const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const createUserWithNumber = () => {
    let code = generateCode();
    navigation.push("VerifyNumber", {
      code,
      phoneNumber,
      isBranch: route.params.isBranch,
    });
  };

  const scrollRef: React.MutableRefObject<ScrollView | null> = useRef(null);

  return (
    <AppHeader backEnabled>
      <ScrollView contentContainerStyle={styles.wrapperView} ref={scrollRef}>
        <Image source={require("assets/images/logo.png")} />
        <Text variant="titleLarge" style={styles.titleText}>
          Welcome to Fitchain
        </Text>
        <View style={styles.inputView}>
          <Text variant="titleSmall" style={styles.h1}>
            Please enter your phone number
          </Text>
          <Text variant="labelLarge" style={styles.h2}>
            This helps us confirm your identity and secure your account
          </Text>
          <PhoneInput
            defaultCode={"LB"}
            codeTextStyle={{ color: colors.tertiary, fontSize: 14, height: 20 }}
            textInputStyle={{
              color: colors.tertiary,
              fontSize: 14,
              height: 45,
            }}
            countryPickerButtonStyle={{
              backgroundColor: colors.secondary,
              borderRadius: 5,
              marginRight: 5,
              width: 60,
              paddingLeft: 13,
            }}
            textContainerStyle={{
              backgroundColor: colors.secondary,
              borderRadius: 5,
            }}
            textInputProps={{
              placeholderTextColor: colors.tertiary,
              selectionColor: colors.primary,
              onFocus: () => {
                scrollRef.current?.scrollToEnd();
              },
            }}
            disableArrowIcon={true}
            containerStyle={{
              marginTop: "5%",
              backgroundColor: colors.background,
              height: 45,
            }}
            withDarkTheme={true}
            defaultValue={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              scrollRef.current?.scrollToEnd();
            }}
          />
          <Button
            mode="contained"
            style={styles.continueButton}
            contentStyle={{ height: 50 }}
            onPress={() => createUserWithNumber()}
          >
            Continue
          </Button>
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
      justifyContent: "center",
      paddingVertical: "5%",
    },
    titleText: {
      marginTop: "5%",
      color: colors.tertiary,
    },
    inputView: {
      marginTop: "15%",
      width: "80%",
    },
    h1: {
      color: colors.tertiary,
      textAlign: "center",
    },
    h2: {
      marginTop: "5%",
      color: colors.tertiary,
      textAlign: "center",
      fontSize: 12,
    },
    continueButton: {
      marginTop: "10%",
      justifyContent: "center",
    },
  });
