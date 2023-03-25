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
} from "react-native";
import { useTheme, Button } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import EntypoIcon from "react-native-vector-icons/Entypo";
import {
  useEditJoinRequestMutation,
  useRespondToInviteMutation,
} from "src/api";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";
import { Game } from "src/types";

export const InvitationCard = ({
  id,
  user,
  type,
  game,
  isFirst,
  isLast,
}: {
  id: number;
  user: string;
  type: "invitation" | "request";
  game: Game;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(colors, height, width);
  const hours = game.date.getHours();
  const minutes = game.date.getMinutes();
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

  const { mutate: editJoinRequest } = useEditJoinRequestMutation();
  const { mutate: respondToInvite } = useRespondToInviteMutation();

  return (
    <View
      style={[
        styles.wrapper,
        isFirst ? { marginLeft: 20 } : {},
        isLast ? { marginRight: 20 } : {},
      ]}
    >
      <Image
        source={
          game.type === "Basketball"
            ? require("assets/images/home/basketball.png")
            : game.type === "Football"
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
            <Text style={styles.text}>{user}</Text>
            {type === "invitation"
              ? " invited you to play "
              : " request to join "}
            <Text style={styles.text}>{game.type}</Text> on{" "}
            <Text style={styles.text}>
              {game.date
                .toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
                .slice(0, -6)}
              , {timeString}
            </Text>
            , at <Text style={styles.text}>{game.court.branch.venue.name}</Text>
            .
          </Text>
        </View>
        <View style={styles.buttonsView}>
          <Button
            icon={"account-check-outline"}
            style={{ borderRadius: 5, flex: 1 }}
            textColor={colors.secondary}
            buttonColor={colors.primary}
            onPress={() => {
              if (type === "request")
                editJoinRequest({
                  requestId: id,
                  status: "APPROVED",
                  gameId: game.id,
                });
              else
                respondToInvite({
                  invitationId: id,
                  gameId: game.id,
                  status: "APPROVED",
                });
            }}
          >
            Accept
          </Button>
          <Button
            icon={{ source: "account-remove-outline", direction: "rtl" }}
            style={{ borderRadius: 5, flex: 1 }}
            textColor={"white"}
            buttonColor={"transparent"}
            onPress={() => {
              if (type === "request")
                editJoinRequest({
                  requestId: id,
                  status: "REJECTED",
                  gameId: game.id,
                });
              else
                respondToInvite({
                  invitationId: id,
                  gameId: game.id,
                  status: "REJECTED",
                });
            }}
          >
            Decline
          </Button>
          <EntypoIcon
            name="dots-three-horizontal"
            color="white"
            size={18}
            onPress={() => navigation.push("GameDetails", { id: game.id })}
          />
        </View>
      </View>
    </View>
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
