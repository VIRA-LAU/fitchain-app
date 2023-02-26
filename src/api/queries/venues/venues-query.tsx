import { useQuery } from "react-query";
import { UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getVenues = (userData: UserData) => async () => {
  const header = getHeader(userData);
  return await client
    .get(`/venues`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("get-venues-query", e);
      throw new Error(e);
    });
};
export default getVenues;
export const useVenuesQuery = (userData: UserData) =>
  useQuery(["Venues"], getVenues(userData));
