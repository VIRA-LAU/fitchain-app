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
    <View style={{ flexGrow: 1, borderRadius: 10, overflow: "hidden" }}>
      <MapView
        style={{ flex: 1 }}
        ref={mapRef}
        initialRegion={region}
        onRegionChangeComplete={(region) => setRegion(region)}
        showsUserLocation
        toolbarEnabled={false}
        userInterfaceStyle="dark"
        customMapStyle={customMapStyle}
        onPress={async (e) => {
          setTempLocationMarker(e.nativeEvent.coordinate);
        }}
        onPoiClick={async (e) => {
          setTempLocationMarker(e.nativeEvent.coordinate);
        }}
      >
        {tempLocationMarker && (
          <Marker coordinate={tempLocationMarker} tappable={false} />
        )}
      </MapView>
      {tempLocationMarker &&
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
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
      />
      <MapView
        style={{ flex: 1 }}
        // initialRegion={region}
        toolbarEnabled={false}
        userInterfaceStyle="dark"
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomTapEnabled={false}
        customMapStyle={customMapStyle}
        region={{
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
          latitude: locationMarker.latitude + 0.001,
          longitude: locationMarker.longitude - 0.0105,
        }}
      >
        <Marker coordinate={locationMarker} tappable={false} />
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

const customMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2e2d36",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];
