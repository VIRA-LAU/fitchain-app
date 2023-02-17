import { useState } from "react";
import { AppHeader } from "src/components";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";
import {
  SceneRendererProps,
  TabBar,
  TabBarProps,
  TabView,
} from "react-native-tab-view";
import { Home } from "./Home";

type Props = StackScreenProps<HomeStackParamList, "GameDetails">;

export const GameDetails = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const windowWidth = useWindowDimensions().width;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "Home", title: "Home" },
    { key: "Away", title: "Away" },
  ]);

  const renderScene = ({
    route,
  }: SceneRendererProps & {
    route: {
      key: string;
      title: string;
    };
  }) => {
    switch (route.key) {
      case "Home":
        return <Home />;
      case "Away":
        return <Home />;
      default:
        return null;
    }
  };

  const renderTabBar = (props: TabBarProps<any>) => (
    <TabBar
      {...props}
      style={{
        backgroundColor: colors.secondary,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 10,
      }}
      renderTabBarItem={({ route }) => {
        let isActive = route.key === props.navigationState.routes[index].key;
        return (
          <View
            style={[
              styles.tabViewItem,
              {
                width: 0.5 * (windowWidth - 40 - 20),
                backgroundColor: isActive
                  ? colors.background
                  : colors.secondary,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: "Inter-Medium",
                color: isActive ? "white" : colors.tertiary,
              }}
            >
              {route.title}
            </Text>
          </View>
        );
      }}
      renderIndicator={() => <View style={{ width: 0 }} />}
    />
  );

  return (
    <AppHeader
      absolutePosition={false}
      backEnabled
      title="Basketball"
      right={<IonIcon name="ellipsis-horizontal" color={"black"} size={24} />}
      backgroundImage={"basketball"}
      navigation={navigation}
      route={route}
      darkMode
    >
      <View style={styles.wrapperView}>
        <View style={styles.headerView}>
          <Text variant="labelLarge" style={styles.greyFont}>
            Next week
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              variant="headlineSmall"
              style={{ color: "white", marginTop: -5, marginBottom: 10 }}
            >
              Friday, May 14
            </Text>
            <Text
              variant="labelLarge"
              style={{ color: "white", marginTop: -5, marginBottom: 10 }}
            >
              22:15 - 23:45
            </Text>
          </View>

          <View style={styles.buttonsView}>
            <Button
              icon={() => (
                <IonIcon
                  name={"basketball-outline"}
                  size={26}
                  color={colors.secondary}
                />
              )}
              style={{ borderRadius: 5, flex: 1 }}
              textColor={colors.secondary}
              buttonColor={colors.primary}
            >
              Join Game
            </Button>
            <Button
              icon={() => (
                <FeatherIcon name="thumbs-up" size={22} color={"white"} />
              )}
              style={{ borderRadius: 5, flex: 1 }}
              textColor={"white"}
              buttonColor={"transparent"}
            >
              Follow Game
            </Button>
          </View>
        </View>
        <View style={styles.contentView}>
          <TabView
            navigationState={{ index, routes }}
            renderTabBar={renderTabBar}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: windowWidth }}
          />
        </View>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flex: 1,
    },
    headerView: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: colors.secondary,
    },
    greyFont: { marginVertical: 10, color: colors.tertiary },
    buttonsView: {
      flexDirection: "row",
      marginTop: 15,
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentView: {
      flex: 1,
      paddingVertical: 10,
    },
    tabViewItem: {
      height: 40,
      margin: 5,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
  });
