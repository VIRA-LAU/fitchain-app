import { StackScreenProps } from "@react-navigation/stack";
import { useMemo } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useInvitationsQuery, useReceivedRequestsQuery } from "src/api";
import { AppHeader, Notification } from "src/components";
import { HomeStackParamList } from "src/navigation";
import { GameRequest, Invitation } from "src/types";

type Props = StackScreenProps<HomeStackParamList, "Notifications">;

export const Notifications = ({ navigation, route }: Props) => {
  const { colors } = useTheme();

  const {
    data: invitations,
    isFetching: invitationsLoading,
    refetch: refetchInvitations,
  } = useInvitationsQuery();
  const {
    data: receivedRequests,
    isFetching: requestsLoading,
    refetch: refetchRequests,
  } = useReceivedRequestsQuery();

  const invitationsRequests = useMemo(() => {
    let result: ((Invitation | GameRequest) & {
      type: "invitation" | "request";
    })[] = [];

    if (invitations)
      result = result.concat(
        invitations.map((invitation) => ({ type: "invitation", ...invitation }))
      );
    if (receivedRequests)
      result = result.concat(
        receivedRequests.map((request) => ({ type: "request", ...request }))
      );

    const sortedResult = result.sort(
      (a, b) => a.game.createdAt.getTime() - b.game.createdAt.getTime()
    );

    return sortedResult;
  }, [JSON.stringify(invitations), JSON.stringify(receivedRequests)]);

  return (
    <AppHeader absolutePosition={false} title={"Notifications"} backEnabled>
      {invitationsRequests && invitationsRequests.length > 0 && (
        <Text
          style={{
            fontFamily: "Poppins-Bold",
            color: colors.tertiary,
            marginLeft: 16,
            marginTop: 12,
          }}
        >
          New
        </Text>
      )}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={invitationsLoading || requestsLoading}
            onRefresh={() => {
              refetchInvitations();
              refetchRequests();
            }}
            colors={[colors.primary]}
            progressBackgroundColor={colors.secondary}
          />
        }
        contentContainerStyle={
          invitationsRequests && invitationsRequests.length === 0
            ? { justifyContent: "center", flexGrow: 1 }
            : {}
        }
      >
        {invitationsRequests?.map((invReq, index) => (
          <Notification
            key={index}
            type={invReq.type}
            user={invReq.user?.firstName + " " + invReq.user?.lastName}
            game={invReq.game}
            isLast={index === invitationsRequests.length - 1}
            profilePhotoUrl={invReq.user?.profilePhotoUrl}
          />
        ))}
        {invitationsRequests && invitationsRequests.length === 0 && (
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              color: colors.tertiary,
              textAlign: "center",
            }}
          >
            You have no new notifications.
          </Text>
        )}
      </ScrollView>
    </AppHeader>
  );
};
