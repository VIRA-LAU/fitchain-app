import { createStackNavigator } from "@react-navigation/stack";
import {
  SignIn,
  SignUpWithNumber,
  VerifyNumber,
  SignUpWithEmail,
  SignUpExtraDetails,
  SignUpAsBranch,
  VerifyEmail,
} from "screens";
import { UserData } from "src/utils";

export type SignUpStackParamList = {
  SignIn: undefined;
  SignUpWithNumber: { isBranch: boolean };
  VerifyEmail: { userId: number; isBranch: boolean };
  VerifyNumber: {
    code: string;
    phoneNumber: string;
    isBranch: boolean;
  };
  SignUpWithEmail: undefined;
  SignUpExtraDetails: { userData: UserData };
  SignUpAsBranch: undefined;
};

const Stack = createStackNavigator<SignUpStackParamList>();

export const SignUpNavigator = () => (
  <Stack.Navigator
    initialRouteName="SignIn"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUpWithEmail" component={SignUpWithEmail} />
    <Stack.Screen name="SignUpAsBranch" component={SignUpAsBranch} />
    <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
    <Stack.Screen name="SignUpExtraDetails" component={SignUpExtraDetails} />
    <Stack.Screen name="SignUpWithNumber" component={SignUpWithNumber} />
    <Stack.Screen name="VerifyNumber" component={VerifyNumber} />
  </Stack.Navigator>
);
