import { Button, Text, useTheme } from "react-native-paper";
import { View } from "react-native";
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
    <View
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
          borderRadius: 90,
          height: "60%",
          width: "60%",
        }}
      >
        <Button
          style={{ justifyContent: "center", height: "100%", width: "100%" }}
        >
          <FeatherIcon
            name={"user-plus"}
            color={"white"}
            size={25}
            style={{ height: "100%", width: "100%" }}
          />
        </Button>
      </View>
      <View style={{ marginTop: 5, alignItems: "center" }}>
        <Text variant="titleMedium" style={{ color: colors.tertiary }}>
          {playerName ? playerName : "Select"}{" "}
        </Text>
        <Text variant="titleSmall" style={{ color: colors.tertiary }}>
          {achievement}
        </Text>
      </View>
    </View>
  );
};
