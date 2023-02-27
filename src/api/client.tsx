import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { UserContext } from "src/utils";
const client = axios.create({
  baseURL: "http://192.168.2.155:3000",
});

export default client;

export function getHeader(userData: any) {
  return {
    headers: {
      Authorization: `Bearer ${userData?.token}`,
    },
  };
}
