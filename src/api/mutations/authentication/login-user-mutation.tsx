import client from "../../client";
import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/utils";
import { User, Venue } from "src/types";
import { storeData } from "src/utils/AsyncStorage";

type Request = {
  email: string;
  password: string;
};

type UserRes = User & {
  userId: number;
  access_token: string;
};
type VenueRes = Venue & {
  venueId: number;
  access_token: string;
};
type Response = (UserRes | VenueRes) & { isVenue: boolean };

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
          venueId: (data as VenueRes).venueId,
          venueName: (data as VenueRes).name,
          managerFirstName: (data as VenueRes).managerFirstName,
          managerLastName: (data as VenueRes).managerLastName,
          managerEmail: (data as VenueRes).managerEmail,
          token: (data as VenueRes).access_token,
        };
        setIsVenue(true);
        setVenueData(fetchedInfo);
        const keys = [
          "isVenue",
          "venueId",
          "venueName",
          "managerFirstName",
          "managerLastName",
          "managerEmail",
          "token",
        ];
        const values = [
          true,
          (data as VenueRes).venueId,
          (data as VenueRes).name,
          (data as VenueRes).managerFirstName,
          (data as VenueRes).managerLastName,
          (data as VenueRes).managerEmail,
          (data as VenueRes).access_token,
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
