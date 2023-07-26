import { useState, useEffect } from "react";
import { Platform, Alert } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export var notificationsToken: string | undefined = undefined;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
    notificationsToken = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#f29c1f",
    });
  }
};

export const NotificationService = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [notification, setNotification] = useState<
    Notifications.Notification | false
  >(false);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  return children;
};
