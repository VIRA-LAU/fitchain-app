import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Image,
  Pressable,
} from "react-native";
import { useTheme, Button } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";

export const InvitationCard = ({
  gameType,
  date,
  location,
  inviter,
}: {
  gameType: "basketball" | "football" | "tennis";
  date: Date;
  location: string;
  inviter: string;
}) => {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(colors, height, width);
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  date = new Date(date);
  const day = weekday[date?.getDay()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours >= 12 ? "pm" : "am";
  const timeString =
    (hours % 12 || 12).toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    amPm;

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
      <Image
        source={
          gameType === "basketball"
            ? require("assets/images/home/basketball.png")
            : gameType === "football"
            ? require("assets/images/home/football.png")
            : require("assets/images/home/tennis.png")
        }
        style={styles.header}
      />
      <View style={styles.content}>
        <Image
          source={require("assets/images/home/profile-picture.png")}
          style={styles.profilePicture}
          resizeMode="contain"
        />
        <View style={{ maxWidth: 0.48 * width }}>
          <Text style={styles.greyText}>
            <Text style={styles.text}>{inviter}</Text> invited you to play{" "}
            <Text style={styles.text}>
              {gameType[0].toUpperCase()}
              {gameType.substring(1)}
            </Text>{" "}
            this{" "}
            <Text style={styles.text}>
              {day}, {timeString}
            </Text>
            , at <Text style={styles.text}>{location}</Text>.
          </Text>
        </View>
        <View style={styles.buttonsView}>
          <Button
            icon={"account-check-outline"}
            style={{ borderRadius: 5, flex: 1 }}
            textColor={colors.secondary}
            buttonColor={colors.primary}
          >
            Accept
          </Button>
          <Button
            icon={{ source: "account-remove-outline", direction: "rtl" }}
            style={{ borderRadius: 5, flex: 1 }}
            textColor={"white"}
            buttonColor={"transparent"}
          >
            Decline
          </Button>
          <EntypoIcon name="dots-three-horizontal" color="white" size={18} />
        </View>
      </View>
    </Pressable>
  );
};

const makeStyles = (colors: MD3Colors, height: number, width: number) =>
  StyleSheet.create({
    wrapper: {
      width: 0.7 * width,
      borderRadius: 10,
      justifyContent: "flex-end",
      marginHorizontal: 5,
    },
    content: {
      backgroundColor: colors.secondary,
      padding: 15,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    header: {
      alignSelf: "center",
      height: 50,
      width: "100%",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    profilePicture: {
      position: "absolute",
      height: 60,
      width: 60,
      top: -30,
      right: "7%",
      borderRadius: 50,
    },
    text: {
      color: "white",
      fontFamily: "Inter-SemiBold",
      lineHeight: 20,
    },
    greyText: {
      color: colors.tertiary,
      fontSize: 12,
      fontFamily: "Inter-Medium",
    },
    buttonsView: {
      flexDirection: "row",
      marginTop: 15,
      paddingRight: 10,
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
