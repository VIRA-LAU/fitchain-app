import axios from "axios";
import { UserData } from "src/utils";
import { API_URL } from "@dotenv";

const client = axios.create({
  baseURL: API_URL,
});
export default client;

export function getHeader(userData: UserData) {
  return {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  };
}
