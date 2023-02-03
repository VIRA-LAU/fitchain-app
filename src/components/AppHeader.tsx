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
  backEnabled = false,
}: {
  children: any;
  absolutePosition?: boolean;
  statusBarColor?: "primary" | "secondary" | "background";
  autoScroll?: boolean;
  navigation?: any;
  route?: any;
  title?: string;
  showLogo?: boolean;
  right?: any;
  backEnabled?: boolean;
}) => {
  const { colors } = useTheme();
  const scrollViewRef: React.MutableRefObject<ScrollView | null> = useRef(null);

  StatusBar.setBackgroundColor(colors[statusBarColor], true);

  const styles = makeStyles(colors);

  return (
    <View style={styles.wrapperView}>
      <View style={absolutePosition ? styles.headerAbsolute : styles.header}>
        {showLogo && (
          <View style={styles.logoView}>
            <Image
              source={require("assets/images/Logo.png")}
              style={{ width: "40%" }}
              resizeMode={"contain"}
            />
          </View>
        )}
        {backEnabled ? (
          <Icon
            name="arrow-back"
            color="white"
            size={25}
            onPress={() => {
              if (route.name === "SignUpWithNumber")
                StatusBar.setBackgroundColor("black", true);
              navigation.goBack();
            }}
          />
        ) : (
          <View />
        )}
        {title && <Text style={styles.title}>{title}</Text>}
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

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      position: "relative",
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      position: "relative",
      minHeight: 65,
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.secondary,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
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
    },
    title: {
      position: "absolute",
      color: "white",
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 18,
    },
    logoView: {
      position: "absolute",
      left: 0,
      right: 0,
      alignItems: "center",
    },
  });
