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

const sportBackground = {
  Basketball: <Image source={require("assets/images/home/basketball.png")} />,
  Football: <Image source={require("assets/images/home/football.png")} />,
  Tennis: <Image source={require("assets/images/home/tennis.png")} />,
};
export const AppHeader = ({
  children,
  absolutePosition = true,
  navigation,
  route,
  title,
  showLogo = false,
  right,
  middle,
  left,
  searchBar,
  setSearchBarText = () => {},
  backEnabled = false,
  darkMode = false,
  backgroundImage,
}: {
  children: any;
  absolutePosition?: boolean;
  navigation?: any;
  route?: any;
  title?: string;
  showLogo?: boolean;
  right?: JSX.Element;
  middle?: JSX.Element;
  left?: JSX.Element;
  searchBar?: boolean;
  setSearchBarText?: React.Dispatch<React.SetStateAction<string>>;
  backEnabled?: boolean;
  darkMode?: boolean;
  backgroundImage?: "Basketball" | "Football" | "Tennis";
}) => {
  const { colors } = useTheme();

  const styles = makeStyles(
    colors,
    darkMode,
    StatusBar.currentHeight as number,
    Platform
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.wrapperView}
    >
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
          {right}
        </View>
        {searchBar && (
          <View style={styles.searchBarView}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              placeholderTextColor={colors.tertiary}
              cursorColor={colors.primary}
              onChangeText={setSearchBarText}
            />
            <IonIcon name="search-outline" color="white" size={20} />
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (
  colors: MD3Colors,
  darkMode: boolean,
  SBHeight: number,
  platform: Object
) =>
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
      paddingTop: Platform.OS == "ios" ? 20 : 0,
    },
    headerAbsolute: {
      position: "absolute",
      top: 0,
      left: 0,
      paddingBottom: 20,
      width: "100%",
      zIndex: 1,
      paddingTop: Platform.OS == "ios" ? 20 : 0,
    },
    headerContent: {
      flexGrow: 1,
      paddingTop: SBHeight,
      minHeight: 65 + SBHeight,
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
      height: 80 + SBHeight,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
  });
