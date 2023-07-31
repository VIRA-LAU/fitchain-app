import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Dispatch, SetStateAction, useRef } from "react";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SignUpStackParamList, StackParamList } from "src/navigation";

const sportBackground = {
  Basketball: <Image source={require("assets/images/home/basketball.png")} />,
  Football: <Image source={require("assets/images/home/football.png")} />,
  Tennis: <Image source={require("assets/images/home/tennis.png")} />,
};
export const AppHeader = ({
  children,
  absolutePosition = true,
  title,
  showLogo = false,
  right,
  middle,
  left,
  searchBar,
  searchBarText,
  setSearchBarVisible,
  setSearchBarText,
  backEnabled = false,
  darkMode = false,
  backgroundImage,
}: {
  children: any;
  absolutePosition?: boolean;
  title?: string;
  showLogo?: boolean;
  right?: JSX.Element;
  middle?: JSX.Element;
  left?: JSX.Element;
  searchBar?: boolean;
  searchBarText?: string;
  setSearchBarVisible?: Dispatch<SetStateAction<boolean>>;
  setSearchBarText?: Dispatch<SetStateAction<string>>;
  backEnabled?: boolean;
  darkMode?: boolean;
  backgroundImage?: "Basketball" | "Football" | "Tennis";
}) => {
  const { colors } = useTheme();

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<StackParamList>,
        StackNavigationProp<SignUpStackParamList>
      >
    >();
  const styles = makeStyles(
    colors,
    darkMode,
    StatusBar.currentHeight as number
  );

  const searchBarRef = useRef<TextInput>(null);

  return (
    <KeyboardAvoidingView behavior={"padding"} style={styles.wrapperView}>
      <View style={absolutePosition ? styles.headerAbsolute : styles.header}>
        <View style={styles.headerContent}>
          {backgroundImage && (
            <View style={styles.background}>
              {sportBackground[backgroundImage]}
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            {backEnabled && (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <MaterialIcon
                  name="arrow-back"
                  color={darkMode ? "black" : "white"}
                  size={25}
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            )}
            {left}
          </View>

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
          <View style={{ zIndex: 2 }}>{right}</View>
        </View>
        {searchBar && (
          <View style={styles.searchBarView}>
            <TextInput
              style={styles.searchBar}
              ref={searchBarRef}
              value={searchBarText}
              autoFocus={typeof setSearchBarVisible !== "undefined"}
              placeholder="Search..."
              placeholderTextColor={colors.tertiary}
              cursorColor={colors.primary}
              onChangeText={setSearchBarText}
              onBlur={() => {
                if (setSearchBarVisible && !searchBarText)
                  setSearchBarVisible(false);
              }}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              disabled={searchBarText === ""}
              onPress={() => {
                if (setSearchBarText) setSearchBarText("");
                searchBarRef.current?.blur();
                if (setSearchBarVisible) setSearchBarVisible(false);
              }}
            >
              <IonIcon
                name={searchBarText ? "close-outline" : "search-outline"}
                color="white"
                size={20}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </KeyboardAvoidingView>
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
      paddingTop: Platform.OS == "ios" ? 20 + SBHeight : SBHeight,
      minHeight: Platform.OS == "ios" ? 85 + SBHeight : 65 + SBHeight,
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 0,
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
      paddingRight: 20,
    },
    searchBar: {
      color: "white",
      fontFamily: "Inter-Medium",
      height: 40,
      flexGrow: 1,
      paddingHorizontal: 20,
    },
    middleView: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 65,
      top: Platform.OS == "ios" ? 20 + SBHeight : SBHeight,
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
      height: 80 + SBHeight,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
  });
