import { Dispatch, SetStateAction, createContext } from "react";

export type VenueData = {
  branchId: number;
  venueId: number;
  venueName: string;
  branchLocation: string;
  managerFirstName: string;
  managerLastName: string;
  managerEmail: string;
  token: string;
};

export type UserData = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
};

export type ContextProps = {
  readonly isVenue: boolean;
  readonly setIsVenue: Dispatch<SetStateAction<boolean>>;
  readonly userData: UserData | null;
  readonly setUserData: Dispatch<SetStateAction<UserData | null>>;
  readonly venueData: VenueData | null;
  readonly setVenueData: Dispatch<SetStateAction<VenueData | null>>;
};

export const UserContext = createContext<ContextProps>({
  isVenue: false,
  setIsVenue: () => {},
  userData: null,
  setUserData: () => {},
  venueData: null,
  setVenueData: () => {},
});
