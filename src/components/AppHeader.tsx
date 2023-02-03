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
  statusBarColor = "secondary",
  backEnabled = false,
  absolutePosition = true,
  title,
  navigation,
  route,
  logo = false,
}: {
  children: any;
  backEnabled?: boolean;
  absolutePosition?: boolean;
  title?: string;
  navigation?: any;
  route?: any;
  logo?: boolean;
  statusBarColor?: "primary" | "secondary" | "background";
}) => {
  const { colors } = useTheme();
  const scrollViewRef: React.MutableRefObject<ScrollView | null> = useRef(null);

  StatusBar.setBackgroundColor(colors[statusBarColor], true);

  const styles = createStyles(colors);

  return (
    <View style={styles.wrapperView}>
      <View style={absolutePosition ? styles.headerAbsolute : styles.header}>
        {logo && (
          <View style={styles.logoView}>
            <Image
              source={require("assets/images/Logo.png")}
              style={{ width: "40%" }}
              resizeMode={"contain"}
            />
          </View>
        )}
        {backEnabled && (
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
        )}
        {title && <Text style={styles.title}>{title}</Text>}
        <View />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {children}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      position: "relative",
      flex: 1,
    },
    header: {
      position: "relative",
      minHeight: 65,
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.secondary,
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
