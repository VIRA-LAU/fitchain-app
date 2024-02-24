import { createStackNavigator } from "@react-navigation/stack";
import {
  SignIn,
  SignUpWithNumber,
  VerifyNumber,
  SignUpWithEmail,
  SignUpExtraDetails,
  SignUpAsBranch,
  VerifyEmail,
  ForgotPassword,
  AccountTypeSelection,
} from "screens";
import { UserData } from "src/utils";

export type AuthStackParamList = {
  AccountTypeSelection: undefined;
  SignIn: { accountType: "user" | "branch" };
  SignUpWithEmail: undefined;
  VerifyEmail: { email: string; password: string; isBranch: boolean };
  SignUpExtraDetails: { userData: UserData };
  SignUpAsBranch: undefined;
  ForgotPassword: undefined;
  SignUpWithNumber: { isBranch: boolean };
  VerifyNumber: {
    code: string;
    phoneNumber: string;
    isBranch: boolean;
  };
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName="AccountTypeSelection"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen
      name="AccountTypeSelection"
      component={AccountTypeSelection}
    />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUpWithEmail" component={SignUpWithEmail} />
    <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
    <Stack.Screen name="SignUpExtraDetails" component={SignUpExtraDetails} />
    <Stack.Screen name="SignUpAsBranch" component={SignUpAsBranch} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="SignUpWithNumber" component={SignUpWithNumber} />
    <Stack.Screen name="VerifyNumber" component={VerifyNumber} />
  </Stack.Navigator>
);
