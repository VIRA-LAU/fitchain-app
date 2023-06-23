import { createStackNavigator } from "@react-navigation/stack";
import { Dispatch, SetStateAction } from "react";
import {
  SignIn,
  SignUpWithNumber,
  VerifyNumber,
  SignUpWithEmail,
  SignUpExtraDetails,
  SignUpAsBranch,
  VerifyEmail,
} from "screens";

export type SignUpStackParamList = {
  SignIn: undefined;
  SignUpWithNumber: { isVenue: boolean };
  VerifyEmail: { userId: number; isVenue: boolean };
  VerifyNumber: {
    code: string;
    phoneNumber: string;
    isVenue: boolean;
  };
  SignUpWithEmail: undefined;
  SignUpExtraDetails: undefined;
  SignUpAsBranch: undefined;
};

const Stack = createStackNavigator<SignUpStackParamList>();

export const SignUpNavigator = ({
  setSignedIn,
  storedEmail,
  verifyLoading,
}: {
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>;
  storedEmail: string | undefined;
  verifyLoading: boolean;
}) => (
  <Stack.Navigator
    initialRouteName="SignIn"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="SignIn">
      {(props) => (
        <SignIn
          {...props}
          setSignedIn={setSignedIn}
          storedEmail={storedEmail}
          verifyLoading={verifyLoading}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="SignUpWithEmail" component={SignUpWithEmail} />
    <Stack.Screen name="SignUpAsBranch" component={SignUpAsBranch} />
    <Stack.Screen name="VerifyEmail">
      {(props) => <VerifyEmail {...props} setSignedIn={setSignedIn} />}
    </Stack.Screen>
    <Stack.Screen name="SignUpExtraDetails">
      {(props) => <SignUpExtraDetails {...props} setSignedIn={setSignedIn} />}
    </Stack.Screen>
    <Stack.Screen name="SignUpWithNumber" component={SignUpWithNumber} />
    <Stack.Screen name="VerifyNumber" component={VerifyNumber} />
  </Stack.Navigator>
);
