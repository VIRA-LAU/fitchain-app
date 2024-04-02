import { Dispatch, SetStateAction, useEffect } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { Game } from "src/types";
import { ModalContainer } from "./ModalContainer";
import { useUpdateGameMutation } from "src/api";
import { GameStatus } from "src/enum-types";

export const MarkGameComplete = ({
  visible,
  setVisible,
  game,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  game?: Game;
}) => {
  const {
    mutate: updateGame,
    isLoading: updateLoading,
    isSuccess: updateSuccess,
  } = useUpdateGameMutation(game?.id);

  useEffect(() => {
    if (updateSuccess) setVisible(false);
  }, [updateSuccess]);

  return (
    <ModalContainer
      title={`Are you sure you want to mark this game as complete?`}
      visible={visible}
      setVisible={setVisible}
    >
      <View style={{ gap: 8 }}>
        <Button
          mode="contained"
          loading={updateLoading}
          onPress={
            updateLoading
              ? undefined
              : () => updateGame({ status: GameStatus.COMPLETE })
          }
        >
          Yes
        </Button>
        <Button onPress={() => setVisible(false)}>No</Button>
      </View>
    </ModalContainer>
  );
};
