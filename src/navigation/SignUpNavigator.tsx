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
} from "screens";
import { UserData } from "src/utils";

export type SignUpStackParamList = {
  SignIn: undefined;
  SignUpWithEmail: undefined;
  VerifyEmail: { userId: number; isBranch: boolean };
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

const Stack = createStackNavigator<SignUpStackParamList>();

export const SignUpNavigator = () => (
  <Stack.Navigator
    initialRouteName="SignIn"
    screenOptions={{ headerShown: false }}
  >
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
