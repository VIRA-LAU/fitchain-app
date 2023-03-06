import axios from "axios";
import { UserContext, UserData } from "src/utils";
import { useContext } from "react";

const client = axios.create({
  baseURL: "http://192.168.0.100:3000",
});

export default client;

export function getHeader(userData: UserData) {
  return {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  };
}
