import type { StackScreenProps } from "@react-navigation/stack";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SignUpStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text } from "react-native-paper";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useUpdateUserMutation } from "src/api";
import { UserContext } from "src/utils";

type Props = StackScreenProps<SignUpStackParamList, "SignUpExtraDetails">;

export const SignUpExtraDetails = ({
  navigation,
  route,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { userData: passedUserData } = route.params;
  const { setUserData } = useContext(UserContext);

  const {
    mutate: updateUserData,
    isLoading: updateUserLoading,
    isSuccess: updateUserDataSuccess,
  } = useUpdateUserMutation();

  const [description, setDescription] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleUpdateUserData = () => {
    let data: {
      description?: string;
      height?: number;
      weight?: number;
    } = {};
    if (description) data["description"] = description;
    if (!isNaN(parseInt(height))) data["height"] = parseInt(height);
    if (!isNaN(parseInt(weight))) data["weight"] = parseInt(weight);
    updateUserData(data);
  };

  useEffect(() => {
    if (updateUserDataSuccess) setUserData(passedUserData);
  }, [updateUserDataSuccess]);

  const scrollOffset = 60;
  const scrollRef: React.MutableRefObject<ScrollView | null> = useRef(null);
  const heightRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const weightRef: React.MutableRefObject<TextInput | null> = useRef(null);

  return (
    <AppHeader backEnabled>
      <ScrollView
        contentContainerStyle={styles.wrapperView}
        ref={scrollRef}
        onScroll={(event) => {
          setScrollPosition(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={8}
      >
        <Image
          source={require("assets/images/logo-text-dark.png")}
          style={{
            aspectRatio: 5.24,
            height: "auto",
            width: "50%",
            resizeMode: "contain",
            marginTop: 60,
            marginBottom: "25%",
          }}
        />

        <Text
          variant="headlineSmall"
          style={[
            styles.text,
            {
              textTransform: "uppercase",
              marginBottom: 8,
            },
          ]}
        >
          Your Info
        </Text>
        <Text variant="labelLarge" style={styles.text}>
          Please provide the following information
        </Text>

        <View style={{ width: "87%", marginTop: 24 }}>
          <Text style={{ fontFamily: "Poppins-Regular" }}>Bio</Text>
          <TextInput
            style={styles.textInput}
            selectionColor={colors.primary}
            onSubmitEditing={() => {
              heightRef.current?.focus();
              scrollRef.current?.scrollTo({
                y: scrollPosition + scrollOffset,
                animated: true,
              });
            }}
            blurOnSubmit={false}
            onChangeText={setDescription}
          />

          <Text style={{ fontFamily: "Poppins-Regular", marginTop: 4 }}>
            Height
          </Text>
          <TextInput
            style={styles.textInput}
            selectionColor={colors.primary}
            onSubmitEditing={() => {
              weightRef.current?.focus();
              scrollRef.current?.scrollTo({
                y: scrollPosition + scrollOffset,
                animated: true,
              });
            }}
            blurOnSubmit={false}
            ref={heightRef}
            onChangeText={setHeight}
          />

          <Text style={{ fontFamily: "Poppins-Regular", marginTop: 4 }}>
            Weight
          </Text>
          <TextInput
            style={styles.textInput}
            selectionColor={colors.primary}
            textContentType="emailAddress"
            autoCapitalize="none"
            ref={weightRef}
            onChangeText={setWeight}
          />
        </View>

        <View style={{ marginTop: "auto", width: "87%" }}>
          <Button
            mode="contained"
            style={{ marginTop: 20, height: 44, justifyContent: "center" }}
            loading={updateUserLoading}
            onPress={
              !updateUserLoading ? () => handleUpdateUserData() : undefined
            }
          >
            Complete
          </Button>

          <View
            style={{
              marginTop: 24,
              marginBottom: 64,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={
                !updateUserLoading
                  ? () => {
                      setUserData(passedUserData);
                    }
                  : undefined
              }
            >
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  textAlign: "center",
                }}
              >
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flexGrow: 1,
      backgroundColor: colors.background,
      alignItems: "center",
    },
    text: {
      color: colors.tertiary,
      textAlign: "center",
    },
    textInput: {
      height: 44,
      backgroundColor: colors.secondary,
      marginTop: 4,
      marginBottom: 8,
      borderRadius: 8,
      paddingHorizontal: 10,
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
    },
  });
