import client from "../../client";
import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext, storeData } from "src/utils";
import { Branch, User } from "src/types";
import { AxiosError } from "axios";
import { getExpoPushTokenAsync } from "expo-notifications";

type Request = {
  email: string;
  password: string;
  notificationsToken: string | undefined;
};

type UserRes = User & {
  userId: number;
  access_token: string;
};
type BranchRes = Branch & {
  branchId: number;
  venueId: number;
  venueName: string;
  branchLocation: string;
  access_token: string;
};
type Response = (UserRes | BranchRes) & { isBranch: boolean };

const LoginUser = async (data: Request) => {
  return await client
    .post("/auth/signin", data)
    .then((res) => res?.data)
    .catch((error) => {
      console.error("login-mutation", error?.response?.data);
      throw error;
    });
};

export const useLoginUserMutation = () => {
  const { setUserData, setBranchData } = useContext(UserContext);
  return useMutation<
    Response,
    AxiosError<{
      message: string;
      userId?: number;
      isBranch?: boolean;
    }>,
    Request
  >({
    mutationFn: LoginUser,
    onSuccess: async (data) => {
      if (data.isBranch) {
        let fetchedInfo = {
          branchId: (data as BranchRes).branchId,
          venueId: (data as BranchRes).venueId,
          venueName: (data as BranchRes).venueName,
          branchLocation: (data as BranchRes).branchLocation,
          managerFirstName: (data as BranchRes).managerFirstName,
          managerLastName: (data as BranchRes).managerLastName,
          email: (data as BranchRes).email,
          token: (data as BranchRes).access_token,
        };
        setBranchData(fetchedInfo);
        const keys = [
          "isBranch",
          "branchId",
          "venueId",
          "venueName",
          "branchLocation",
          "managerFirstName",
          "managerLastName",
          "email",
          "token",
        ];
        const values = [
          true,
          (data as BranchRes).branchId,
          (data as BranchRes).venueId,
          (data as BranchRes).venueName,
          (data as BranchRes).branchLocation,
          (data as BranchRes).managerFirstName,
          (data as BranchRes).managerLastName,
          (data as BranchRes).email,
          (data as BranchRes).access_token,
        ];
        storeData(keys, values);
      } else {
        let fetchedInfo = {
          userId: (data as UserRes).userId,
          firstName: (data as UserRes).firstName,
          lastName: (data as UserRes).lastName,
          email: (data as UserRes).email,
          token: (data as UserRes).access_token,
        };
        setUserData(fetchedInfo);
        const keys = [
          "isBranch",
          "userId",
          "firstName",
          "lastName",
          "email",
          "token",
        ];
        const values = [
          false,
          (data as UserRes).userId,
          (data as UserRes).firstName,
          (data as UserRes).lastName,
          (data as UserRes).email,
          (data as UserRes).access_token,
        ];
        storeData(keys, values);
      }
    },
    onMutate: async (variables) => {
      const notificationsToken = (await getExpoPushTokenAsync()).data;
      if (notificationsToken) variables.notificationsToken = notificationsToken;
    },
  });
};
