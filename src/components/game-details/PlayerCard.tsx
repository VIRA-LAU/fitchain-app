import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";
import { PlayerStatus, TeamPlayer } from "src/types";
import { UserContext } from "src/utils";
import { Skeleton } from "../home";

export const PlayerCardSkeleton = () => {
  const { colors } = useTheme();
  const windowWidth = useWindowDimensions().width;
  const styles = makeStyles(colors, windowWidth);

  return (
    <View
      style={[
        styles.wrapperView,
        { elevation: 15, transform: [{ scale: 1.1 }], zIndex: 2 },
      ]}
    >
      <Skeleton style={styles.header} />
      <View style={{ alignItems: "center", paddingTop: 40 }}>
        <Skeleton style={styles.profilePicture} />
        <Skeleton height={20} width={100} style={styles.name} />
        <View style={[styles.ratingView, { marginTop: 8 }]}>
          <IonIcon name={"star"} color={"white"} />
          <Skeleton height={15} width={30} style={styles.ratingText} />
        </View>
        <Skeleton height={30} style={styles.statusView} />

        <IonIcon
          name="ellipsis-horizontal"
          color={"white"}
          size={24}
          style={{ marginVertical: 5 }}
        />
      </View>
    </View>
  );
};

export const PlayerCard = ({
  isActive = false,
  player: { firstName, lastName, status, id, rated, rating },
  setActivePlayer,
  index,
  isPrevious,
  gameId,
  playerStatus,
}: {
  isActive?: boolean;
  player: TeamPlayer;
  setActivePlayer: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  isPrevious: boolean;
  gameId: number;
  playerStatus?: PlayerStatus;
}) => {
  const { colors } = useTheme();
  const windowWidth = useWindowDimensions().width;
  const styles = makeStyles(colors, windowWidth);
  const displayedStatus = !isPrevious
    ? status === "APPROVED"
      ? "Confirmed"
      : "Pending"
    : "Rate";
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();
  const { userData } = useContext(UserContext);

  const isInGame =
    playerStatus?.hasBeenInvited === "APPROVED" ||
    playerStatus?.hasRequestedtoJoin === "APPROVED" ||
    playerStatus?.isAdmin;

  return (
    <TouchableOpacity
      activeOpacity={id === userData?.userId ? 1 : 0.6}
      style={[
        styles.wrapperView,
        isActive
          ? { elevation: 15, transform: [{ scale: 1.1 }], zIndex: 2 }
          : { elevation: 10, opacity: 0.6 },
      ]}
      onPress={() => {
        if (id !== userData?.userId)
          navigation.push("PlayerProfile", {
            playerId: id,
            firstName,
            lastName,
          });
        setActivePlayer(index);
      }}
    >
      <Image
        source={require("assets/images/home/profile-background.png")}
        style={styles.header}
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 40,
          flexGrow: 1,
        }}
      >
        <Image
          source={require("assets/images/home/profile-picture.png")}
          style={styles.profilePicture}
          resizeMode="contain"
        />
        <Text style={styles.name}>
          {firstName} {lastName}
        </Text>
        <View style={styles.ratingView}>
          <IonIcon name={"star"} color={"white"} />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
        <View
          style={[
            styles.statusView,
            {
              backgroundColor:
                isPrevious && (rated || userData?.userId == id)
                  ? colors.primary
                  : colors.background,
              borderWidth:
                isPrevious && (rated || userData?.userId == id || !isInGame)
                  ? 0
                  : 1,
            },
          ]}
        >
          {isPrevious ? (
            isInGame && (
              <TouchableOpacity
                disabled={rated || id == userData?.userId}
                onPress={() =>
                  navigation.push("RatePlayer", {
                    playerId: id,
                    firstName,
                    lastName,
                    gameId: gameId,
                  })
                }
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        rated || userData?.userId == id
                          ? colors.background
                          : colors.tertiary,
                    },
                  ]}
                >
                  {id == userData?.userId ? "You" : rated ? "Rated" : "Rate"}
                </Text>
              </TouchableOpacity>
            )
          ) : (
            <Text style={[styles.statusText]}>{displayedStatus}</Text>
          )}
        </View>
        <IonIcon
          name="ellipsis-horizontal"
          color={"white"}
          size={24}
          style={{ marginVertical: 5 }}
        />
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: MD3Colors, windowWidth: number) =>
  StyleSheet.create({
    wrapperView: {
      width: 0.4 * windowWidth,
      height: 235,
      backgroundColor: colors.secondary,
      borderRadius: 10,
      alignItems: "center",
      marginRight: 5,
    },
    header: {
      height: 75,
      width: "100%",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    profilePicture: {
      position: "absolute",
      height: "55%",
      top: "-27.5%",
      aspectRatio: 1,
      borderRadius: 50,
    },
    name: {
      color: "white",
      fontFamily: "Inter-SemiBold",
      fontSize: 16,
      marginBottom: 5,
    },
    ratingView: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 3,
      justifyContent: "center",
    },
    ratingText: {
      color: "white",
      fontFamily: "Inter-Medium",
      marginLeft: 5,
    },
    statusView: {
      borderWidth: 1,
      borderColor: colors.tertiary,
      borderRadius: 20,
      width: 100,
      alignItems: "center",
      marginTop: 5,
    },
    statusText: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      padding: 5,
    },
  });
