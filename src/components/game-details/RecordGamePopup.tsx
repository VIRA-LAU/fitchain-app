import React, { useState, Dispatch, SetStateAction, Fragment } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { Button, Switch, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { TabBar, TabBarProps, TabView } from "react-native-tab-view";
import { useStartStopRecording, useUploadGameVideoMutation } from "src/api";
import { PopupType } from "./Popups";
import { Game } from "src/types";
import DropDownPicker from "react-native-dropdown-picker";
import { ResizeMode, Video } from "expo-av";
import { selectVideo } from "src/utils";
import { GalleryPermissionDialog } from "../modals";

export const RecordGamePopup = ({
  game,
  setPopupVisible,
}: {
  game?: Game;
  setPopupVisible: Dispatch<SetStateAction<PopupType | null>>;
}) => {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const styles = makeStyles(colors);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "Phone", title: "Phone" },
    { key: "Court", title: "Court" },
  ]);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [dropDownValue, setDropDownValue] = useState(null);
  const [dropDownItems, setDropDownItems] = useState([
    { label: "Camera 1", value: "Camera 1" },
    { label: "Camera 2", value: "Camera 2" },
  ]);
  const [uploadWhileRecording, setUploadWhileRecording] = useState(false);
  const [showModifiedVid, setShowModifiedVid] = useState(false);

  const { mutate: startStopRecording, isLoading: recordLoading } =
    useStartStopRecording(game?.id);

  const renderScene = () => {
    const route = routes[index];
    return route.key === "Phone" ? (
      <View
        style={{
          paddingHorizontal: 25,
          marginTop: 10,
        }}
      >
        <View style={styles.selectView}>
          <Text style={{ color: "white", fontFamily: "Poppins-Regular" }}>
            Upload While Recording
          </Text>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.tertiary }}
            thumbColor={uploadWhileRecording ? colors.primary : colors.tertiary}
            onValueChange={() => setUploadWhileRecording(!uploadWhileRecording)}
            value={uploadWhileRecording}
          />
        </View>

        <View style={styles.selectView}>
          <Text style={{ color: "white", fontFamily: "Poppins-Regular" }}>
            Show Modified Video
          </Text>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.tertiary }}
            thumbColor={showModifiedVid ? colors.primary : colors.tertiary}
            onValueChange={() => setShowModifiedVid(!showModifiedVid)}
            value={showModifiedVid}
          />
        </View>
      </View>
    ) : (
      <View style={{ paddingTop: 20 }}>
        <Text style={styles.promptText}>Select court camera.</Text>
        <View style={{ marginHorizontal: 20, marginBottom: "25%", zIndex: 3 }}>
          <DropDownPicker
            open={dropDownOpen}
            value={dropDownValue}
            items={dropDownItems}
            setOpen={setDropDownOpen}
            setValue={setDropDownValue}
            setItems={setDropDownItems}
            placeholder="Select Camera"
            style={{
              backgroundColor: colors.secondary,
              borderColor: "transparent",
            }}
            dropDownContainerStyle={{
              backgroundColor: colors.secondary,
              borderColor: "transparent",
            }}
            theme="DARK"
            textStyle={{ color: "white", fontFamily: "Poppins-Regular" }}
          />
        </View>
      </View>
    );
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      style={{
        backgroundColor: colors.secondary,
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 10,
      }}
      renderTabBarItem={({ route }) => {
        let isActive = route.key === props.navigationState.routes[index].key;
        return (
          <Pressable
            key={route.key}
            style={({ pressed }) => [
              styles.tabViewItem,
              {
                // 50% of (75% of screen width - margin (2x20) - margin (2x5) - ?)
                width: 0.5 * (windowWidth * 0.75 - 40 - 20),
                backgroundColor: isActive
                  ? colors.background
                  : colors.secondary,
              },
              pressed && { backgroundColor: colors.background },
            ]}
            onPress={() => {
              setIndex(routes.findIndex(({ key }) => route.key === key));
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                color: isActive ? "white" : colors.tertiary,
              }}
            >
              {route.title}
            </Text>
          </Pressable>
        );
      }}
      renderIndicator={() => <View style={{ width: 0 }} />}
    />
  );
  return (
    <ScrollView>
      <Text style={styles.promptText}>
        Which camera would you like to record from?
      </Text>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        swipeEnabled={false}
      />
      {!game?.isRecording ? (
        <Button
          mode="contained"
          style={{
            marginBottom: 10,
            marginHorizontal: 20,
          }}
          loading={recordLoading}
          onPress={
            !recordLoading
              ? () => {
                  startStopRecording({ recordingMode: "start" });
                }
              : undefined
          }
        >
          Start Recording
        </Button>
      ) : (
        <Button
          mode="contained"
          style={{
            marginBottom: 10,
            marginHorizontal: 20,
          }}
          loading={recordLoading}
          onPress={
            !recordLoading
              ? () => {
                  startStopRecording({ recordingMode: "stop" });
                }
              : undefined
          }
        >
          Stop Recording
        </Button>
      )}
      <Button
        style={{
          marginHorizontal: 20,
        }}
        onPress={() => setPopupVisible(null)}
      >
        Cancel
      </Button>
    </ScrollView>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    promptText: {
      fontFamily: "Poppins-Regular",
      textAlign: "center",
      color: "white",
      marginBottom: 10,
      marginHorizontal: 20,
      lineHeight: 20,
    },
    tabViewItem: {
      height: 40,
      margin: 5,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    selectView: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 7,
    },
  });

export const UploadVideoPopup = ({
  game,
  setPopupVisible,
}: {
  game?: Game;
  setPopupVisible: Dispatch<SetStateAction<PopupType | null>>;
}) => {
  const [tempVideoToUpload, setTempVideoToUpload] = useState<string>();
  const [permissionDialogVisible, setPermissionDialogVisible] =
    useState<boolean>(false);

  const { mutate: uploadGameVideo, isLoading: uploadLoading } =
    useUploadGameVideoMutation(game?.id);

  return (
    <Fragment>
      <View style={{ paddingBottom: 10, paddingHorizontal: 20 }}>
        <Button
          mode="contained"
          onPress={() => {
            selectVideo(setPermissionDialogVisible, setTempVideoToUpload);
          }}
        >
          Select Video
        </Button>
        {tempVideoToUpload && (
          <Video
            source={{
              uri: tempVideoToUpload ?? "",
            }}
            isLooping
            shouldPlay
            resizeMode={ResizeMode.COVER}
            style={{
              height: 235,
              marginVertical: 20,
            }}
          />
        )}
        {tempVideoToUpload && (
          <Button
            mode="contained"
            onPress={() => {
              const formData = new FormData();

              let fileName = tempVideoToUpload.split("/").pop();
              let match = /\.(\w+)$/.exec(fileName!);
              let type = match ? `video/${match[1]}` : `video`;

              formData.append(`video`, {
                uri: tempVideoToUpload,
                name: `${game?.id}.${match ? match[1] : ""}`,
                type,
              });

              uploadGameVideo(formData);
              setPopupVisible(null);
            }}
          >
            Upload Video
          </Button>
        )}
      </View>
      <GalleryPermissionDialog
        visible={permissionDialogVisible}
        setVisible={setPermissionDialogVisible}
      />
    </Fragment>
  );
};
