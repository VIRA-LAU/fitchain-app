import { StyleSheet, View, Image, ImageSourcePropType } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

export const CommunityPost = ({
  profileImage,
  image = false,
}: {
  profileImage: ImageSourcePropType;
  image?: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image style={styles.profilePicture} source={profileImage} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.title}>Name Last Name</Text>
            <Text style={styles.date}>18 Jul</Text>
          </View>
        </View>
        <Text style={styles.body}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged.
        </Text>
        {image && (
          <Image
            source={require("assets/images/home/community-sample-image.png")}
            style={{
              resizeMode: "contain",
              margin: -16,
              marginTop: 12,
            }}
          />
        )}
      </View>
      <View style={styles.interactions}>
        <Image
          source={require("assets/icons/heart-dark.png")}
          style={{
            width: 20,
            height: 20,
            resizeMode: "contain",
            marginRight: 24,
          }}
        />
        <Image
          source={require("assets/icons/comment-dark.png")}
          style={{
            width: 20,
            height: 20,
            resizeMode: "contain",
          }}
        />
      </View>
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    content: {
      padding: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    profilePicture: {
      height: 51,
      width: 51,
      borderRadius: 100,
      backgroundColor: "#979797",
    },
    title: {
      fontFamily: "Poppins-Bold",
      marginBottom: 4,
      color: colors.tertiary,
    },
    date: {
      fontFamily: "Poppins-Regular",
      fontSize: 12,
      color: "#979797",
    },
    body: {
      fontFamily: "Poppins-Regular",
      fontSize: 12,
      color: colors.tertiary,
    },
    interactions: {
      flexDirection: "row",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.secondary,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
  });
