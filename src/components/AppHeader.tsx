import { useRef } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Text,
  Image,
  TextInput,
} from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";

const sportBackground = {
  basketball: <Image source={require("assets/images/home/basketball.png")} />,
  football: <Image source={require("assets/images/home/football.png")} />,
  tennis: <Image source={require("assets/images/home/tennis.png")} />,
};

export const AppHeader = ({
  children,
  absolutePosition = true,
  autoScroll = false,
  navigation,
  route,
  title,
  showLogo = false,
  right,
  middle,
  left,
  searchBar,
  backEnabled = false,
  darkMode = false,
  backgroundImage,
}: {
  children: any;
  absolutePosition?: boolean;
  autoScroll?: boolean;
  navigation?: any;
  route?: any;
  title?: string;
  showLogo?: boolean;
  right?: any;
  middle?: any;
  left?: any;
  searchBar?: boolean;
  backEnabled?: boolean;
  darkMode?: boolean;
  backgroundImage?: "basketball" | "football" | "tennis";
}) => {
  const { colors } = useTheme();
  const scrollViewRef: React.MutableRefObject<ScrollView | null> = useRef(null);

  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor("transparent", false);

  const styles = makeStyles(
    colors,
    darkMode,
    StatusBar.currentHeight as number
  );

  return (
    <View style={styles.wrapperView}>
      <View style={absolutePosition ? styles.headerAbsolute : styles.header}>
        <View style={styles.headerContent}>
          {backgroundImage && (
            <View style={styles.background}>
              {sportBackground[backgroundImage]}
            </View>
          )}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {backEnabled && (
              <MaterialIcon
                name="arrow-back"
                color={darkMode ? "black" : "white"}
                size={25}
                onPress={() => {
                  navigation.goBack();
                }}
                style={{ marginRight: 20 }}
              />
            )}
            {left}
          </View>
          <View />

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
        {searchBar && (
          <View style={styles.searchBarView}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              placeholderTextColor={colors.tertiary}
              cursorColor={colors.primary}
            />
            <IonIcon name="search-outline" color="white" size={20} />
          </View>
        )}
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

const makeStyles = (colors: MD3Colors, darkMode: boolean, SBHeight: number) =>
  StyleSheet.create({
    wrapperView: {
      position: "relative",
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      position: "relative",
      backgroundColor: colors.secondary,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    headerAbsolute: {
      position: "absolute",
      top: 0,
      left: 0,
      paddingBottom: 20,
      width: "100%",
      zIndex: 1,
    },
    headerContent: {
      flexGrow: 1,
      paddingTop: SBHeight,
      minHeight: 65 + SBHeight,
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    searchBarView: {
      borderWidth: 1,
      height: 40,
      margin: 20,
      marginTop: 0,
      borderColor: colors.tertiary,
      borderRadius: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    searchBar: {
      color: "white",
      fontFamily: "Inter-Medium",
      height: 40,
    },
    middleView: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 65,
      top: SBHeight,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      color: darkMode ? "black" : "white",
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Inter-SemiBold",
    },
    background: {
      position: "absolute",
      height: 65 + SBHeight,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
  });
