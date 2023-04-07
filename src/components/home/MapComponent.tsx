import React, { useState, Dispatch, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { LatLng, Marker, Region } from "react-native-maps";
import { Button, useTheme } from "react-native-paper";

export const MapComponent = ({
  locationMarker,
  setLocationMarker,
  region,
  setRegion,
  setMapDisplayed,
}: {
  locationMarker: LatLng | undefined;
  setLocationMarker: Dispatch<React.SetStateAction<LatLng | undefined>>;
  region: Region;
  setRegion: Dispatch<React.SetStateAction<Region>>;
  setMapDisplayed: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();

  const mapRef = useRef<MapView | null>(null);
  const [tempLocationMarker, setTempLocationMarker] = useState<
    LatLng | undefined
  >(locationMarker);

  return (
    <View style={{ flex: 1, margin: 10, borderRadius: 10, overflow: "hidden" }}>
      <MapView
        style={{ flex: 1 }}
        ref={mapRef}
        initialRegion={region}
        onRegionChangeComplete={(region) => setRegion(region)}
        showsUserLocation
        toolbarEnabled={false}
        userInterfaceStyle="dark"
        onPress={(e) => {
          setTempLocationMarker(e.nativeEvent.coordinate);
        }}
      >
        {tempLocationMarker && (
          <Marker title="Location" coordinate={tempLocationMarker} />
        )}
      </MapView>
      {locationMarker &&
        tempLocationMarker &&
        JSON.stringify(tempLocationMarker) !==
          JSON.stringify(locationMarker) && (
          <Button
            textColor={colors.background}
            buttonColor={colors.primary}
            style={styles.confirmButton}
            onPress={() => {
              setLocationMarker(tempLocationMarker);
              setMapDisplayed(false);
            }}
          >
            Confirm
          </Button>
        )}
    </View>
  );
};

export const MiniMapComponent = ({
  locationMarker,
}: {
  locationMarker: LatLng;
}) => {
  return (
    <View style={{ flex: 1, borderRadius: 10, overflow: "hidden" }}>
      <MapView
        style={{ flex: 1 }}
        // initialRegion={region}
        toolbarEnabled={false}
        userInterfaceStyle="dark"
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        region={{
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
          latitude: locationMarker.latitude + 0.001,
          longitude: locationMarker.longitude - 0.011,
        }}
      >
        <Marker title="Location" coordinate={locationMarker} tappable={false} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
