import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { AppHeader } from "src/components";
import { BottomTabParamList } from "src/navigation";

type Props = BottomTabScreenProps<BottomTabParamList>;

export const Community = ({ navigation, route }: Props) => {
  return (
    <AppHeader absolutePosition={false} title={"Community"}>
      <View></View>
    </AppHeader>
  );
};
