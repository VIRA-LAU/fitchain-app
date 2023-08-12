import { useQuery } from "react-query";
import { Activity } from "src/types";
import client from "../../client";

const getActivities = (userId?: number) => async () => {
  if (userId)
    return await client
      .get(`/games/activities/${userId}`)
      .then((res) => res?.data)
      .catch((e) => {
        console.error("activities-query", e);
        throw e;
      });
};

export const useActivitiesQuery = (userId?: number) => {
  return useQuery<Activity[]>(["activities", userId], getActivities(userId), {
    select: (activities) =>
      activities
        .map((activity) => ({
          ...activity,
          startTime: new Date(activity.startTime),
          endTime: new Date(activity.endTime),
        }))
        .sort((a, b) => b.endTime.getTime() - a.endTime.getTime()),
  });
};
