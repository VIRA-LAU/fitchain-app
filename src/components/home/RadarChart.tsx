import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import Svg, { Circle, Polygon, Text } from "react-native-svg";

const degToRadians = (deg: number) => (deg * Math.PI) / 180;

type Point = [number, number];

const svgY = (degrees: number) => degrees + 180;

const calculateEdgePointFn =
  (center: number, radius: number) =>
  (degree: number, scale: number = 1): Point => {
    const degreeInRadians = degToRadians(degree);
    const degreeInRadiansY = degToRadians(svgY(degree));
    return [
      center + Math.cos(degreeInRadians) * radius * scale,
      center + Math.sin(degreeInRadiansY) * radius * scale,
    ];
  };

const offsets = [
  [10, -5],
  [20, -5],
  [-55, -5],
  [-45, -5],
  [-60, 10],
  [15, 10],
];

export const RadarChart = ({
  size,
  radarData,
}: {
  size: number;
  radarData: {
    value: number;
    label: string;
  }[];
}) => {
  const { colors } = useTheme();
  const viewBoxSize = size;
  const viewBoxCenter = viewBoxSize * 0.5;
  const radius = viewBoxSize * 0.4;

  const calculateEdgePoint = useMemo(
    () => calculateEdgePointFn(viewBoxCenter, radius),
    [radius]
  );

  return (
    <Svg
      height="100%"
      width="100%"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
    >
      <Polygon
        stroke={colors.tertiary}
        strokeWidth={0.5}
        points={`${radarData.map((r, i) => {
          const edgePoint = calculateEdgePoint(i * 60, 1);
          return `${edgePoint[0]},${edgePoint[1]}`;
        })}`}
      />

      <Polygon
        fill={colors.primary}
        points={`${radarData.map((r, i) => {
          const edgePoint = calculateEdgePoint(i * 60, r.value / 100);
          return `${edgePoint[0]},${edgePoint[1]}`;
        })}`}
      />

      {radarData.map((r, i) => {
        const edgePoint = calculateEdgePoint(i * 60, 1);
        return (
          <Text
            key={i}
            x={edgePoint[0] + offsets[i][0]}
            y={edgePoint[1] + offsets[i][1]}
            fill={colors.tertiary}
            fontSize={10}
          >
            {r.label}
          </Text>
        );
      })}

      {radarData.map((r, i) => {
        const edgePoint = calculateEdgePoint(i * 60, 1);
        return (
          <Text
            key={i}
            x={edgePoint[0] + offsets[i][0]}
            y={edgePoint[1] + offsets[i][1] + 15}
            fill={colors.primary}
            fontWeight={"bold"}
            fontSize={14}
          >
            {r.value}
          </Text>
        );
      })}
    </Svg>
  );
};
