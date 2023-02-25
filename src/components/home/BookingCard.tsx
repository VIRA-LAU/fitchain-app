import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";
import IonIcon from "react-native-vector-icons/Ionicons";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";
import "intl";
import "intl/locale-data/jsonp/en";

export const BookingCard = ({
  gameType,
}: {
  gameType: "basketball" | "football" | "tennis";
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();
  return (
    <Pressable
      style={styles.wrapper}
      onPress={() => navigation.push("GameDetails")}
    >
      <View style={styles.leftImageView}>
        <Image
          source={
            gameType === "basketball"
              ? require("assets/images/home/basketball.png")
              : gameType === "football"
              ? require("assets/images/home/football.png")
              : require("assets/images/home/tennis.png")
          }
          style={styles.leftImage}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.greyText, { fontSize: 14 }]}>
          <Text style={styles.text}>Basketball Game</Text> By{" "}
          <Text style={styles.text}>Alain H.</Text>
        </Text>
        <View style={styles.textRow}>
          <IonIcon
            name={"location-outline"}
            size={14}
            color={colors.tertiary}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.greyText}>Hoops - Furn el Chebbak</Text>
        </View>
        <View style={styles.textRow}>
          <FeatherIcon
            name={"calendar"}
            size={14}
            color={colors.tertiary}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.greyText}>Fri Oct 2 - 22:15 till 00:15</Text>
        </View>
      </View>
    </Pressable>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      justifyContent: "flex-end",
      borderRadius: 10,
      marginBottom: 10,
    },
    content: {
      padding: 15,
      flex: 1,
      backgroundColor: colors.secondary,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      justifyContent: "center",
    },
    leftImageView: {
      width: 55,
      height: 108,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      overflow: "hidden",
      justifyContent: "center",
    },
    leftImage: {
      height: "120%",
      width: "140%",
    },
    greyText: {
      color: colors.tertiary,
      fontFamily: "Inter-Medium",
      fontSize: 12,
      lineHeight: 23,
    },
    text: {
      color: "white",
      fontFamily: "Inter-SemiBold",
    },
    textRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
