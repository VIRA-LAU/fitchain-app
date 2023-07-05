import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, VenueData } from "../../../utils/UserContext";
import { Branch } from "src/types";
import { useContext } from "react";

type Request =
  | {
      description?: string;
    }
  | FormData;

const updateBranch = (venueData: VenueData) => async (data: Request) => {
  const authHeader = getHeader(venueData);
  const headers = {
    ...authHeader.headers,
    "Content-Type":
      data instanceof FormData ? "multipart/form-data" : "application/json",
  };
  return await client
    .patch("/branches", data, {
      headers,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("update-user-mutation", e);
      throw new Error(e);
    });
};

export const useUpdateBranchMutation = () => {
  const { venueData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<Branch, unknown, Request>({
    mutationFn: updateBranch(venueData!),
    onSuccess: () => {
      queryClient.refetchQueries(["branch-by-id", venueData?.branchId]);
    },
    retry: 4,
  });
};
