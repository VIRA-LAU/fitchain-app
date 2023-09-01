import { Dispatch, Fragment, SetStateAction } from "react";
import { Modal, Pressable, View } from "react-native";

export const BottomModal = ({
  visible,
  setVisible,
  onClose,
  children,
  setPlayScreenStillVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  onClose?: Function;
  children: JSX.Element | JSX.Element[];
  setPlayScreenStillVisible?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Fragment>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          opacity: 0.5,
          display: visible ? "flex" : "none",
          zIndex: 1,
        }}
      />
      <Modal
        animationType="slide"
        visible={visible}
        statusBarTranslucent
        onRequestClose={() => {
          if (setPlayScreenStillVisible) setPlayScreenStillVisible(false);
          setVisible(false);
          if (onClose) onClose();
        }}
        transparent
      >
        <Pressable
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          onPress={() => {
            if (setPlayScreenStillVisible) setPlayScreenStillVisible(false);
            setVisible(false);
          }}
        />
        {children}
      </Modal>
    </Fragment>
  );
};
