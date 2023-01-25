import { createStackNavigator } from "@react-navigation/stack";
import { SignUp, SignUpWithNumber, Home } from "screens";
import { UserContext } from "utils";

export type SignUpStackParamList = {
  SignUp: undefined;
  SignUpWithNumber: undefined;
  VerifySignUpWithNumber: undefined;
  SignUpWithNumberDetails: undefined;
};

const Stack = createStackNavigator<SignUpStackParamList>();

export default function AppNavigator() {
  const signedIn = false;

  if (signedIn)
    return (
      <UserContext.Provider value={{ userId: 1 }}>
        <Home />
      </UserContext.Provider>
    );
  else
    return (
      <Stack.Navigator
        initialRouteName="SignUp"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignUpWithNumber" component={SignUpWithNumber} />
        <Stack.Screen name="VerifySignUpWithNumber" component={Home} />
        <Stack.Screen name="SignUpWithNumberDetails" component={Home} />
      </Stack.Navigator>
    );
}
