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
import { useRef, useEffect } from "react";
import { useState } from "react";
import { useCreateBranchMutation, useLocationNameQuery } from "src/api";
import { LatLng, Region } from "react-native-maps";
import * as Location from "expo-location";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

type Props = StackScreenProps<SignUpStackParamList, "SignUpAsBranch">;

export const SignUpAsBranch = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [venueName, setVenueName] = useState("");
  const [managerFullName, setManagerFullName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [branchLocation, setBranchLocation] = useState<LatLng>();
  const [locationDescription, setLocationDescription] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 33.895462996463095,
    longitude: 35.5006168037653,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const {
    mutate: createBranch,
    isLoading: createBranchLoading,
    error,
  } = useCreateBranchMutation();
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

  const validateEmail = (email: string) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  };

  const signUp = () => {
    if (
      checkPasswordValidity(password) &&
      locationDescription.length > 0 &&
      branchLocation &&
      validateEmail(email) &&
      venueName.trim().length > 0 &&
      managerFullName.length > 0
    ) {
      let data = {
        venueName: venueName.trim(),
        managerFirstName:
          managerFullName
            .trim()
            .substring(0, managerFullName.trim().indexOf(" ")) ||
          managerFullName.trim(),
        managerLastName: managerFullName
          .trim()
          .substring(managerFullName.trim().indexOf(" ") + 1),
        email,
        description: description.trim(),
        password,
        location: locationDescription,
        latitude: branchLocation.latitude,
        longitude: branchLocation.longitude,
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

  const scrollOffset = 60;
  const scrollRef: React.MutableRefObject<ScrollView | null> = useRef(null);
  const fullNameRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const emailRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const descriptionRef: React.MutableRefObject<TextInput | null> = useRef(null);
  const passwordRef: React.MutableRefObject<TextInput | null> = useRef(null);

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
          Sign Up
        </Text>
        <Text variant="labelLarge" style={styles.text}>
          Fill in your details and you are 1 step away!
        </Text>

        {!mapVisible ? (
          <View style={{ flexGrow: 1, width: "87%", marginTop: 24 }}>
            <Text style={{ fontFamily: "Poppins-Regular" }}>Venue Name</Text>
            <TextInput
              value={venueName}
              style={styles.textInput}
              selectionColor={colors.primary}
              onSubmitEditing={() => {
                fullNameRef.current?.focus();
                scrollRef.current?.scrollTo({
                  y: scrollPosition + scrollOffset,
                  animated: true,
                });
              }}
              blurOnSubmit={false}
              onChangeText={(text) => {
                setVenueName(text);
                setErrorMessage("");
              }}
            />

            <Text style={{ fontFamily: "Poppins-Regular", marginTop: 4 }}>
              Manager Full Name
            </Text>
            <TextInput
              value={managerFullName}
              style={styles.textInput}
              selectionColor={colors.primary}
              onSubmitEditing={() => {
                emailRef.current?.focus();
                scrollRef.current?.scrollTo({
                  y: scrollPosition + scrollOffset,
                  animated: true,
                });
              }}
              blurOnSubmit={false}
              ref={fullNameRef}
              onChangeText={(text) => {
                setManagerFullName(text);
                setErrorMessage("");
              }}
            />

            <Text style={{ fontFamily: "Poppins-Regular", marginTop: 4 }}>
              Email
            </Text>
            <TextInput
              value={email}
              style={styles.textInput}
              selectionColor={colors.primary}
              textContentType="emailAddress"
              autoCapitalize="none"
              onSubmitEditing={() => {
                descriptionRef.current?.focus();
                scrollRef.current?.scrollTo({
                  y: scrollPosition + scrollOffset,
                  animated: true,
                });
              }}
              blurOnSubmit={false}
              ref={emailRef}
              onChangeText={(text) => {
                setEmail(text.trim());
                setErrorMessage("");
              }}
            />

            <Text style={{ fontFamily: "Poppins-Regular", marginTop: 4 }}>
              Branch Description (Optional)
            </Text>
            <TextInput
              value={description}
              style={styles.textInput}
              selectionColor={colors.primary}
              onSubmitEditing={() => {
                passwordRef.current?.focus();
                scrollRef.current?.scrollTo({
                  y: scrollPosition + scrollOffset,
                  animated: true,
                });
              }}
              blurOnSubmit={false}
              ref={descriptionRef}
              onChangeText={(text) => {
                setDescription(text);
                setErrorMessage("");
              }}
            />

            <Text style={{ fontFamily: "Poppins-Regular", marginTop: 4 }}>
              Password
            </Text>
            <TextInput
              value={password}
              style={styles.textInput}
              selectionColor={colors.primary}
              secureTextEntry={true}
              ref={passwordRef}
              onChangeText={(password) => {
                checkPasswordValidity(password.trim());
              }}
            />

            <Button
              icon={"map-marker-outline"}
              style={{ marginTop: "7%" }}
              onPress={() => {
                setErrorMessage("");
                setMapVisible(true);
              }}
            >
              Set Branch Location
            </Button>
            {locationNameLoading ? (
              <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
              <View>
                <Text style={{ fontFamily: "Poppins-Regular", marginTop: 4 }}>
                  Location Name
                </Text>
                <TextInput
                  style={styles.textInput}
                  selectionColor={colors.primary}
                  value={locationDescription ?? autoLocationDescription}
                  onChangeText={(text) => {
                    setLocationDescription(text.trim());
                    scrollRef.current?.scrollToEnd({
                      animated: true,
                    });
                  }}
                  onFocus={() => {
                    scrollRef.current?.scrollToEnd({
                      animated: true,
                    });
                  }}
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
                  fontFamily: "Poppins-Bold",
                }}
              >
                {errorMessage}
              </Text>
            )}

            <View style={{ marginTop: "auto" }}>
              <Button
                mode="contained"
                style={{ marginTop: 20, height: 44, justifyContent: "center" }}
                loading={createBranchLoading}
                onPress={!createBranchLoading ? () => signUp() : undefined}
              >
                Sign Up
              </Button>

              <View
                style={{
                  marginTop: 24,
                  marginBottom: 64,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => navigation.goBack()}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      textAlign: "center",
                    }}
                  >
                    Already have an account?{" "}
                    <Text style={{ color: colors.primary }}>Sign in</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.mapView}>
            <Text
              variant="labelLarge"
              style={[styles.text, { marginBottom: 20 }]}
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
                  color={colors.tertiary}
                  size={25}
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
    getStartedButton: {
      marginTop: "7%",
      justifyContent: "center",
      borderWidth: 1,
    },
    mapView: {
      marginTop: "10%",
      width: "100%",
      flexGrow: 1,
      marginBottom: "-5%",
    },
  });
