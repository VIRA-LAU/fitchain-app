import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader } from "src/components";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useContext } from "react";
import { UserContext } from "src/utils";
import { ScrollView } from "react-native-gesture-handler";

type Props = StackScreenProps<HomeStackParamList, "chooseVenue">;

export const ChooseVenue = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { userData } = useContext(UserContext);

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Choose Venue"}
      backEnabled
    >
      <View style={styles.wrapperView}>
        <ScrollView style={styles.contentView}>
          <View style={{ margin: 20 }}>
            <View style={styles.infoView}>
              <IonIcon name={"location-outline"} size={20} color={"white"} />
              <Text variant="labelLarge" style={styles.information}>
                Hoops Club, Hazmieh
              </Text>
            </View>
            <View style={styles.infoView}>
              <IonIcon name={"calendar-outline"} size={20} color={"white"} />
              <Text variant="labelLarge" style={styles.information}>
                Hoops Club, Hazmieh
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              navigation.push("VenueDetails", { play: true, id: 1 });
            }}
          >
            <Text>Press</Text>
          </Pressable>
          {/* <VenueCard type="horizontal" venueBranch={""}/> */}
        </ScrollView>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    infoView: {
      marginBottom: 10,
      flexDirection: "row",
    },
    information: {
      marginLeft: 5,
      color: "white",
    },
    locationComponent: {
      margin: 20,
    },
    wrapperView: {
      flexDirection: "row",
      alignItems: "center",
    },

    contentView: {},
  });
