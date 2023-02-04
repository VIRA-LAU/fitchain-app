import type { StackScreenProps } from "@react-navigation/stack";
import { Image, StyleSheet, View } from "react-native";
import { SignUpStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";

type Props = StackScreenProps<SignUpStackParamList, "SignUpWithNumber">;

export const SignUpWithNumber = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <AppHeader
      navigation={navigation}
      route={route}
      statusBarColor="background"
      backEnabled
      autoScroll
    >
      <View style={styles.wrapperView}>
        <Image
          source={require("assets/images/Logo-Icon.png")}
          style={styles.logo}
        />
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
            codeTextStyle={{ color: "white", fontSize: 14, height: 20 }}
            textInputStyle={{ color: "white", fontSize: 14, height: 45 }}
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
            }}
            disableArrowIcon={true}
            containerStyle={{
              marginTop: "5%",
              backgroundColor: colors.background,
              height: 45,
            }}
            withDarkTheme={true}
          />
          <Button
            textColor={colors.background}
            buttonColor={colors.primary}
            style={styles.continueButton}
            onPress={() => navigation.push("VerifySignUpWithNumber")}
          >
            Continue
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
      marginTop: "15%",
      width: "80%",
    },
    h1: {
      color: "white",
      textAlign: "center",
    },
    h2: {
      marginTop: "5%",
      color: colors.tertiary,
      textAlign: "center",
      fontSize: 12,
    },
    continueButton: {
      borderRadius: 6,
      marginTop: "10%",
      height: 50,
      justifyContent: "center",
    },
  });