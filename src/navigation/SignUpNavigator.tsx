import { createStackNavigator } from "@react-navigation/stack";
import { Dispatch, SetStateAction } from "react";
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

export const SignUpNavigator = ({
  setSignedIn,
}: {
  setSignedIn: Dispatch<SetStateAction<boolean>>;
}) => (
  <Stack.Navigator
    initialRouteName="SignUp"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="SignUp">
      {(props) => <SignUp {...props} setSignedIn={setSignedIn} />}
    </Stack.Screen>
    <Stack.Screen name="SignUpWithNumber" component={SignUpWithNumber} />
    <Stack.Screen
      name="VerifySignUpWithNumber"
      component={VerifySignUpWithNumber}
    />
    <Stack.Screen name="SignUpWithNumberDetails">
      {(props) => (
        <SignUpWithNumberDetails {...props} setSignedIn={setSignedIn} />
      )}
    </Stack.Screen>
  </Stack.Navigator>
);
