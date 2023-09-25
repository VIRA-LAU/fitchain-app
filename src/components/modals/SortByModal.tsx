import { Dispatch, SetStateAction } from "react";
import { TouchableOpacity, View } from "react-native";
import { Modal } from "react-native";
import { modalStyles } from "./SelectionModal";
import { Text, useTheme } from "react-native-paper";
import FeatherIcon from "react-native-vector-icons/Feather";

export const SortByModal = ({
  visible,
  setVisible,
  sortOption,
  setSortOption,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  sortOption: "date" | "location";
  setSortOption: Dispatch<SetStateAction<"date" | "location">>;
}) => {
  const { colors } = useTheme();
  const mStyles = modalStyles(colors);
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableOpacity
        style={mStyles.transparentView}
        onPress={() => {
          setVisible(false);
        }}
      />
      <View
        style={[
          mStyles.modalView,
          {
            width: 180,
            marginLeft: "auto",
            marginRight: 5,
          },
        ]}
      >
        <Text
          style={{
            fontFamily: "Poppins-Regular",
            marginTop: 10,
            marginBottom: 7,
            color: colors.tertiary,
          }}
        >
          Sort By
        </Text>
        <TouchableOpacity
          onPress={() => {
            setSortOption("date");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 7,
              height: 30,
            }}
          >
            <Text
              variant="labelLarge"
              style={{
                color: colors.tertiary,
              }}
            >
              Date
            </Text>
            {sortOption === "date" && (
              <FeatherIcon
                name="check"
                color={colors.tertiary}
                size={26}
                style={{ marginLeft: "auto" }}
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSortOption("location");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 7,
              height: 30,
            }}
          >
            <Text
              variant="labelLarge"
              style={{
                color: colors.tertiary,
              }}
            >
              Location
            </Text>
            {sortOption === "location" && (
              <FeatherIcon
                name="check"
                color={colors.tertiary}
                size={26}
                style={{ marginLeft: "auto" }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
