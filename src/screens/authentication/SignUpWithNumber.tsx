import type { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { SignUpStackParamList } from "src/AppNavigator";
import { NavigationHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";

type Props = StackScreenProps<SignUpStackParamList, "SignUpWithNumber">;

export const SignUpWithNumber = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <NavigationHeader backEnabled={true} navigation={navigation} route={route}>
      <View style={styles.wrapperView}>
        <View key="logo" style={styles.logo} />
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
            textInputProps={{ placeholderTextColor: "grey" }}
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
          >
            Continue
          </Button>
        </View>
      </View>
    </NavigationHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      height: "100%",
      backgroundColor: colors.background,
      alignItems: "center",
    },
    logo: {
      height: 75,
      width: 75,
      backgroundColor: colors.primary,
      marginTop: "25%",
    },
    titleText: {
      marginTop: "10%",
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
      color: "grey",
      textAlign: "center",
    },
    continueButton: { borderRadius: 6, marginTop: "10%" },
  });
