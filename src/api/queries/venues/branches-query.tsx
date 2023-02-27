import { useQuery } from "react-query";
import { UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getBranches = (userData: UserData) => async () => {
  const header = getHeader(userData);
  return await client
    .get(`/branches`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("branches-query", e);
      throw new Error(e);
    });
};

export const useBranchesQuery = (userData: UserData) =>
  useQuery(["branches"], getBranches(userData));
