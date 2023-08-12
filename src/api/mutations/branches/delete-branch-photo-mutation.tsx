import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../../utils/UserContext";
import { useContext } from "react";

const deleteBranchPhoto = async (photoName: string) => {
  return await client
    .delete(`/branches/photo/${photoName}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("delete-branch-photo-mutation", e?.response.data);
      throw e;
    });
};

export const useDeleteBranchPhotoMutation = () => {
  const { branchData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, string>({
    mutationFn: deleteBranchPhoto,
    onSuccess: () => {
      queryClient.refetchQueries(["branch-by-id", branchData?.branchId]);
    },
  });
};
