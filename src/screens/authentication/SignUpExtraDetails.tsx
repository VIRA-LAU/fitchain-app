import type { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, Image, TextInput, ScrollView } from "react-native";
import { SignUpStackParamList } from "navigation";
import { AppHeader } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text, ActivityIndicator } from "react-native-paper";
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
    <AppHeader navigation={navigation} route={route} backEnabled>
      <ScrollView
        contentContainerStyle={styles.wrapperView}
        ref={scrollRef}
        onScroll={(event) => {
          setScrollPosition(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={8}
      >
        <Image source={require("assets/images/Logo-Icon.png")} />
        <Text variant="titleLarge" style={styles.titleText}>
          You're almost there!
        </Text>
        <View style={styles.inputView}>
          <Text variant="labelLarge" style={styles.h2}>
            Please provide the following information.
          </Text>
          <View style={styles.textInputView}>
            <MaterialCommunityIcon
              name={"account-outline"}
              size={20}
              color={"#c9c9c9"}
              style={{ marginHorizontal: 15 }}
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Tell us a bit about yourself."}
              placeholderTextColor={"#a8a8a8"}
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
          </View>
          <View style={styles.textInputView}>
            <MaterialCommunityIcon
              name={"account-outline"}
              size={20}
              color={"#c9c9c9"}
              style={{ marginHorizontal: 15 }}
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Height"}
              placeholderTextColor={"#a8a8a8"}
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
          </View>

          <View style={styles.textInputView}>
            <MaterialCommunityIcon
              name={"email-outline"}
              size={20}
              color={"#c9c9c9"}
              style={{ marginHorizontal: 15 }}
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Weight"}
              placeholderTextColor={"#a8a8a8"}
              selectionColor={colors.primary}
              textContentType="emailAddress"
              autoCapitalize="none"
              ref={weightRef}
              onChangeText={setWeight}
            />
          </View>
          {updateUserLoading && (
            <ActivityIndicator style={{ marginTop: "10%" }} />
          )}
          {!updateUserLoading && (
            <Button
              textColor={colors.background}
              buttonColor={colors.primary}
              style={[styles.getStartedButton, { marginTop: "10%" }]}
              onPress={() => handleUpdateUserData()}
            >
              Complete
            </Button>
          )}
          {!updateUserLoading && (
            <Button
              style={styles.getStartedButton}
              onPress={() => {
                setUserData(passedUserData);
              }}
            >
              Skip
            </Button>
          )}
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
      justifyContent: "center",
      paddingVertical: "5%",
    },
    titleText: {
      marginTop: "5%",
      color: "white",
    },
    inputView: {
      marginTop: "10%",
      width: "80%",
    },
    h2: {
      marginBottom: "3%",
      color: colors.tertiary,
      textAlign: "center",
    },
    textInputView: {
      marginTop: "7%",
      backgroundColor: colors.secondary,
      borderRadius: 5,
      height: 45,
      flexDirection: "row",
      alignItems: "center",
    },
    textInput: {
      borderRadius: 5,
      fontSize: 14,
      color: "white",
      width: "100%",
      fontFamily: "Inter-Medium",
    },
    getStartedButton: {
      borderRadius: 6,
      height: 50,
      justifyContent: "center",
      borderWidth: 1,
    },
  });
