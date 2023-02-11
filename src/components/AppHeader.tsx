import { useRef } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Text,
  Image,
} from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import Icon from "react-native-vector-icons/MaterialIcons";

const sportBackground = {
  basketball: <Image source={require("assets/images/home/basketball.png")} />,
  football: <Image source={require("assets/images/home/football.png")} />,
  tennis: <Image source={require("assets/images/home/tennis.png")} />,
};

export const AppHeader = ({
  children,
  absolutePosition = true,
  statusBarColor = "secondary",
  autoScroll = false,
  navigation,
  route,
  title,
  showLogo = false,
  right,
  middle,
  left,
  backEnabled = false,
  darkMode = false,
  backgroundImage,
}: {
  children: any;
  absolutePosition?: boolean;
  statusBarColor?: "primary" | "secondary" | "background" | "transparent";
  autoScroll?: boolean;
  navigation?: any;
  route?: any;
  title?: string;
  showLogo?: boolean;
  right?: any;
  middle?: any;
  left?: any;
  backEnabled?: boolean;
  darkMode?: boolean;
  backgroundImage?: "basketball" | "football" | "tennis";
}) => {
  const { colors } = useTheme();
  const scrollViewRef: React.MutableRefObject<ScrollView | null> = useRef(null);

  if (statusBarColor === "transparent") {
    StatusBar.setTranslucent(true);
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("transparent", false);
  } else StatusBar.setBackgroundColor(colors[statusBarColor], true);

  const styles = makeStyles(
    colors,
    darkMode,
    statusBarColor === "transparent",
    StatusBar.currentHeight as number
  );

  return (
    <View style={styles.wrapperView}>
      <View style={absolutePosition ? styles.headerAbsolute : styles.header}>
        {backgroundImage && (
          <View style={styles.background}>
            {sportBackground[backgroundImage]}
          </View>
        )}
        {backEnabled ? (
          <Icon
            name="arrow-back"
            color={darkMode ? "black" : "white"}
            size={25}
            onPress={() => {
              if (route.name === "SignUpWithNumber")
                StatusBar.setBackgroundColor("black", true);

              if (route.name === "GameDetails") {
                StatusBar.setTranslucent(false);
                StatusBar.setBarStyle("light-content");
              }
              navigation.goBack();
            }}
          />
        ) : left ? (
          left
        ) : (
          <View />
        )}
        <View style={styles.middleView}>
          {title && <Text style={styles.title}>{title}</Text>}
          {showLogo && (
            <Image
              source={require("assets/images/Logo.png")}
              style={{ width: "40%" }}
              resizeMode={"contain"}
            />
          )}
          {middle}
        </View>
        {right ? right : <View />}
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          if (autoScroll)
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const makeStyles = (
  colors: MD3Colors,
  darkMode: boolean,
  transparentSB: boolean,
  SBHeight: number
) =>
  StyleSheet.create({
    wrapperView: {
      position: "relative",
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      position: "relative",
      minHeight: transparentSB ? 65 + SBHeight : 65,
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.secondary,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      paddingTop: transparentSB ? SBHeight : 0,
    },
    headerAbsolute: {
      position: "absolute",
      top: 0,
      left: 0,
      padding: 20,
      height: 65,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 1,
      paddingTop: 10,
    },
    middleView: {
      position: "absolute",
      left: 0,
      right: 0,
      alignItems: "center",
    },
    title: {
      color: darkMode ? "black" : "white",
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Inter-SemiBold",
      marginTop: transparentSB ? SBHeight : 0,
    },
    background: {
      position: "absolute",
      height: transparentSB ? 65 + SBHeight : 65,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
  });
