import axios, { AxiosInstance } from "axios";
import { API_URL } from "@dotenv";
import { UserData, BranchData } from "src/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction } from "react";

let client: AxiosInstance;
var resInterceptor: number;

if (API_URL) {
  // Local URL for development
  client = axios.create({
    baseURL: API_URL,
  });
} else {
  // AWS URL for production
  client = axios.create({
    baseURL: "http://ec2-16-170-232-235.eu-north-1.compute.amazonaws.com:3000",
  });
}

export default client;

export const setHeaderAndInterceptors = ({
  userData,
  branchData,
  setUserData,
  setBranchData,
}: {
  userData?: UserData;
  branchData?: BranchData;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
  setBranchData: Dispatch<SetStateAction<BranchData | null>>;
}) => {
  client.defaults.headers.common["Authorization"] = `Bearer ${
    userData?.token || branchData?.token
  }`;

  if (resInterceptor) client.interceptors.response.eject(resInterceptor);

  resInterceptor = client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401) {
        AsyncStorage.clear();
        client.defaults.headers.common["Authorization"] = null;
        setUserData(null);
        setBranchData(null);
      } else throw err;
    }
  );
};
