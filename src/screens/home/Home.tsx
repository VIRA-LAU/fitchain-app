import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  AppHeader,
  UpcomingGameCard,
  ActivityCard,
  BookingCard,
  InvitationCard,
  VenueCard,
  SportTypeDropdown,
} from "components";
import { BottomTabParamList } from "src/navigation/tabScreenOptions";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import FeatherIcon from "react-native-vector-icons/Feather";
import IonIcon from "react-native-vector-icons/Ionicons";

type Props = BottomTabScreenProps<BottomTabParamList>;

const SectionTitle = ({ title, styles }: { title: string; styles: any }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.sectionTitle}>
      <Text variant="labelLarge" style={{ color: colors.tertiary }}>
        {title}
      </Text>
      <FeatherIcon name="chevron-right" color={colors.tertiary} size={20} />
    </View>
  );
};

export const Home = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      right={<IonIcon name="notifications-outline" color="white" size={24} />}
      left={<SportTypeDropdown />}
      showLogo
    >
      <View style={styles.wrapperView}>
        <Text variant="headlineSmall" style={{ color: "white" }}>
          Hi User,
        </Text>
        <Text variant="labelLarge" style={styles.headerSubtext}>
          Upcoming Games
        </Text>
        <View>
          <UpcomingGameCard gameType="basketball" />
          <UpcomingGameCard gameType="football" />
        </View>
        <SectionTitle title="Invitations" styles={styles} />
        <ScrollView style={{ flexDirection: "row" }} horizontal>
          <InvitationCard gameType="basketball" />
          <InvitationCard gameType="football" />
        </ScrollView>
        <SectionTitle title="Venues" styles={styles} />
        <ScrollView style={{ flexDirection: "row" }} horizontal>
          <VenueCard />
          <VenueCard />
        </ScrollView>
        <SectionTitle title="Bookings" styles={styles} />
        <View>
          <BookingCard gameType="basketball" />
          <BookingCard gameType="football" />
        </View>
        <SectionTitle title="Activities" styles={styles} />
        <View>
          <ActivityCard gameType="basketball" />
          <ActivityCard gameType="football" />
        </View>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    headerSubtext: { color: colors.tertiary, marginTop: 10, marginBottom: 20 },
    sectionTitle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 30,
      marginBottom: 20,
    },
  });
