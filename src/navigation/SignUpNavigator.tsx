import { createStackNavigator } from "@react-navigation/stack";
import { Dispatch, SetStateAction } from "react";
import {
  SignUp,
  SignUpWithNumber,
  VerifySignUpWithNumber,
  SignUpWithNumberDetails,
  SignUpWithNumberExtraDetails,
  SignUpAsVenueDetails,
} from "screens";

export type SignUpStackParamList = {
  SignUp: undefined;
  SignUpWithNumber: { isVenue: boolean };
  VerifySignUpWithNumber: {
    code: string;
    phoneNumber: string;
    isVenue: boolean;
  };
  SignUpWithNumberDetails: { phoneNumber: string };
  SignUpWithNumberExtraDetails: undefined;
  SignUpAsVenueDetails: { phoneNumber: string };
};

const Stack = createStackNavigator<SignUpStackParamList>();

export const SignUpNavigator = ({
  setSignedIn,
}: {
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>;
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
    <Stack.Screen
      name="SignUpWithNumberDetails"
      component={SignUpWithNumberDetails}
    />
    <Stack.Screen name="SignUpWithNumberExtraDetails">
      {(props) => (
        <SignUpWithNumberExtraDetails {...props} setSignedIn={setSignedIn} />
      )}
    </Stack.Screen>
    <Stack.Screen name="SignUpAsVenueDetails">
      {(props) => <SignUpAsVenueDetails {...props} setSignedIn={setSignedIn} />}
    </Stack.Screen>
  </Stack.Navigator>
);
