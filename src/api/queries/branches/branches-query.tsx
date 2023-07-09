import { useQuery } from "react-query";
import { Branch } from "src/types";
import client from "../../client";

const getBranches = (venueId?: number) => async () => {
  const endpoint = venueId ? `/branches?venueId=${venueId}` : "/branches";
  return await client
    .get(endpoint)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("branches-query", e);
      throw new Error(e);
    });
};

export const useBranchesQuery = (venueId?: number) => {
  return useQuery<Branch[]>(["branches", venueId], getBranches(venueId));
};
