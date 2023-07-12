import { createContext } from "react";

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
  readonly setUserData: (userData: UserData | null) => void;
  readonly branchData: BranchData | null;
  readonly setBranchData: (userData: BranchData | null) => void;
};

export const UserContext = createContext<ContextProps>({
  userData: null,
  setUserData: () => {},
  branchData: null,
  setBranchData: () => {},
});
