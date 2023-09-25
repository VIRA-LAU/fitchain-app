import React, { useContext, useEffect } from "react";
import { SignUpNavigator } from "./SignUpNavigator";
import { UserContext, getData } from "src/utils";
import { HomeNavigator } from "./HomeNavigator";
import { BranchHomeNavigator } from "./BranchHomeNavigator";
import { Splash } from "src/screens";

export const Authenticator = () => {
  const { userData, branchData, setUserData, setBranchData } =
    useContext(UserContext);

  const getLocalData = async () => {
    const isBranch: boolean = await getData("isBranch");
    if (typeof isBranch !== "undefined") {
      if (isBranch) {
        const branchId: number = await getData("branchId");
        const venueId: number = await getData("venueId");
        const venueName: string = await getData("venueName");
        const branchLocation: string = await getData("branchLocation");
        const managerFirstName: string = await getData("managerFirstName");
        const managerLastName: string = await getData("managerLastName");
        const email: string = await getData("email");
        const token: string = await getData("token");
        if (
          branchId &&
          venueId &&
          venueName &&
          branchLocation &&
          managerFirstName &&
          managerLastName &&
          email &&
          token
        ) {
          setBranchData({
            branchId,
            venueId,
            venueName,
            branchLocation,
            managerFirstName,
            managerLastName,
            email,
            token,
          });
        }
      } else {
        const firstName: string = await getData("firstName");
        const lastName: string = await getData("lastName");
        const email: string = await getData("email");
        const userId: number = await getData("userId");
        const token: string = await getData("token");
        if (firstName && lastName && email && userId && token) {
          setUserData({
            userId,
            firstName,
            lastName,
            email,
            token,
          });
        }
      }
    } else {
      setUserData(null);
      setBranchData(null);
    }
  };

  useEffect(() => {
    getLocalData();
  }, []);

  if (typeof userData === "undefined" && typeof branchData === "undefined")
    return <Splash />;
  else if (userData) return <HomeNavigator />;
  else if (branchData) return <BranchHomeNavigator />;
  else return <SignUpNavigator />;
};
