import axios from "axios";
import { UserData } from "src/utils";

const client = axios.create({
  baseURL: "http://192.168.55.187:3000",
});

export default client;

export function getHeader(userData: UserData) {
  return {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  };
}
