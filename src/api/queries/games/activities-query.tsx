import { useQuery } from "react-query";
import { Activity } from "src/types";
import { UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getActivities = (userData: UserData) => async () => {
  const header = getHeader(userData);

  return await client
    .get(`/games/activities`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("activities-query", e);
      throw new Error(e);
    });
};

export const useActivitiesQuery = (userData: UserData) =>
  useQuery<Activity[]>(["activities"], getActivities(userData));
