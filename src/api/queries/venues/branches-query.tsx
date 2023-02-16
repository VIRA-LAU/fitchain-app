import { useQuery } from "react-query";
import client from "../../client";

const getBranches = () => async () => {
  return await client
    .get(`/branches`)
    .then((res) => res.data)
    .catch((e) => {
      console.error("branches-query", e);
      throw new Error(e);
    });
};

export const useBranchesQuery = () => useQuery(["branches"], getBranches());
