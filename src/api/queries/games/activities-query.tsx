import { useContext } from "react";
import { useQuery } from "react-query";
import { Activity } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getActivities = (userData: UserData, userId?: number) => async () => {
  const header = getHeader(userData);
  if (userId)
    return await client
      .get(`/games/activities/${userId}`, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("activities-query", e);
        throw new Error(e);
      });
};

export const useActivitiesQuery = (userId?: number) => {
  const { userData } = useContext(UserContext);
  return useQuery<Activity[]>(
    ["activities", userId],
    getActivities(userData!, userId)
  );
};
