import { Dispatch, SetStateAction } from "react";
import { Pressable, View } from "react-native";
import { Modal, Text, useTheme } from "react-native-paper";

export const ModalContainer = ({
  title,
  children,
  visible,
  setVisible,
}: {
  title: string;
  children: JSX.Element;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      style={{ marginTop: 0 }}
      dismissable={false}
      contentContainerStyle={{
        height: "100%",
      }}
      dismissableBackButton
      onDismiss={() => setVisible(false)}
    >
      <Pressable
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "#0005",
        }}
        onPress={() => setVisible(false)}
      />
      <View
        style={{
          padding: 16,
          backgroundColor: colors.background,
          borderRadius: 16,
          marginHorizontal: 50,
        }}
      >
        {title && (
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              textAlign: "center",
              color: colors.tertiary,
              marginBottom: 16,
              lineHeight: 20,
            }}
          >
            {title}
          </Text>
        )}
        {children}
      </View>
    </Modal>
  );
};
