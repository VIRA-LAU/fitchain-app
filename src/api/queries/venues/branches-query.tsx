import { useQuery } from "react-query";
import { useAxios } from "../../client";

const getBranches = () => async () => {
  const client = useAxios();
  return await client
    .get(`/branches`)
    .then((res) => res.data)
    .catch((e) => {
      console.error("branches-query", e);
      throw new Error(e);
    });
};

export const useBranchesQuery = () => useQuery(["branches"], getBranches());
