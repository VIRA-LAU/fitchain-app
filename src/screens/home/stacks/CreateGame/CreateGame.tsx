import { StackScreenProps } from "@react-navigation/stack";
import { Fragment, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Button, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  AppHeader,
  CreateGameChoicePopup,
  GenericDialog,
} from "src/components";
import { HomeStackParamList } from "src/navigation";
import { Branch, Court } from "src/types";
import { GameCourtType } from "./GameCourtType";
import { BranchSelection } from "./BranchSelection";
import { GameType } from "src/enum-types";
import { DateTime } from "./DateTime";
import { Confirmation } from "./Confirmation";
import { useCreateGameMutation } from "src/api";

type Props = StackScreenProps<HomeStackParamList, "CreateGame">;

const numOfStages = 5;
enum Stages {
  GameCourtType = 0,
  BranchSelection = 1,
  CourtSelection = 2,
  DateTime = 3,
  Confirmation = 4,
}

export type GameCreationType = {
  gameType: GameType;
  courtType: "Half Court" | "Full Court";
  courtPrivacy: "Private" | "Public";
  minNumberOfPlayers: number;
  maxNumberOfPlayers: number;
  searchDate: string;
  startTime: string;
  duration: number;
  branch?: Branch;
  court?: Court;
};

export const CreateGame = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { width: windowWidth } = useWindowDimensions();

  const {
    gameDetails: oldGameDetails,
    stage: oldStage,
    isBooking,
  } = route.params;
  const stage = oldStage ?? 0;

  const {
    mutate: createGame,
    isLoading: createGameLoading,
    error: createGameError,
    isSuccess: createGameSuccess,
  } = useCreateGameMutation();

  const [gameDetails, setGameDetails] = useState<GameCreationType>(
    oldGameDetails ?? {
      gameType: GameType.Basketball,
      courtType: "Half Court",
      courtPrivacy: "Private",
      minNumberOfPlayers: 0,
      maxNumberOfPlayers: 8,
      searchDate: new Date().toISOString(),
      startTime: "08:00",
      duration: 0.5,
    }
  );

  const [choicePopupVisible, setChoicePopupVisible] = useState(false);
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

  const buttonDisabled =
    (stage === Stages.BranchSelection &&
      (!gameDetails.branch || !gameDetails.court)) ||
    createGameLoading;

  useEffect(() => {
    if (createGameSuccess) navigation.popToTop();
  }, [createGameSuccess]);

  useEffect(() => {
    if (
      createGameError &&
      createGameError.response?.data.message === "EXISTING_GAME_OVERLAP"
    )
      setErrorDialogVisible(true);
  }, [createGameError]);

  return (
    <Fragment>
      <AppHeader absolutePosition={false} title={"Create a Game"} backEnabled>
        <View style={styles.stageBarBackground}>
          <View
            style={[
              styles.stageBar,
              { width: (windowWidth / numOfStages) * (stage + 1) },
            ]}
          />
        </View>
        <ScrollView contentContainerStyle={styles.wrapper}>
          {stage === Stages.GameCourtType && (
            <GameCourtType
              gameDetails={gameDetails}
              setGameDetails={setGameDetails}
            />
          )}
          {stage === Stages.BranchSelection && (
            <BranchSelection
              gameDetails={gameDetails}
              setGameDetails={setGameDetails}
            />
          )}
          {stage === Stages.DateTime && (
            <DateTime
              gameDetails={gameDetails}
              setGameDetails={setGameDetails}
              isBooking={isBooking}
            />
          )}
          {stage === Stages.Confirmation && (
            <Confirmation gameDetails={gameDetails} />
          )}

          <View style={{ marginTop: "auto", marginBottom: 24 }}>
            <Button
              mode="contained"
              buttonColor={buttonDisabled ? colors.secondary : colors.primary}
              textColor={buttonDisabled ? colors.tertiary : colors.background}
              style={styles.next}
              loading={createGameLoading}
              onPress={
                buttonDisabled
                  ? undefined
                  : () => {
                      if (stage === Stages.BranchSelection) {
                        if (gameDetails.branch?.allowsBooking)
                          setChoicePopupVisible(true);
                        else
                          navigation.push("CreateGame", {
                            stage: stage + 2,
                            gameDetails,
                            isBooking: false,
                          });
                      } else if (stage === Stages.Confirmation) {
                        if (gameDetails.court) {
                          const startDate = new Date(gameDetails.searchDate);
                          startDate.setHours(
                            parseInt(gameDetails.startTime.substring(0, 2))
                          );
                          startDate.setMinutes(
                            parseInt(gameDetails.startTime.substring(3, 5))
                          );

                          const endDate = new Date(startDate);
                          endDate.setMinutes(
                            endDate.getMinutes() + gameDetails.duration * 60
                          );

                          createGame({
                            courtId: gameDetails.court.id,
                            startTime: startDate.toISOString(),
                            endTime: endDate.toISOString(),
                            type: gameDetails.gameType,
                          });
                        }
                      } else
                        navigation.push("CreateGame", {
                          stage: stage + 1,
                          gameDetails,
                        });
                    }
              }
            >
              {stage === Stages.Confirmation ? "Complete Payment" : "Next"}
            </Button>
          </View>
        </ScrollView>
      </AppHeader>
      <CreateGameChoicePopup
        visible={choicePopupVisible}
        setVisible={setChoicePopupVisible}
        bookCourt={() =>
          navigation.push("CreateGame", {
            stage: stage + 2,
            gameDetails,
            isBooking: true,
          })
        }
        skipBooking={() =>
          navigation.push("CreateGame", {
            stage: stage + 2,
            gameDetails,
            isBooking: false,
          })
        }
      />
      <GenericDialog
        visible={errorDialogVisible}
        setVisible={setErrorDialogVisible}
        title="Booking Overlap"
        text="A game was recently booked during this time. Please try again."
      />
    </Fragment>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: { flexGrow: 1, padding: 16 },
    stageBarBackground: {
      width: "100%",
      height: 8,
      backgroundColor: colors.secondary,
    },
    stageBar: {
      height: 8,
      backgroundColor: colors.primary,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },
    title: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
    },
    text: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
    },
    next: {
      height: 44,
      justifyContent: "center",
    },
  });
