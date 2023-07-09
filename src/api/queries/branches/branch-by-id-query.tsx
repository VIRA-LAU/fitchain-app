import { useQuery } from "react-query";
import { Branch } from "src/types";
import client from "../../client";

const getBranchById = (id?: number) => async () => {
  return await client
    .get(`/branches/${id}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("branch-by-id-query", e);
      throw new Error(e);
    });
};

export const useBranchByIdQuery = (id?: number) => {
  return useQuery<Branch>(["branch-by-id", id], getBranchById(id));
};
