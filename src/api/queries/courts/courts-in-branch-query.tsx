import { useQuery } from "react-query";
import { Court } from "src/types";
import client from "../../client";

const getCourtsInBranch = (branchId?: number) => async () => {
  return await client
    .get(`/courts?branchId=${branchId}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("branches-query", e);
      throw new Error(e);
    });
};

export const useCourtsInBranchQuery = (branchId?: number) => {
  return useQuery<Court[]>(
    ["courts-in-branch", branchId],
    getCourtsInBranch(branchId)
  );
};
