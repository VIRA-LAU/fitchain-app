import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { LogoSvg } from "src/assets/images/LogoSvg";
import { AppHeader } from "src/components";
import { BottomTabParamList } from "src/navigation";

type Props = BottomTabScreenProps<BottomTabParamList>;

export const Challenges = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <AppHeader absolutePosition={false} title={"Challenges"}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text
          style={[
            styles.text,
            {
              color: "#6B6B6B",
              textTransform: "uppercase",
            },
          ]}
        >
          {new Date()
            .toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            .slice(0, -6)}
        </Text>
        <Text style={[styles.title, { fontSize: 20 }]}>Activity</Text>
        <View style={styles.activity}>
          {/* <Image
            source={require("assets/images/logo.png")}
            style={{
              resizeMode: "contain",
              width: "50%",
              height: "auto",
              aspectRatio: 1,
            }}
          /> */}
          <LogoSvg />
          <Text
            style={[
              styles.text,
              { color: colors.primary, fontSize: 12, marginTop: 23 },
            ]}
          >
            50% Completed
          </Text>
          <Text style={[styles.title, { fontSize: 14 }]}>
            You’re halfway there!
          </Text>
        </View>
        <Text style={styles.title}>Challenges</Text>
        <ScrollView
          style={{ marginHorizontal: -16 }}
          contentContainerStyle={styles.challenges}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View style={[styles.challenge, { marginLeft: 16 }]}>
            <Text style={[styles.text, { marginBottom: 14 }]}>Complete</Text>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              1 Game
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 14,
                  color: colors.tertiary,
                }}
              >
                /week
              </Text>
            </Text>
          </View>
          <View style={styles.challenge}>
            <Text style={[styles.text, { marginBottom: 14 }]}>Complete</Text>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              4 Games
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 14,
                  color: colors.tertiary,
                }}
              >
                /week
              </Text>
            </Text>
          </View>
          <View style={styles.challenge}>
            <Text style={[styles.text, { marginBottom: 14 }]}>Complete</Text>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              15 Games
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 14,
                  color: colors.tertiary,
                }}
              >
                /month
              </Text>
            </Text>
          </View>
        </ScrollView>
        <Text style={styles.title}>Awards</Text>
        <ScrollView
          style={{ marginHorizontal: -16 }}
          contentContainerStyle={styles.awards}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View style={[styles.award, { marginLeft: 16 }]}>
            <Image
              source={require("assets/images/home/award.png")}
              style={{
                resizeMode: "contain",
                width: 70,
                height: "auto",
                aspectRatio: 1,
                marginBottom: 10,
              }}
            />
            <Text
              style={[
                styles.title,
                {
                  color: colors.primary,
                  textTransform: "uppercase",
                },
              ]}
            >
              MVP
            </Text>
          </View>
          <View style={styles.award}>
            <Image
              source={require("assets/images/home/award.png")}
              style={{
                resizeMode: "contain",
                width: 70,
                height: "auto",
                aspectRatio: 1,
                marginBottom: 10,
              }}
            />
            <Text
              style={[
                styles.title,
                {
                  color: colors.primary,
                  textTransform: "uppercase",
                },
              ]}
            >
              MVP
            </Text>
          </View>
          <View style={styles.award}>
            <Image
              source={require("assets/images/home/award.png")}
              style={{
                resizeMode: "contain",
                width: 70,
                height: "auto",
                aspectRatio: 1,
                marginBottom: 10,
              }}
            />
            <Text
              style={[
                styles.title,
                {
                  color: colors.primary,
                  textTransform: "uppercase",
                },
              ]}
            >
              MVP
            </Text>
          </View>
          <View style={styles.award}>
            <Image
              source={require("assets/images/home/award.png")}
              style={{
                resizeMode: "contain",
                width: 70,
                height: "auto",
                aspectRatio: 1,
                marginBottom: 10,
              }}
            />
            <Text
              style={[
                styles.title,
                {
                  color: colors.primary,
                  textTransform: "uppercase",
                },
              ]}
            >
              MVP
            </Text>
          </View>
        </ScrollView>
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      padding: 16,
      paddingBottom: 50,
    },
    text: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
    },
    title: {
      fontFamily: "Poppins-Bold",
      fontSize: 16,
      color: colors.tertiary,
    },
    activity: {
      alignItems: "center",
      marginTop: 32,
      marginBottom: 24,
    },
    challenges: {
      flexDirection: "row",
      marginTop: 16,
      marginBottom: 24,
    },
    challenge: {
      backgroundColor: colors.secondary,
      borderRadius: 15,
      padding: 16,
      minWidth: 180,
      marginRight: 16,
    },
    awards: {
      flexDirection: "row",
      marginTop: 16,
    },
    award: {
      backgroundColor: colors.secondary,
      borderRadius: 15,
      padding: 16,
      minWidth: 140,
      marginRight: 16,
      alignItems: "center",
    },
  });
