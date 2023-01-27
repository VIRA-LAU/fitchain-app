import { useRef } from "react";
import { StyleSheet, View, StatusBar, ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

export const NavigationHeader = ({
  backEnabled,
  children,
  title,
  navigation,
  route,
}: {
  backEnabled: boolean;
  children: any;
  title?: string;
  navigation?: any;
  route?: any;
}) => {
  const { colors } = useTheme();
  const scrollViewRef: React.MutableRefObject<ScrollView | null> = useRef(null);

  if (route.name !== "SignUp") {
    StatusBar.setBackgroundColor(colors.background, true);
  }

  return (
    <View style={styles.wrapperView}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {children}
      </ScrollView>
      <View style={styles.header}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperView: {
    position: "relative",
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: 20,
  },
});
