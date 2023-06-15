import axios, { AxiosInstance } from "axios";
import { UserData, VenueData } from "src/utils";
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
    baseURL: "http://ec2-16-171-9-213.eu-north-1.compute.amazonaws.com:3000",
  });
}

export default client;

export function getHeader(userData: UserData | VenueData) {
  return {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  };
}
