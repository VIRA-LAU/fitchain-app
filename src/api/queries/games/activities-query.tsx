import { useQuery } from "react-query";
import client from "../../client";

const getActivities = (userId: number) => async () => {
  return await client
    .get(`/games/activities?userId=${userId}`)
    .then((res) => res.data)
    .catch((e) => {
      console.error("activities-query", e);
      throw new Error(e);
    });
};

export const useActivitiesQuery = (userId: number) =>
  useQuery(["activities", userId], getActivities(userId));
