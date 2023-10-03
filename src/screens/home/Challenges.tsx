import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { AppHeader } from "src/components";
import { BottomTabParamList } from "src/navigation";

type Props = BottomTabScreenProps<BottomTabParamList>;

export const Challenges = ({ navigation, route }: Props) => {
  return (
    <AppHeader absolutePosition={false} title={"Challenges"}>
      <View></View>
    </AppHeader>
  );
};
