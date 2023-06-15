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
import { AppHeader, MapComponent } from "components";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, useTheme, Text, ActivityIndicator } from "react-native-paper";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dispatch, SetStateAction, useRef, useEffect } from "react";
import { useState } from "react";
import { useCreateBranchMutation, useLocationNameQuery } from "src/api";
import { LatLng, Region } from "react-native-maps";
import * as Location from "expo-location";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

type Props = StackScreenProps<SignUpStackParamList, "SignUpAsVenueDetails">;

export const SignUpAsVenueDetails = ({
  navigation,
  route,
  setSignedIn,
}: {
  navigation: Props["navigation"];
  route: Props["route"];
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [password, setPassword] = useState("");
  const [branchLocation, setBranchLocation] = useState<LatLng>();
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 33.895462996463095,
    longitude: 35.5006168037653,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [locationDescription, setLocationDescription] = useState("");
  const [managerFirstName, setManagerFirstName] = useState("");
  const [managerLastName, setManagerLastName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mapVisible, setMapVisible] = useState<boolean>(false);

  const {
    mutate: createBranch,
    isLoading: createBranchLoading,
    error,
  } = useCreateBranchMutation(setSignedIn);
  const {
    data: autoLocationDescription,
    refetch: getAutoLocationDescription,
    isFetching: locationNameLoading,
  } = useLocationNameQuery(branchLocation);

  useEffect(() => {
    const getUserLocation = async () => {
      let location = await Location.getCurrentPositionAsync();
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };
    getUserLocation();
  }, []);

  useEffect(() => {
    if (branchLocation) getAutoLocationDescription();
  }, [JSON.stringify(branchLocation)]);

  useEffect(() => {
    if (autoLocationDescription)
      setLocationDescription(autoLocationDescription);
  }, [autoLocationDescription]);

  useEffect(() => {
    if (error && error?.response?.data?.message === "CREDENTIALS_TAKEN")
      setErrorMessage("Email already in use.");
  }, [error]);

  const validateEmail = (managerEmail: string) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(managerEmail);
  };

  const signUp = () => {
    if (
      checkPasswordValidity(password) &&
      locationDescription.length > 0 &&
      branchLocation &&
      validateEmail(managerEmail) &&
      managerFirstName.length > 0 &&
      managerLastName.length > 0
    ) {
      let data = {
        isVenue: true,
        venueId: 1,
        location: locationDescription,
        latitude: branchLocation.latitude,
        longitude: branchLocation.longitude,
        managerFirstName,
        managerLastName,
        phoneNumber: route.params.phoneNumber,
        managerEmail,
        password,
      };
      setErrorMessage("");
      createBranch(data);
    } else {
      setErrorMessage("Make sure all fields are valid.");
    }
  };

  const checkPasswordValidity = (currentPassword: string) => {
    setPassword(currentPassword);
    const upperCaseLetters = /[A-Z]/g;
    const lowerCaseLetters = /[a-z]/g;
    const numbers = /[0-9]/g;

    if (
      currentPassword.match(upperCaseLetters) &&
      currentPassword.match(lowerCaseLetters) &&
      currentPassword.match(numbers) &&
      currentPassword.length >= 8
    ) {
      setErrorMessage("");
      return true;
    } else {
      setErrorMessage(
        "Make sure your password includes at least an upper case, a lower case, a digit, and 8 characters."
      );
      return false;
    }
  };

  const emailRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const lastNameRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const passwordRef: React.MutableRefObject<TextInput | null> = useRef(null);

  return (
    <AppHeader navigation={navigation} route={route} backEnabled autoScroll>
      <ScrollView contentContainerStyle={styles.wrapperView}>
        <Image
          source={require("assets/images/Logo-Icon.png")}
          style={styles.logo}
        />
        <Text variant="titleLarge" style={styles.titleText}>
          Branch Account Details
        </Text>
        {!mapVisible ? (
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
                placeholder={"Manager First Name"}
                placeholderTextColor={"#a8a8a8"}
                selectionColor={colors.primary}
                onSubmitEditing={() => lastNameRef.current?.focus()}
                onChangeText={(text) => {
                  setManagerFirstName(text.trim());
                  setErrorMessage("");
                }}
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
                placeholder={"Manager Last Name"}
                placeholderTextColor={"#a8a8a8"}
                selectionColor={colors.primary}
                onSubmitEditing={() => emailRef.current?.focus()}
                ref={lastNameRef}
                onChangeText={(text) => {
                  setManagerLastName(text.trim());
                  setErrorMessage("");
                }}
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
                placeholder={"Venue Email"}
                placeholderTextColor={"#a8a8a8"}
                selectionColor={colors.primary}
                textContentType="emailAddress"
                autoCapitalize="none"
                onSubmitEditing={() => passwordRef.current?.focus()}
                ref={emailRef}
                onChangeText={(text) => {
                  setManagerEmail(text.trim());
                  setErrorMessage("");
                }}
              />
            </View>
            <View style={styles.textInputView}>
              <MaterialCommunityIcon
                name={"lock"}
                size={20}
                color={"#c9c9c9"}
                style={{ marginHorizontal: 15 }}
              />
              <TextInput
                style={styles.textInput}
                placeholder={"Password"}
                placeholderTextColor={"#a8a8a8"}
                selectionColor={colors.primary}
                secureTextEntry={true}
                value={password}
                ref={passwordRef}
                onChangeText={(password) =>
                  checkPasswordValidity(password.trim())
                }
              />
            </View>
            <Button
              icon={"map-marker-outline"}
              style={{ marginTop: "7%" }}
              onPress={() => {
                setMapVisible(true);
              }}
            >
              Set Branch Location
            </Button>
            {locationNameLoading ? (
              <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
              <View style={styles.textInputView}>
                <MaterialCommunityIcon
                  name={"map-marker-outline"}
                  size={20}
                  color={"#c9c9c9"}
                  style={{ marginHorizontal: 15 }}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder={"Location Description"}
                  placeholderTextColor={"#a8a8a8"}
                  selectionColor={colors.primary}
                  value={locationDescription ?? autoLocationDescription}
                  onChangeText={(text) => setLocationDescription(text)}
                  editable={
                    typeof autoLocationDescription !== "undefined" &&
                    autoLocationDescription !== ""
                  }
                />
              </View>
            )}
            {errorMessage && (
              <Text
                variant="labelMedium"
                style={{
                  color: "red",
                  textAlign: "center",
                  marginTop: "5%",
                  fontFamily: "Inter-SemiBold",
                }}
              >
                {errorMessage}
              </Text>
            )}
            {createBranchLoading ? (
              <ActivityIndicator style={{ marginTop: "13%" }} />
            ) : (
              <Button
                textColor={colors.background}
                buttonColor={colors.primary}
                style={styles.getStartedButton}
                onPress={() => signUp()}
              >
                Get Started
              </Button>
            )}
          </View>
        ) : (
          <View style={styles.mapView}>
            <Text
              variant="labelLarge"
              style={[styles.h2, { marginBottom: 20 }]}
            >
              Please set the branch location.
            </Text>
            <View style={{ flexGrow: 1 }}>
              <TouchableOpacity
                onPress={() => {
                  setMapVisible(false);
                }}
                style={{ position: "absolute", left: 20, top: 20, zIndex: 2 }}
              >
                <MaterialIcon
                  name="arrow-back"
                  color={"white"}
                  size={25}
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
              <MapComponent
                locationMarker={branchLocation}
                setLocationMarker={setBranchLocation}
                region={mapRegion}
                setRegion={setMapRegion}
                setMapDisplayed={setMapVisible}
              />
            </View>
          </View>
        )}
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
    logo: {
      marginTop: "25%",
    },
    titleText: {
      marginTop: "5%",
      color: "white",
    },
    inputView: {
      marginTop: "10%",
      width: "80%",
      marginBottom: 20,
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
      flex: 1,
      paddingRight: 10,
      borderRadius: 5,
      fontSize: 14,
      color: "white",
      width: "100%",
      fontFamily: "Inter-Medium",
    },
    getStartedButton: {
      borderRadius: 6,
      marginTop: "7%",
      height: 50,
      justifyContent: "center",
      borderWidth: 1,
    },
    mapView: {
      marginTop: "10%",
      width: "100%",
      flexGrow: 1,
    },
  });
