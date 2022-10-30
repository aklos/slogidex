import axios from "axios";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import saveData from "./storage";

// Initialize session token from storage

const api = axios.create({
  baseURL: "https://localhost:3030",
  withCredentials: true,
  headers: {
    "X-Session-Token": saveData.session_token,
  },
});

export function setApiSessionTokenHeader(token: string) {
  api.interceptors.request.use(function (config) {
    if (config.headers) {
      config.headers["X-Session-Token"] = token;
    } else {
      config.headers = { "X-Session-Token": token };
    }

    return config;
  });
}

export const useHealthQuery = () =>
  useQuery(["health"], async () => {
    const res = await api.get("healthz");
    return res.data;
  });

export const useSessionQuery = () =>
  useQuery(["session"], async () => {
    const res = await api.get("/auth/session");
    return res.data;
  });

export const useFeedbackThreadsQuery = () =>
  useQuery(["feedback_threads"], async () => {
    const res = await api.get("/feedback/threads");
    return res.data;
  });

export const useLoginMutation = () =>
  useMutation((data: { email: string }) => {
    return api.post("/auth/login", data);
  });

export const useFeedbackThreadMutation = (queryClient: QueryClient) =>
  useMutation(
    (data: { title: string; body: string }) => {
      return api.post("/feedback/threads", data);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(["feedback_threads"]);
      },
    }
  );
