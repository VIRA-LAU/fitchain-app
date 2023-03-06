import { useContext } from "react";
import { useQuery } from "react-query";
import { VenueBranch } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getBranches = (userData: UserData, venueId?: number) => async () => {
  const header = getHeader(userData);
  const endpoint = venueId ? `/branches?venueId=${venueId}` : "/branches";
  return await client
    .get(endpoint, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("branches-query", e);
      throw new Error(e);
    });
};

export const useBranchesQuery = (venueId?: number) => {
  const { userData } = useContext(UserContext);
  return useQuery<VenueBranch[]>(["branches"], getBranches(userData!, venueId));
};
