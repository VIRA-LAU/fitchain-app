import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";
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
  backEnabled = false,
  invertColors = false,
  backgroundImage,
  middleTitle = false,
}: {
  children: any;
  absolutePosition?: boolean;
  title?: string;
  showLogo?: boolean;
  right?: JSX.Element;
  middle?: JSX.Element;
  backEnabled?: boolean;
  invertColors?: boolean;
  backgroundImage?: "Basketball" | "Football" | "Tennis";
  middleTitle?: boolean;
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
    invertColors,
    StatusBar.currentHeight as number
  );

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
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FeatherIcon
                  name="chevron-left"
                  color={!invertColors ? colors.tertiary : colors.onPrimary}
                  size={25}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            )}
            {showLogo && (
              <Image
                source={require("assets/images/logo-text-dark.png")}
                style={{
                  width: "65%",
                  height: "auto",
                  aspectRatio: 5.24,
                  resizeMode: "contain",
                  marginLeft: -5,
                }}
              />
            )}
            {title && !middleTitle && <Text style={styles.title}>{title}</Text>}
          </View>

          <View style={styles.middleView}>
            {title && middleTitle && <Text style={styles.title}>{title}</Text>}
            {middle}
          </View>
          <View style={{ zIndex: 2 }}>{right}</View>
        </View>
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (
  colors: MD3Colors,
  invertColors: boolean,
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
      backgroundColor: colors.background,
      borderBottomWidth: 0.75,
      borderBottomColor: "rgba(43, 43, 43, 0.20)",
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
      paddingHorizontal: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 0,
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
      color: !invertColors ? colors.tertiary : colors.onPrimary,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Poppins-Bold",
    },
    background: {
      position: "absolute",
      height: 85 + SBHeight,
      overflow: "hidden",
      justifyContent: "center",
      transform: [{ translateX: -10 }],
    },
  });
