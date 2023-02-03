import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useTheme } from "react-native-paper";
import { Home } from "screens";
import { UserContext } from "utils";
import { SignUpNavigator } from "./SignUpNavigator";
import { BottomTabParamList, tabScreenOptions } from "./tabScreenOptions";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const AppNavigator = () => {
  const signedIn = true;
  const { colors } = useTheme();

  if (signedIn)
    return (
      <UserContext.Provider value={{ userId: 1 }}>
        <Tab.Navigator screenOptions={tabScreenOptions}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Games" component={Home} />
          <Tab.Screen
            name="Play"
            component={Home}
            options={{
              tabBarIconStyle: {
                top: -20,
                backgroundColor: colors.primary,
                aspectRatio: 1,
                borderRadius: 40,
                margin: -10,
              },
            }}
          />
          <Tab.Screen name="Venues" component={Home} />
          <Tab.Screen name="Profile" component={Home} />
        </Tab.Navigator>
      </UserContext.Provider>
    );
  else return <SignUpNavigator />;
};
