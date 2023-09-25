import { Image, View } from "react-native";

export const Splash = () => {
  return (
    <View
      style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Image
        source={require("assets/images/logo.png")}
        resizeMode="contain"
        style={{
          width: "50%",
          height: "50%",
        }}
      />
    </View>
  );
};
