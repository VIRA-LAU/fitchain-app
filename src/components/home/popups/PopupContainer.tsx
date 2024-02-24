import { Dispatch, SetStateAction } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { BottomModal } from "../../modals";

export const PopupContainer = ({
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
  const styles = makeStyles(colors);

  return (
    <BottomModal
      visible={visible}
      setVisible={(state) => {
        if (!state) setVisible(false);
      }}
    >
      <View style={styles.prompt}>
        <Text style={styles.promptText}>{title}</Text>
        {children}
      </View>
    </BottomModal>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    prompt: {
      marginTop: "auto",
      marginBottom: "auto",
      marginLeft: "auto",
      marginRight: "auto",
      padding: 16,
      width: "75%",
      backgroundColor: colors.background,
      borderRadius: 10,
    },
    promptText: {
      fontFamily: "Poppins-Regular",
      textAlign: "center",
      color: colors.tertiary,
      marginBottom: 16,
      lineHeight: 20,
    },
  });
