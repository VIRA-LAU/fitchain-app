import { Dispatch, SetStateAction } from "react";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";

export const GalleryPermissionDialog = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
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
        <Dialog.Title style={{ color: "white" }}>
          Allow Gallery Access
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ color: "white" }}>
            Please allow FitChain to access your gallery from your mobile
            settings to be able to upload photos.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setVisible(false);
            }}
          >
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
