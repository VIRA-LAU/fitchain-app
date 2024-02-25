import axios, { AxiosInstance } from "axios";
import { API_URL } from "@dotenv";

let client: AxiosInstance;

// TODO: Fix env variable changes
if (false) {
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
