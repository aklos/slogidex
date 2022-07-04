import axios from "axios";
import { useQuery } from "react-query";

const api = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
});

export const getHealth = () =>
  useQuery("health", async () => {
    const res = await api.get("healthz");
    return res.data;
  });
