import React, { useState, Dispatch, SetStateAction } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import {
  Button,
  Switch,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { TabBar, TabView } from "react-native-tab-view";
import { useStartStopRecording } from "src/api";
import { Game } from "src/types";
import DropDownPicker from "react-native-dropdown-picker";
import { ModalContainer } from "./ModalContainer";

export const RecordGameModal = ({
  game,
  visible,
  setVisible,
}: {
  game?: Game;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();
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
          <Text
            style={{ color: colors.tertiary, fontFamily: "Poppins-Regular" }}
          >
            Upload While Recording
          </Text>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.secondary }}
            thumbColor={
              uploadWhileRecording ? colors.primary : colors.secondary
            }
            onValueChange={() => setUploadWhileRecording(!uploadWhileRecording)}
            value={uploadWhileRecording}
          />
        </View>

        <View style={styles.selectView}>
          <Text
            style={{ color: colors.tertiary, fontFamily: "Poppins-Regular" }}
          >
            Show Modified Video
          </Text>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.secondary }}
            thumbColor={showModifiedVid ? colors.primary : colors.secondary}
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
            textStyle={{
              color: colors.tertiary,
              fontFamily: "Poppins-Regular",
            }}
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
        elevation: 0,
      }}
      contentContainerStyle={{ gap: 6 }}
      renderTabBarItem={({ route }) => {
        let isActive = route.key === props.navigationState.routes[index].key;
        return (
          <TouchableRipple
            key={route.key}
            borderless
            style={{ borderRadius: 10 }}
            onPress={() => {
              setIndex(routes.findIndex(({ key }) => route.key === key));
            }}
          >
            <View
              style={[
                styles.tabViewItem,
                {
                  // 50% of (75% of screen width - margin (2x20) - margin (2x5) - ?)
                  width: 0.5 * (Dimensions.get("screen").width - 100 - 32 - 6),
                  backgroundColor: isActive ? colors.primary : colors.secondary,
                },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  color: isActive ? "white" : colors.tertiary,
                }}
              >
                {route.title}
              </Text>
            </View>
          </TouchableRipple>
        );
      }}
      renderIndicator={() => <View style={{ width: 0 }} />}
    />
  );
  return (
    <ModalContainer title="" visible={visible} setVisible={setVisible}>
      <ScrollView>
        <Text style={styles.promptText}>
          Which camera would you like to record from?
        </Text>
        <View style={{ height: 180 }}>
          <TabView
            navigationState={{ index, routes }}
            renderTabBar={renderTabBar}
            renderScene={renderScene}
            onIndexChange={setIndex}
            swipeEnabled={false}
          />
        </View>
        {!game?.isRecording ? (
          <Button
            mode="contained"
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
            marginTop: 8,
          }}
          onPress={() => setVisible(false)}
        >
          Cancel
        </Button>
      </ScrollView>
    </ModalContainer>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    promptText: {
      fontFamily: "Poppins-Regular",
      textAlign: "center",
      color: colors.tertiary,
      marginBottom: 10,
      marginHorizontal: 20,
      lineHeight: 20,
    },
    tabViewItem: {
      height: 40,
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
