import axios, { AxiosInstance } from "axios";
import { API_URL } from "@dotenv";

let client: AxiosInstance;

// TODO: Fix env variable changes
if (API_URL) {
  // Local URL for development
  client = axios.create({
    baseURL: API_URL,
  });
} else {
  // AWS URL for production
  client = axios.create({
    baseURL: "http://ec2-13-60-42-22.eu-north-1.compute.amazonaws.com:8080",
  });
}

export default client;
