import client from "../../client";
import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/utils";
import { Branch, User } from "src/types";
import { storeData } from "src/utils/AsyncStorage";

type Request = {
  email: string;
  password: string;
};

type UserRes = User & {
  userId: number;
  access_token: string;
};
type BranchRes = Branch & {
  branchId: number;
  venueName: string;
  branchLocation: string;
  access_token: string;
};
type Response = (UserRes | BranchRes) & { isVenue: boolean };

const LoginUser = async (data: Request) => {
  return await client.post("/auth/signin", data).then((res) => res.data);
};

export const useLoginUserMutation = (
  setSignedIn: React.Dispatch<React.SetStateAction<"player" | "venue" | null>>
) => {
  const { setUserData, setIsVenue, setVenueData } = useContext(UserContext);
  return useMutation<Response, unknown, Request>({
    mutationFn: LoginUser,
    onSuccess: async (data) => {
      if (data.isVenue) {
        let fetchedInfo = {
          branchId: (data as BranchRes).branchId,
          venueName: (data as BranchRes).venueName,
          branchLocation: (data as BranchRes).branchLocation,
          managerFirstName: (data as BranchRes).managerFirstName,
          managerLastName: (data as BranchRes).managerLastName,
          managerEmail: (data as BranchRes).managerEmail,
          token: (data as BranchRes).access_token,
        };
        setIsVenue(true);
        setVenueData(fetchedInfo);
        const keys = [
          "isVenue",
          "branchId",
          "venueName",
          "branchLocation",
          "managerFirstName",
          "managerLastName",
          "managerEmail",
          "token",
        ];
        const values = [
          true,
          (data as BranchRes).branchId,
          (data as BranchRes).venueName,
          (data as BranchRes).branchLocation,
          (data as BranchRes).managerFirstName,
          (data as BranchRes).managerLastName,
          (data as BranchRes).managerEmail,
          (data as BranchRes).access_token,
        ];
        storeData(keys, values);
        setSignedIn("venue");
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
          "isVenue",
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
        setSignedIn("player");
      }
    },
  });
};
