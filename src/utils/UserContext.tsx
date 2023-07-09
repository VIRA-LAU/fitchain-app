import { Dispatch, SetStateAction, createContext } from "react";

export type BranchData = {
  branchId: number;
  venueId: number;
  venueName: string;
  branchLocation: string;
  managerFirstName: string;
  managerLastName: string;
  email: string;
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
  readonly userData: UserData | null;
  readonly setUserData: Dispatch<SetStateAction<UserData | null>>;
  readonly branchData: BranchData | null;
  readonly setBranchData: Dispatch<SetStateAction<BranchData | null>>;
};

export const UserContext = createContext<ContextProps>({
  userData: null,
  setUserData: () => {},
  branchData: null,
  setBranchData: () => {},
});
