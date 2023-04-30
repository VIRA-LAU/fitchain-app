import { useContext } from "react";
import { useQuery } from "react-query";
import { Court } from "src/types";
import { UserContext, VenueData } from "src/utils";
import client, { getHeader } from "../../client";

const getCourtsInBranch =
  (userData: VenueData, branchId?: number) => async () => {
    const header = getHeader(userData);
    return await client
      .get(`/courts?branchId=${branchId}`, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("branches-query", e);
        throw new Error(e);
      });
  };

export const useCourtsInBranchQuery = (branchId?: number) => {
  const { venueData } = useContext(UserContext);
  return useQuery<Court[]>(
    ["courts-in-branch", branchId],
    getCourtsInBranch(venueData!, branchId)
  );
};
