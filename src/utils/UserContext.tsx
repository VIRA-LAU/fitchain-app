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
  readonly userData: UserData | null | undefined;
  readonly setUserData: (userData: UserData | null | undefined) => void;
  readonly branchData: BranchData | null | undefined;
  readonly setBranchData: (userData: BranchData | null | undefined) => void;
};

export const UserContext = createContext<ContextProps>({
  userData: null,
  setUserData: () => {},
  branchData: null,
  setBranchData: () => {},
});
