import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../../utils/UserContext";
import { Branch } from "src/types";
import { useContext } from "react";

type Request =
  | {
      description?: string;
    }
  | FormData;

const updateBranch = async (data: Request) => {
  const headers = {
    "Content-Type":
      data instanceof FormData ? "multipart/form-data" : "application/json",
  };
  return await client
    .patch("/branches", data, {
      headers,
    })
    .then((res) => res?.data)
    .catch((e) => {
      console.error("update-branch-mutation", e?.response.data);
      throw e;
    });
};

export const useUpdateBranchMutation = () => {
  const { branchData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<Branch, unknown, Request>({
    mutationFn: updateBranch,
    onSuccess: () => {
      queryClient.refetchQueries(["branch-by-id", branchData?.branchId]);
    },
    retry: 4,
  });
};
