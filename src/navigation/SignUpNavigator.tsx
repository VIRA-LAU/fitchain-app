import { createStackNavigator } from "@react-navigation/stack";
import {
  SignUp,
  SignUpWithNumber,
  VerifySignUpWithNumber,
  SignUpWithNumberDetails,
} from "screens";

export type SignUpStackParamList = {
  SignUp: undefined;
  SignUpWithNumber: undefined;
  VerifySignUpWithNumber: undefined;
  SignUpWithNumberDetails: undefined;
};

const Stack = createStackNavigator<SignUpStackParamList>();

export const SignUpNavigator = () => (
  <Stack.Navigator
    initialRouteName="SignUp"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="SignUpWithNumber" component={SignUpWithNumber} />
    <Stack.Screen
      name="VerifySignUpWithNumber"
      component={VerifySignUpWithNumber}
    />
    <Stack.Screen
      name="SignUpWithNumberDetails"
      component={SignUpWithNumberDetails}
    />
  </Stack.Navigator>
);
