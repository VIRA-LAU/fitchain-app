import { Text, useTheme } from "react-native-paper";
import { TouchableOpacity, View } from "react-native";
import { useEffect } from "react";
import FeatherIcon from "react-native-vector-icons/Feather";

export const TopPlayersCard = ({
  achievement,
  playerName,
}: {
  achievement: string;
  playerName: string | null;
}) => {
  const { colors } = useTheme();
  useEffect(() => {}, []);
  return (
    <TouchableOpacity
      style={{
        height: "100%",
        width: "100%",
        marginVertical: 20,
        alignItems: "center",
      }}
    >
      <View
        style={{
          borderWidth: 5,
          borderColor: "white",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 90,
          height: "60%",
          width: "60%",
        }}
      >
        <FeatherIcon name={"user-plus"} color={"white"} size={24} />
      </View>
      <View style={{ marginTop: 5, alignItems: "center" }}>
        <Text variant="titleMedium" style={{ color: colors.tertiary }}>
          {playerName ? playerName : "Select"}{" "}
        </Text>
        <Text variant="titleSmall" style={{ color: colors.tertiary }}>
          {achievement}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
