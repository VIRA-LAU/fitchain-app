import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface SkeletonProps {
  width?: string | number;
  height?: number;
  style?: any;
}

export const Skeleton = ({ width, height, style }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          useNativeDriver: true,
          duration: 800,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { opacity: opacity.current, height, width },
        styles.skeleton,
        style,
      ]}
    ></Animated.View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "grey",
  },
});
