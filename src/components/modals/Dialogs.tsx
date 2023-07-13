import { Dispatch, SetStateAction } from "react";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";

export const GalleryPermissionDialog = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => (
  <GenericDialog
    visible={visible}
    setVisible={setVisible}
    title="Allow Gallery Access"
    text={
      "Please allow FitChain to access your gallery from your mobile settings to be able to upload photos."
    }
  />
);

export const GenericDialog = ({
  visible,
  setVisible,
  title,
  text,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  text: string;
}) => {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        theme={theme}
      >
        <Dialog.Title style={{ color: "white" }}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ color: "white" }}>
            {text}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setVisible(false);
            }}
          >
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
