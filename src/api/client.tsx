import axios, { AxiosInstance } from "axios";
import { UserData } from "src/utils";
import { API_URL } from "@dotenv";

let client: AxiosInstance;
if (API_URL) {
  // Local URL for development
  client = axios.create({
    baseURL: API_URL,
  });
} else {
  // AWS URL for production
  client = axios.create({
    baseURL: "AWS_LINK",
  });
}
export default client;

export function getHeader(userData: UserData) {
  return {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  };
}
