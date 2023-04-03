import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { View, StyleSheet } from "react-native";
import { useState } from "react";
import FeatherIcon from "react-native-vector-icons/Feather";

export const RateCriteria = ({
  name,
  onRatingChange,
}: {
  name: string;
  onRatingChange: Function;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [score, setScore] = useState(3);

  const increaseScore = () => {
    if (score < 5) {
      onRatingChange(name, score + 0.5);
      setScore((prevScore) => prevScore + 0.5);
    }
  };

  const decreaseScore = () => {
    if (score > 0) {
      onRatingChange(name, score - 0.5);
      setScore((prevScore) => prevScore - 0.5);
    }
  };

  return (
    <View style={styles.wrapperView}>
      <Text variant="titleSmall" style={styles.name}>
        {name}
      </Text>
      <View style={styles.scoreWrapper}>
        <FeatherIcon
          name={`minus-circle`}
          color={colors.primary}
          size={26}
          onPress={decreaseScore}
        />
        <Text variant="titleLarge" style={styles.score}>
          {score % 1 !== 0 ? score.toFixed(1) : score}/5
        </Text>
        <FeatherIcon
          name={`plus-circle`}
          color={colors.primary}
          size={26}
          onPress={increaseScore}
        />
      </View>
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      borderRadius: 10,
      backgroundColor: colors.secondary,
      height: 60,
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      marginVertical: 5,
    },
    name: {
      color: colors.tertiary,
    },
    scoreWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: "auto",
    },
    score: {
      width: 85,
      color: "white",
      textAlign: "center",
    },
  });
