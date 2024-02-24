import { View, Image } from "react-native";
import { StyleSheet } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "navigation";
import { Button, useTheme, Text } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { AppHeader } from "src/components";

type Props = StackScreenProps<AuthStackParamList, "AccountTypeSelection">;

export const AccountTypeSelection = ({
  navigation,
  route,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <AppHeader>
      <View style={styles.wrapperView}>
        <Image
          source={require("assets/images/logo-text-dark.png")}
          style={{
            aspectRatio: 5.24,
            height: "auto",
            width: "75%",
            resizeMode: "contain",
            marginBottom: 44,
          }}
        />

        <Text
          variant="headlineSmall"
          style={{
            textTransform: "uppercase",
            marginBottom: 50,
            color: colors.tertiary,
          }}
        >
          Welcome to Fitchain!
        </Text>

        <View style={{ width: "87%" }}>
          <Button
            mode="contained"
            style={[styles.button, { marginBottom: 12 }]}
            onPress={() => {
              navigation.push("SignIn", { accountType: "user" });
            }}
          >
            Player
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => {
              navigation.push("SignIn", { accountType: "branch" });
            }}
          >
            Venue Owner
          </Button>
        </View>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      height: 44,
      justifyContent: "center",
    },
  });
